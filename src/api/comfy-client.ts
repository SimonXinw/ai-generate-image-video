import { COMFY_URL } from "../constants";
import type { ComfyStatus, GenerateResult } from "../types";

type ObjectInfo = Record<string, { input?: { required?: Record<string, unknown> } }>;

async function getJson(path: string): Promise<unknown> {
  const res = await fetch(`${COMFY_URL}${path}`);
  if (!res.ok) {
    throw new Error(`ComfyUI ${path} ${res.status}`);
  }
  return res.json();
}

export async function pingComfy(): Promise<ComfyStatus> {
  try {
    const info = (await getJson("/object_info")) as ObjectInfo;
    const ckpt = info.CheckpointLoaderSimple?.input?.required?.ckpt_name;
    const lora = info.LoraLoader?.input?.required?.lora_name;
    const checkpoints = Array.isArray(ckpt) && Array.isArray(ckpt[0]) ? (ckpt[0] as string[]) : [];
    const loras = Array.isArray(lora) && Array.isArray(lora[0]) ? (lora[0] as string[]) : [];
    return {
      ok: true,
      message: `已连接 ${COMFY_URL}`,
      checkpoints,
      loras,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "连接失败";
    return {
      ok: false,
      message: `${message}。先运行 scripts/start-comfyui-1660s.ps1 或 2080s`,
      checkpoints: [],
      loras: [],
    };
  }
}

type HistoryItem = {
  outputs?: Record<string, { images?: { filename: string; subfolder: string; type: string }[] }>;
};

export async function queuePrompt(
  prompt: Record<string, unknown>,
): Promise<string> {
  const res = await fetch(`${COMFY_URL}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `排队失败 ${res.status}`);
  }
  const data = (await res.json()) as { prompt_id: string };
  return data.prompt_id;
}

export async function waitForImage(promptId: string): Promise<GenerateResult> {
  const started = Date.now();
  while (Date.now() - started < 180_000) {
    const history = (await getJson(`/history/${promptId}`)) as Record<string, HistoryItem>;
    const item = history[promptId];
    const images = item?.outputs
      ? Object.values(item.outputs).flatMap((out) => out.images ?? [])
      : [];
    const image = images[0];
    if (image) {
      const query = new URLSearchParams({
        filename: image.filename,
        subfolder: image.subfolder,
        type: image.type,
      });
      return {
        promptId,
        imageUrl: `${COMFY_URL}/view?${query.toString()}`,
      };
    }
    await new Promise((r) => setTimeout(r, 1200));
  }
  throw new Error("生成超时（3 分钟）");
}
