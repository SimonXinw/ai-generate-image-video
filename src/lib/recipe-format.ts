import { HARDWARE_PROFILES } from "../hardware";
import { MODEL_PRESETS } from "../model-presets";
import type { Recipe } from "../recipe-types";
import type {
  FaceLockSettings,
  GenerateParams,
  HardwareId,
  ModelPresetId,
} from "../types";

export function buildRecipe(
  hardware: HardwareId,
  modelPreset: ModelPresetId,
  params: GenerateParams,
  faceLock: FaceLockSettings,
  seed = params.seed,
): Recipe {
  return {
    v: 1,
    hardware,
    modelPreset,
    params: { ...params, seed },
    faceLock: { ...faceLock },
  };
}

/** 给人看的 Markdown + 文末 JSON，整份粘进笔记即可再导入 */
export function recipeToMarkdown(recipe: Recipe): string {
  const { params, faceLock } = recipe;
  const hw = HARDWARE_PROFILES[recipe.hardware]?.label ?? recipe.hardware;
  const preset = MODEL_PRESETS[recipe.modelPreset]?.label ?? recipe.modelPreset;
  const json = JSON.stringify(recipe, null, 2);
  return [
    "# 本地出图配方",
    "",
    `- 机器：${hw}（\`${recipe.hardware}\`）`,
    `- 方案：${preset}（\`${recipe.modelPreset}\`）`,
    `- 尺寸：${params.width}×${params.height}`,
    `- 采样：${params.steps} 步 · CFG ${params.cfg} · ${params.sampler} / ${params.scheduler}`,
    `- CLIP Skip：${params.clipSkip} · 种子：${params.seed}`,
    `- 模型：\`${params.checkpoint || "（未选）"}\``,
    params.lora.trim()
      ? `- LoRA：\`${params.lora}\` @ ${params.loraStrength}`
      : "- LoRA：无",
    `- 放大：${params.upscaleMode}${
      params.upscaleMode === "off"
        ? ""
        : ` · scale ${params.upscaleScale} · denoise ${params.hiresDenoise} · 高分 ${params.hiresSteps} 步`
    }`,
    params.upscaleModel.trim()
      ? `- 放大模型：\`${params.upscaleModel}\``
      : "- 放大模型：无",
    `- 锁脸：${faceLock.enabled ? `开 · 权重 ${faceLock.weight} · 结束 ${faceLock.endAt}` : "关"}（参考图不进配方）`,
    "",
    "## 正向",
    "",
    params.prompt.trim() || "（空）",
    "",
    "## 负向",
    "",
    params.negativePrompt.trim() || "（空）",
    "",
    "导入时复制本文件全文，或只复制下面的 JSON。",
    "",
    "```json",
    json,
    "```",
    "",
  ].join("\n");
}
