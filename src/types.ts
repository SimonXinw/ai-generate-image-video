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
  comfyFlags: string[];
  recommendedModels: string[];
  defaultPrompt: string;
  defaultNegative: string;
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
  sampler: string;
  scheduler: string;
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
  seed: number;
};

export type ProgressState = {
  percent: number;
  step: number;
  max: number;
  label: string;
  previewUrl: string;
};

export type HistoryItem = {
  url: string;
  seed: number;
  at: number;
  params: GenerateParams;
};

export type GenerationMeta = {
  params: GenerateParams;
  seed: number;
};

export type MetaPanelProps = {
  meta: GenerationMeta | null;
  onReuseSeed: (seed: number) => void;
};

export type OutfitId = "clothed" | "topless" | "nude";

export type LightboxProps = {
  imageUrl: string;
  onClose: () => void;
};

export type SizePreset = {
  label: string;
  width: number;
  height: number;
  note: string;
};

export type InfoTipProps = {
  text: string;
};

export type SizePresetsProps = {
  params: GenerateParams;
  onChange: (next: GenerateParams) => void;
};
