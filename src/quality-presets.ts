import type {
  GenerateParams,
  ModelPresetId,
  QualityId,
  QualityPreset,
} from "./types";

export const QUALITY_IDS: QualityId[] = ["fast", "balanced", "fine"];

/** 画质按模型，不按机器。Pony 是动画档，另外两个是写实档。 */
export const QUALITY_PRESETS: Record<
  ModelPresetId,
  Record<QualityId, QualityPreset>
> = {
  dreamShaper8: {
    fast: { id: "fast", label: "快速", steps: 16, cfg: 6, note: "写实试构图" },
    balanced: {
      id: "balanced",
      label: "均衡",
      steps: 28,
      cfg: 7,
      note: "DreamShaper 写实日常",
    },
    fine: { id: "fine", label: "精细", steps: 32, cfg: 7, note: "写实加步数" },
  },
  ponyV6: {
    fast: { id: "fast", label: "快速", steps: 16, cfg: 6.5, note: "二次元试构图" },
    balanced: {
      id: "balanced",
      label: "均衡",
      steps: 24,
      cfg: 7,
      note: "Pony 动画日常",
    },
    fine: { id: "fine", label: "精细", steps: 32, cfg: 7, note: "二次元加步数" },
  },
  cyberRealisticPony: {
    fast: { id: "fast", label: "快速", steps: 20, cfg: 5, note: "写实试构图，CFG 5" },
    balanced: {
      id: "balanced",
      label: "均衡",
      steps: 30,
      cfg: 5,
      note: "Cyber 写实日常，CFG 5 防假",
    },
    fine: { id: "fine", label: "精细", steps: 35, cfg: 5, note: "写实加步数" },
  },
};

export function qualityList(presetId: ModelPresetId): QualityPreset[] {
  return QUALITY_IDS.map((id) => QUALITY_PRESETS[presetId][id]);
}

export function balancedQuality(
  presetId: ModelPresetId,
): Pick<GenerateParams, "steps" | "cfg"> {
  const preset = QUALITY_PRESETS[presetId].balanced;
  return { steps: preset.steps, cfg: preset.cfg };
}

export function activeQualityId(
  params: GenerateParams,
  presetId: ModelPresetId,
): QualityId | null {
  const hit = QUALITY_IDS.find((id) => {
    const preset = QUALITY_PRESETS[presetId][id];
    return preset.steps === params.steps && preset.cfg === params.cfg;
  });
  return hit ?? null;
}
