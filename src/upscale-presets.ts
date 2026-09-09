import type { HardwareId } from "./types";
import type { UpscaleChip, UpscaleMode } from "./upscale-types";

/** 按机型给推荐芯片；6GB 默认只推 1.5× 高分，2× 留给手动 */
const CHIPS_1660S: UpscaleChip[] = [
  { id: "off", label: "关闭", note: "只出底图", scale: 1 },
  { id: "hires", label: "高分 1.5×", note: "像素放大后二次采样，约 768×1152", scale: 1.5 },
  { id: "esrgan", label: "ESRGAN", note: "像素分块放大，约 2K+", scale: 1 },
  {
    id: "hires_esrgan",
    label: "高分+ESRGAN",
    note: "1.5× 后再模型放大，慢、更清",
    scale: 1.5,
  },
];

const CHIPS_2080S: UpscaleChip[] = [
  { id: "off", label: "关闭", note: "只出底图", scale: 1 },
  { id: "hires", label: "高分 1.5×", note: "像素放大后二次采样", scale: 1.5 },
  { id: "esrgan", label: "ESRGAN", note: "像素分块放大", scale: 1 },
  {
    id: "hires_esrgan",
    label: "高分+ESRGAN",
    note: "更细，更吃显存与时间",
    scale: 1.5,
  },
];

export function upscaleChips(hardwareId: HardwareId): UpscaleChip[] {
  return hardwareId === "gtx1660s" ? CHIPS_1660S : CHIPS_2080S;
}

export function needsUpscaleModel(mode: UpscaleMode): boolean {
  return mode === "esrgan" || mode === "hires_esrgan";
}

export function needsHires(mode: UpscaleMode): boolean {
  return mode === "hires" || mode === "hires_esrgan";
}

/** 高分倍率的有效区间。UI 预估、文件名、workflow 三处必须用同一份 */
export function hiresScale(scale: number): number {
  return Math.min(2, Math.max(1.25, scale || 1.5));
}

/**
 * 高分第二段的目标像素尺寸。
 * VAE 编码会把非 8 倍数的边裁掉（comfy/sd.py vae_encode_crop_pixels），
 * 所以这里先对齐到 8，成品尺寸才和预估、文件名一致。
 */
export function hiresTarget(
  width: number,
  height: number,
  scale: number,
): { width: number; height: number } {
  const s = hiresScale(scale);
  const snap = (n: number) => Math.max(8, Math.round((n * s) / 8) * 8);
  return { width: snap(width), height: snap(height) };
}

/** 估算最终像素边长说明 */
export function upscaleResultHint(
  width: number,
  height: number,
  mode: UpscaleMode,
  scale: number,
  modelFactor = 4,
): string {
  if (mode === "off") return "最终尺寸 = 底图像素";
  if (mode === "hires") {
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    return `最终约 ${w}×${h}`;
  }
  if (mode === "esrgan") {
    return `最终约 ${width * modelFactor}×${height * modelFactor}（看模型倍率）`;
  }
  const w = Math.round(width * scale) * modelFactor;
  const h = Math.round(height * scale) * modelFactor;
  return `最终约 ${w}×${h}（高分后再 ×${modelFactor}）`;
}
