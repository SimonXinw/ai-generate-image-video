import type { GenerateParams, HardwareId } from "../types";
import type { UpscaleMode } from "../upscale-types";
import { needsHires, needsUpscaleModel } from "../upscale-presets";

const ESRGAN_FACTOR = 4;

export function finalSize(
  width: number,
  height: number,
  mode: UpscaleMode,
  scale: number,
): { width: number; height: number } {
  if (mode === "off") return { width, height };
  if (mode === "hires") {
    return {
      width: Math.round(width * scale),
      height: Math.round(height * scale),
    };
  }
  if (mode === "esrgan") {
    return { width: width * ESRGAN_FACTOR, height: height * ESRGAN_FACTOR };
  }
  return {
    width: Math.round(width * scale) * ESRGAN_FACTOR,
    height: Math.round(height * scale) * ESRGAN_FACTOR,
  };
}

export function upscaleModeLabel(mode: UpscaleMode): string {
  if (mode === "off") return "小图";
  if (mode === "hires") return "高分";
  if (mode === "esrgan") return "ESRGAN";
  return "高分+ESRGAN";
}

export function submitButtonLabel(params: GenerateParams, busy: boolean): string {
  if (busy) return "生成中…";
  if (params.upscaleMode === "off") return "开始生成（小图）";
  const size = finalSize(
    params.width,
    params.height,
    params.upscaleMode,
    params.upscaleScale,
  );
  return `生成并放大 · ${size.width}×${size.height}`;
}

export function upscaleWarnings(
  params: GenerateParams,
  hardwareId: HardwareId,
  upscaleModels: string[],
  faceOn: boolean,
): string[] {
  const notes: string[] = [];
  const mode = params.upscaleMode;
  if (mode === "off") return notes;

  if (needsUpscaleModel(mode) && upscaleModels.length === 0) {
    notes.push("未安装放大模型：先跑 download-upscale-model.ps1，再重启 ComfyUI。");
  }
  if (needsUpscaleModel(mode) && upscaleModels.length > 0 && !params.upscaleModel.trim()) {
    notes.push("请在下方选择放大模型。");
  }

  const base = params.width * params.height;
  if (hardwareId === "gtx1660s" && base > 512 * 768 && needsHires(mode)) {
    notes.push("1660S 底图已大于 512×768，再开高分容易 OOM 或很慢，建议先降画幅。");
  }
  if (hardwareId === "rtx2080s" && base > 832 * 1216 && mode === "hires_esrgan") {
    notes.push("底图偏大又开高分+ESRGAN，8GB 可能顶不住，可先关锁脸/LoRA。");
  }
  if (faceOn && mode === "hires_esrgan") {
    notes.push("锁脸 + 高分+ESRGAN 很吃显存与时间；构图未定时建议先关放大。");
  }
  if (params.lora.trim() && mode === "hires_esrgan" && hardwareId === "gtx1660s") {
    notes.push("1660S 上 LoRA 与高分+ESRGAN 同开会更慢，OOM 就先去掉 LoRA。");
  }
  return notes;
}

export function progressStartLabel(mode: UpscaleMode): string {
  if (mode === "off") return "提交小图任务";
  if (mode === "hires") return "提交：底图 → 高分修复";
  if (mode === "esrgan") return "提交：底图 → ESRGAN 放大";
  return "提交：底图 → 高分 → ESRGAN";
}
