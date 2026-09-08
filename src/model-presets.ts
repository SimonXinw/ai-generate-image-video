import type { GenerateParams, ModelPreset, ModelPresetId } from "./types";

export const MODEL_PRESETS: Record<ModelPresetId, ModelPreset> = {
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

export const MODEL_PRESET_IDS: ModelPresetId[] = ["ponyV6", "cyberRealisticPony"];

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
