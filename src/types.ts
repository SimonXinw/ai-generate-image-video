import type { UpscaleMode } from "./upscale-types";

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
  /** 该机器主用底模的原生训练面积：SD1.5 是 512²，SDXL 是 1024² */
  basePixels: number;
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
  upscaleMode: UpscaleMode;
  upscaleScale: number;
  hiresDenoise: number;
  hiresSteps: number;
  upscaleModel: string;
};

export type ComfyStatus = {
  ok: boolean;
  message: string;
  checkpoints: string[];
  loras: string[];
  faceLockAvailable: boolean;
  upscaleModels: string[];
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
  profile: HardwareProfile;
  onChange: (next: GenerateParams) => void;
};

export type ModelPresetId = "ponyV6" | "cyberRealisticPony" | "dreamShaper8";

export type ModelPreset = {
  id: ModelPresetId;
  label: string;
  description: string;
  checkpointIncludes: string[];
  clipSkip: number;
  sampler: string;
  scheduler: string;
  width: number;
  height: number;
  minVramGb: number;
};

export type QualityId = "fast" | "balanced" | "fine";

export type QualityPreset = {
  id: QualityId;
  label: string;
  steps: number;
  cfg: number;
  note: string;
};

export type QualityPresetsProps = {
  params: GenerateParams;
  profile: HardwareProfile;
  modelPresetId: ModelPresetId;
  onChange: (next: GenerateParams) => void;
};

export type ModelPresetPickerProps = {
  activeId: ModelPresetId;
  checkpoints: string[];
  vramGb: number;
  onChange: (id: ModelPresetId) => void;
};

export type ImageOptionsProps = {
  params: GenerateParams;
  onChange: (next: GenerateParams) => void;
};

export type ProgressPanelProps = {
  busy: boolean;
  progress: ProgressState | null;
};

export type HardwareSwitcherProps = {
  profile: HardwareProfile;
  onChange: (id: HardwareId) => void;
};

export type HardwareBannerProps = {
  comfyMessage: string;
  comfyOk: boolean;
};

export type {
  FaceLockSettings,
  FaceLockWorkflow,
  FaceLockPanelProps,
} from "./face-lock-types";

export type {
  UpscaleMode,
  UpscalePanelProps,
} from "./upscale-types";

export type { PromptFormProps, ResultViewProps } from "./ui-types";
