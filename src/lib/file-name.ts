import { finalSize } from "./upscale-guard";
import type { GenerateParams, GenerationMeta } from "../types";

/** Windows 单个文件名上限 255，留足前缀路径的余量 */
const MAX_BASE = 190;

/**
 * 去掉目录与模型扩展名，再把文件系统不接受的字符压成 -。
 * 下划线留给字段分隔用，所以 token 内部的 _ 也换成 -。
 */
function safeToken(raw: string, max: number): string {
  const stem = raw.split(/[\\/]/).pop() ?? "";
  const noExt = stem.replace(/\.(safetensors|ckpt|pth|pt|bin|png|jpg|jpeg|webp)$/i, "");
  return noExt
    .replace(/[^A-Za-z0-9.-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, max);
}

/** 20260910-021530：年月日-时分秒，按名字排序就是按出图顺序 */
function stamp(at: number): string {
  const d = new Date(at);
  const p = (n: number) => String(n).padStart(2, "0");
  const day = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
  return `${day}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function upscaleTokens(params: GenerateParams): string[] {
  const mode = params.upscaleMode;
  if (mode === "off") return ["up-off"];
  const parts: string[] = [];
  if (mode === "hires" || mode === "hires_esrgan") {
    parts.push(
      `hires${params.upscaleScale}x-dn${params.hiresDenoise}-st${params.hiresSteps}`,
    );
  }
  if (mode === "esrgan" || mode === "hires_esrgan") {
    parts.push(`esrgan-${safeToken(params.upscaleModel, 20) || "na"}`);
  }
  const out = finalSize(params.width, params.height, mode, params.upscaleScale);
  return [`up-${parts.join("-")}`, `out${out.width}x${out.height}`];
}

/** /view?filename=local_gen_00058_.png 里带着 ComfyUI 的存盘名 */
function sourceName(url: string): string {
  try {
    const name = new URL(url, window.location.href).searchParams.get("filename");
    return name?.split(/[\\/]/).pop() ?? "";
  } catch {
    return "";
  }
}

export function sourceExt(url: string): string {
  const ext = sourceName(url).split(".").pop();
  return ext && /^[A-Za-z0-9]{2,5}$/.test(ext) ? ext.toLowerCase() : "png";
}

/** 没有参数快照时的兜底名 */
export function sourceFileName(url: string): string {
  return sourceName(url) || `local_gen.${sourceExt(url)}`;
}

/**
 * 下载名 = 出图时间 + 本次全部参数（不含正负提示词），例如
 * 20260910-021530_cyberrealisticPony-v9_832x1216_st28_cfg6.5_seed1234_dpmpp-2m-karras_clip2_up-off.png
 */
export function imageFileName(meta: GenerationMeta, url: string): string {
  const { params, seed } = meta;
  const tokens = [
    stamp(meta.at),
    safeToken(params.checkpoint, 26) || "model",
    `${params.width}x${params.height}`,
    `st${params.steps}`,
    `cfg${params.cfg}`,
    `seed${seed}`,
    `${safeToken(params.sampler, 16)}-${safeToken(params.scheduler, 16)}`,
    `clip${params.clipSkip}`,
    ...upscaleTokens(params),
  ];
  if (params.lora.trim()) {
    tokens.push(`lora-${safeToken(params.lora, 22)}-${params.loraStrength}`);
  }
  const base = tokens
    .filter(Boolean)
    .join("_")
    .slice(0, MAX_BASE)
    .replace(/[-_.]+$/, "");
  return `${base}.${sourceExt(url)}`;
}
