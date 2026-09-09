import type { GenerateParams, HardwareId } from "./types";

/** off=不放大；hires=潜空间二次采样；esrgan=像素模型放大；hires_esrgan=先高分再 ESRGAN */
export type UpscaleMode = "off" | "hires" | "esrgan" | "hires_esrgan";

export type UpscaleChip = {
  id: UpscaleMode;
  label: string;
  note: string;
  /** 仅 hires / hires_esrgan 用；esrgan 倍率由模型决定 */
  scale: number;
};

export type UpscalePanelProps = {
  params: GenerateParams;
  hardwareId: HardwareId;
  upscaleModels: string[];
  faceOn: boolean;
  onChange: (next: GenerateParams) => void;
};

export const UPSCALE_MODES: UpscaleMode[] = [
  "off",
  "hires",
  "esrgan",
  "hires_esrgan",
];

export const DEFAULT_UPSCALE = {
  upscaleMode: "off" as UpscaleMode,
  upscaleScale: 1.5,
  hiresDenoise: 0.4,
  hiresSteps: 12,
  upscaleModel: "",
};
