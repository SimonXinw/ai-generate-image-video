import type {
  GenerateParams,
  HardwareId,
  HardwareProfile,
  ModelPreset,
  ModelPresetId,
} from "./types";

export const MODEL_PRESETS: Record<ModelPresetId, ModelPreset> = {
  dreamShaper8: {
    id: "dreamShaper8",
    label: "1660S · DreamShaper 8",
    description: "SD1.5 约 2GB；6GB 显存主推，用自然语言提示词，不要写 score_9。",
    checkpointIncludes: ["dreamshaper_8_pruned", "dreamshaper_8"],
    width: 512,
    height: 768,
    steps: 24,
    cfg: 6,
    clipSkip: 2,
    sampler: "euler_ancestral",
    scheduler: "normal",
    minVramGb: 6,
  },
  ponyV6: {
    id: "ponyV6",
    label: "Pony V6 · 二次元/通用",
    description: "现有 Pony 模型，适合 score 标签和角色 LoRA。",
    checkpointIncludes: ["ponydiffusionv6xl", "ponyDiffusionV6XL"],
    width: 768,
    height: 1152,
    steps: 22,
    cfg: 7,
    clipSkip: 2,
    sampler: "euler_ancestral",
    scheduler: "normal",
    minVramGb: 8,
  },
  cyberRealisticPony: {
    id: "cyberRealisticPony",
    label: "成人写实 · CyberRealistic Pony",
    description: "v18 CoreShift FP16；保留 Pony 标签，强化真人皮肤与摄影光线。",
    checkpointIncludes: ["cyberrealisticpony_v18", "cyberrealisticpony"],
    width: 832,
    height: 1216,
    steps: 30,
    cfg: 5,
    clipSkip: 2,
    sampler: "dpmpp_2m",
    scheduler: "karras",
    minVramGb: 8,
  },
};

export const MODEL_PRESET_IDS: ModelPresetId[] = [
  "dreamShaper8",
  "ponyV6",
  "cyberRealisticPony",
];

export function preferredPresetId(hwId: HardwareId): ModelPresetId {
  return hwId === "gtx1660s" ? "dreamShaper8" : "ponyV6";
}

export function mergeHardwarePreset(
  prev: GenerateParams,
  profile: HardwareProfile,
  checkpoints: string[],
): GenerateParams {
  const preset = MODEL_PRESETS[preferredPresetId(profile.id)];
  const checkpoint = findPresetCheckpoint(preset, checkpoints);
  const withHw: GenerateParams = {
    ...prev,
    prompt: profile.defaultPrompt,
    negativePrompt: profile.defaultNegative,
    ...profile.sizeByAspect.portrait,
    steps: profile.defaultSteps,
    cfg: profile.defaultCfg,
  };
  return checkpoint ? applyPreset(withHw, preset, checkpoint) : withHw;
}

export function findPresetCheckpoint(
  preset: ModelPreset,
  checkpoints: string[],
): string | undefined {
  return checkpoints.find((name) => {
    const lower = name.toLowerCase();
    return preset.checkpointIncludes.some((part) => lower.includes(part.toLowerCase()));
  });
}

export function applyPreset(
  params: GenerateParams,
  preset: ModelPreset,
  checkpoint: string,
): GenerateParams {
  return {
    ...params,
    checkpoint,
    width: preset.width,
    height: preset.height,
    steps: preset.steps,
    cfg: preset.cfg,
    clipSkip: preset.clipSkip,
    sampler: preset.sampler,
    scheduler: preset.scheduler,
  };
}
