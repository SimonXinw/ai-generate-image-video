import { COMFY_URL } from "../constants";
import { CancelledError, getJson, sleep } from "./comfy-http";
import type { GenerateResult, ProgressState } from "../types";

type Hist = {
  outputs?: Record<string, { images?: { filename: string; subfolder: string; type: string }[] }>;
};

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
  signal?: AbortSignal,
  timeoutMs = 300_000,
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
    while (Date.now() - started < timeoutMs) {
      if (signal?.aborted) throw new CancelledError();
      const history = (await getJson(`/history/${promptId}`, signal)) as Record<string, Hist>;
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
      await sleep(800, signal);
    }
    throw new Error(`生成超时（${Math.round(timeoutMs / 60_000)} 分钟）`);
  } finally {
    ws.close();
  }
}
