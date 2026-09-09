import { balancedQuality } from "./quality-presets";
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
    description: "写实 SD1.5；自然语言，不要写 score_9。",
    checkpointIncludes: ["dreamshaper_8_pruned", "dreamshaper_8"],
    clipSkip: 1,
    sampler: "dpmpp_2m",
    scheduler: "karras",
    width: 512,
    height: 768,
    minVramGb: 6,
  },
  ponyV6: {
    id: "ponyV6",
    label: "Pony V6 · 二次元/通用",
    description: "动画向。score 标签和角色 LoRA。",
    checkpointIncludes: ["ponydiffusionv6xl", "ponyDiffusionV6XL"],
    clipSkip: 2,
    sampler: "euler_ancestral",
    scheduler: "normal",
    width: 768,
    height: 1152,
    minVramGb: 8,
  },
  cyberRealisticPony: {
    id: "cyberRealisticPony",
    label: "成人写实 · CyberRealistic Pony",
    description: "写实。Pony 标签，CFG 必须 5，CLIP Skip 2。",
    checkpointIncludes: ["cyberrealisticpony_v18", "cyberrealisticpony"],
    clipSkip: 2,
    sampler: "dpmpp_2m",
    scheduler: "karras",
    width: 832,
    height: 1216,
    minVramGb: 8,
  },
};

export function presetParamLine(preset: ModelPreset): string {
  return `${preset.width}×${preset.height} · ${preset.sampler} / ${preset.scheduler} · CLIP ${preset.clipSkip}`;
}

export const MODEL_PRESET_IDS: ModelPresetId[] = [
  "dreamShaper8",
  "ponyV6",
  "cyberRealisticPony",
];

export function preferredPresetId(hwId: HardwareId): ModelPresetId {
  return hwId === "gtx1660s" ? "dreamShaper8" : "cyberRealisticPony";
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
    ...applyModelSampling(preset),
  };
  return checkpoint ? { ...withHw, checkpoint } : withHw;
}

export function findPresetCheckpoint(
  preset: ModelPreset,
  checkpoints: string[],
): string | undefined {
  return checkpoints.find((name) => {
    const lower = name.toLowerCase();
    return preset.checkpointIncludes.some((part) =>
      lower.includes(part.toLowerCase()),
    );
  });
}

function applyModelSampling(preset: ModelPreset): Partial<GenerateParams> {
  return {
    clipSkip: preset.clipSkip,
    sampler: preset.sampler,
    scheduler: preset.scheduler,
    width: preset.width,
    height: preset.height,
    ...balancedQuality(preset.id),
  };
}

/** 换模型时套该模型的采样、画幅和均衡档，提示词不改 */
export function applyPreset(
  params: GenerateParams,
  preset: ModelPreset,
  checkpoint: string,
): GenerateParams {
  return {
    ...params,
    checkpoint,
    ...applyModelSampling(preset),
  };
}
