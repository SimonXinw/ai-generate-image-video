import type { HardwareId } from "./types";
import type { UpscaleChip, UpscaleMode } from "./upscale-types";

/** 按机型给推荐芯片；6GB 默认只推 1.5× 高分，2× 留给手动 */
const CHIPS_1660S: UpscaleChip[] = [
  { id: "off", label: "关闭", note: "只出底图", scale: 1 },
  { id: "hires", label: "高分 1.5×", note: "潜空间二次采样，约 768×1152", scale: 1.5 },
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
  { id: "hires", label: "高分 1.5×", note: "潜空间二次采样", scale: 1.5 },
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
