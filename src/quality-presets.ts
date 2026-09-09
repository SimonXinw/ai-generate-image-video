import type { GenerateParams, HardwareId, QualityId, QualityPreset } from "./types";

export const QUALITY_IDS: QualityId[] = ["fast", "balanced", "fine"];

/** 步数与 CFG 按机器分开给：6GB 要能快出草稿，8GB 才敢堆到 32 步 */
export const QUALITY_PRESETS: Record<HardwareId, Record<QualityId, QualityPreset>> = {
  gtx1660s: {
    fast: { id: "fast", label: "快速", steps: 14, cfg: 5.5, note: "试构图用，十几秒一张" },
    balanced: { id: "balanced", label: "均衡", steps: 24, cfg: 6, note: "SD1.5 日常出图" },
    fine: { id: "fine", label: "精细", steps: 32, cfg: 6.5, note: "细节更足，耗时约翻倍" },
  },
  rtx2080s: {
    fast: { id: "fast", label: "快速", steps: 16, cfg: 6.5, note: "试构图用，先看大致效果" },
    balanced: { id: "balanced", label: "均衡", steps: 24, cfg: 7, note: "Pony/SDXL 日常出图" },
    fine: { id: "fine", label: "精细", steps: 32, cfg: 6, note: "写实出片，CFG 略降防过曝" },
  },
};

export function qualityList(hwId: HardwareId): QualityPreset[] {
  return QUALITY_IDS.map((id) => QUALITY_PRESETS[hwId][id]);
}

/** 均衡档兼任该机器的默认步数与 CFG */
export function balancedQuality(hwId: HardwareId): Pick<GenerateParams, "steps" | "cfg"> {
  const preset = QUALITY_PRESETS[hwId].balanced;
  return { steps: preset.steps, cfg: preset.cfg };
}

/** 手动改过步数或 CFG 时返回 null，用来显示「自定义」 */
export function activeQualityId(
  params: GenerateParams,
  hwId: HardwareId,
): QualityId | null {
  const hit = QUALITY_IDS.find((id) => {
    const preset = QUALITY_PRESETS[hwId][id];
    return preset.steps === params.steps && preset.cfg === params.cfg;
  });
  return hit ?? null;
}
