import { COMFY_URL } from "../constants";
import { comboNames } from "./comfy-combo";
import { getJson } from "./comfy-http";
import type { ComfyStatus } from "../types";

type ObjectInfo = Record<string, { input?: { required?: Record<string, unknown> } }>;

export function newClientId(): string {
  return crypto.randomUUID();
}

export async function pingComfy(): Promise<ComfyStatus> {
  try {
    const info = (await getJson("/object_info")) as ObjectInfo;
    const checkpoints = comboNames(
      info.CheckpointLoaderSimple?.input?.required?.ckpt_name,
    );
    const loras = comboNames(info.LoraLoader?.input?.required?.lora_name);
    const faceLockAvailable = Boolean(
      info.IPAdapterUnifiedLoaderFaceID && info.IPAdapterFaceID,
    );
    const upscaleModels = comboNames(
      info.UpscaleModelLoader?.input?.required?.model_name,
    );
    return {
      ok: true,
      message: `已连接 ${COMFY_URL}`,
      checkpoints,
      loras,
      faceLockAvailable,
      upscaleModels,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "连接失败";
    return {
      ok: false,
      message: `${message}。先运行 start-comfyui-1660s.ps1`,
      checkpoints: [],
      loras: [],
      faceLockAvailable: false,
      upscaleModels: [],
    };
  }
}

export async function uploadInputImage(file: File): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]+/g, "_");
  const data = new FormData();
  data.append("image", file, `face_${crypto.randomUUID()}_${safeName}`);
  data.append("type", "input");
  data.append("overwrite", "true");
  const res = await fetch(`${COMFY_URL}/upload/image`, {
    method: "POST",
    body: data,
  });
  if (!res.ok) throw new Error((await res.text()) || `参考脸上传失败 ${res.status}`);
  const uploaded = (await res.json()) as { name: string; subfolder?: string };
  return uploaded.subfolder
    ? `${uploaded.subfolder}/${uploaded.name}`
    : uploaded.name;
}

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

/**
 * 停止出图。/interrupt 只能打断正在跑的那个，
 * 还在排队的要用 /queue delete 摘掉，所以两个都发。
 */
export async function cancelPrompt(promptId: string): Promise<void> {
  const calls: Promise<unknown>[] = [
    fetch(`${COMFY_URL}/interrupt`, { method: "POST" }),
  ];
  if (promptId) {
    calls.push(
      fetch(`${COMFY_URL}/queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delete: [promptId] }),
      }),
    );
  }
  await Promise.allSettled(calls);
}
