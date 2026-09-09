import { COMFY_URL } from "../constants";

/** 用户主动停止，和真正的失败区分开，不当报错展示 */
export class CancelledError extends Error {
  constructor() {
    super("已停止出图");
    this.name = "CancelledError";
  }
}

export async function getJson(path: string, signal?: AbortSignal): Promise<unknown> {
  const res = await fetch(`${COMFY_URL}${path}`, { signal });
  if (!res.ok) throw new Error(`ComfyUI ${path} ${res.status}`);
  return res.json();
}

/** 可被 abort 打断的等待，用于轮询间隔 */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new CancelledError());
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new CancelledError());
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
