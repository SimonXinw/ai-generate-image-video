import { COMFY_URL } from "../constants";
import type { ComfyStatus, GenerateResult, ProgressState } from "../types";

type ObjectInfo = Record<string, { input?: { required?: Record<string, unknown> } }>;

async function getJson(path: string): Promise<unknown> {
  const res = await fetch(`${COMFY_URL}${path}`);
  if (!res.ok) throw new Error(`ComfyUI ${path} ${res.status}`);
  return res.json();
}

export function newClientId(): string {
  return crypto.randomUUID();
}

export async function pingComfy(): Promise<ComfyStatus> {
  try {
    const info = (await getJson("/object_info")) as ObjectInfo;
    const ckpt = info.CheckpointLoaderSimple?.input?.required?.ckpt_name;
    const lora = info.LoraLoader?.input?.required?.lora_name;
    const checkpoints = Array.isArray(ckpt) && Array.isArray(ckpt[0]) ? (ckpt[0] as string[]) : [];
    const loras = Array.isArray(lora) && Array.isArray(lora[0]) ? (lora[0] as string[]) : [];
    return { ok: true, message: `已连接 ${COMFY_URL}`, checkpoints, loras };
  } catch (error) {
    const message = error instanceof Error ? error.message : "连接失败";
    return {
      ok: false,
      message: `${message}。先运行 start-comfyui-1660s.ps1`,
      checkpoints: [],
      loras: [],
    };
  }
}

type Hist = {
  outputs?: Record<string, { images?: { filename: string; subfolder: string; type: string }[] }>;
};

export async function queuePrompt(
  prompt: Record<string, unknown>,
  clientId: string,
): Promise<string> {
  const res = await fetch(`${COMFY_URL}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, client_id: clientId }),
  });
  if (!res.ok) throw new Error((await res.text()) || `排队失败 ${res.status}`);
  const data = (await res.json()) as { prompt_id: string };
  return data.prompt_id;
}

function wsUrl(clientId: string): string {
  const u = new URL(COMFY_URL);
  u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
  u.pathname = "/ws";
  u.search = `clientId=${encodeURIComponent(clientId)}`;
  return u.toString();
}

function readPreview(buf: ArrayBuffer): string | null {
  if (buf.byteLength < 9) return null;
  const view = new DataView(buf);
  const kind = view.getUint32(0);
  if (kind !== 1) return null;
  const blob = new Blob([buf.slice(8)], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
}

export async function waitForImage(
  promptId: string,
  clientId: string,
  seed: number,
  onProgress: (p: ProgressState) => void,
): Promise<GenerateResult> {
  let previewUrl = "";
  let last: ProgressState = {
    percent: 2,
    step: 0,
    max: 1,
    label: "排队中",
    previewUrl: "",
  };
  const push = (patch: Partial<ProgressState>) => {
    last = { ...last, ...patch, previewUrl: patch.previewUrl ?? last.previewUrl };
    onProgress(last);
  };
  const ws = new WebSocket(wsUrl(clientId));
  ws.binaryType = "arraybuffer";
  const onBinary = (buf: ArrayBuffer) => {
    const url = readPreview(buf);
    if (!url) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = url;
    push({ label: last.step ? last.label : "预览中", previewUrl });
  };
  ws.onmessage = (ev) => {
    if (ev.data instanceof ArrayBuffer) {
      onBinary(ev.data);
      return;
    }
    if (ev.data instanceof Blob) {
      void ev.data.arrayBuffer().then(onBinary);
      return;
    }
    try {
      const msg = JSON.parse(String(ev.data)) as {
        type: string;
        data?: { value?: number; max?: number };
      };
      if (msg.type === "progress" && msg.data?.max) {
        const step = msg.data.value ?? 0;
        const max = msg.data.max;
        push({
          percent: Math.max(4, Math.round((step / max) * 100)),
          step,
          max,
          label: `采样 ${step}/${max}`,
        });
      }
    } catch {
      /* ignore */
    }
  };
  onProgress(last);

  const started = Date.now();
  try {
    while (Date.now() - started < 300_000) {
      const history = (await getJson(`/history/${promptId}`)) as Record<string, Hist>;
      const images = history[promptId]?.outputs
        ? Object.values(history[promptId].outputs!).flatMap((o) => o.images ?? [])
        : [];
      const image = images[0];
      if (image) {
        const query = new URLSearchParams({
          filename: image.filename,
          subfolder: image.subfolder,
          type: image.type,
        });
        push({ percent: 100, label: "完成", previewUrl });
        return { promptId, seed, imageUrl: `${COMFY_URL}/view?${query.toString()}` };
      }
      await new Promise((r) => setTimeout(r, 800));
    }
    throw new Error("生成超时（5 分钟）");
  } finally {
    ws.close();
  }
}
