export type AspectPreset = "portrait" | "square" | "landscape";

export type HardwareId = "rtx2080s" | "gtx1660s";

export type HardwareProfile = {
  id: HardwareId;
  label: string;
  cpu: string;
  gpu: string;
  ram: string;
  vramGb: number;
  imageOk: string;
  fluxNote: string;
  videoNote: string;
  buyIfWantMore: string;
  /** ComfyUI 启动建议参数 */
  comfyFlags: string[];
  recommendedModels: string[];
  sizeByAspect: Record<AspectPreset, { width: number; height: number }>;
  defaultSteps: number;
  defaultCfg: number;
};

export type GenerateParams = {
  prompt: string;
  negativePrompt: string;
  checkpoint: string;
  lora: string;
  loraStrength: number;
  width: number;
  height: number;
  steps: number;
  cfg: number;
  seed: number;
  clipSkip: number;
};

export type ComfyStatus = {
  ok: boolean;
  message: string;
  checkpoints: string[];
  loras: string[];
};

export type GenerateResult = {
  imageUrl: string;
  promptId: string;
};
