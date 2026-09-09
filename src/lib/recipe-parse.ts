import { HARDWARE_IDS } from "../hardware";
import { MODEL_PRESET_IDS } from "../model-presets";
import type { Recipe, RecipeParseResult } from "../recipe-types";
import type { FaceLockSettings, GenerateParams, HardwareId, ModelPresetId } from "../types";

const JSON_FENCE = /```json\s*([\s\S]*?)```/gi;

export function parseRecipeText(raw: string): RecipeParseResult {
  const text = raw.trim();
  if (!text) return { ok: false, error: "剪贴板是空的" };

  const fromJson = tryParseJson(text);
  if (fromJson.ok) return fromJson;

  const blocks = [...text.matchAll(JSON_FENCE)].map((m) => m[1]?.trim() ?? "");
  for (let i = blocks.length - 1; i >= 0; i -= 1) {
    const parsed = tryParseJson(blocks[i]);
    if (parsed.ok) return parsed;
  }
  return { ok: false, error: "没找到可导入的配方 JSON（需要带 v: 1 的代码块）" };
}

export function recipeWarnings(recipe: Recipe, checkpoints: string[], loras: string[]): string[] {
  const notes: string[] = [];
  if (recipe.params.checkpoint && !checkpoints.includes(recipe.params.checkpoint)) {
    notes.push(`本机没有模型 ${recipe.params.checkpoint}`);
  }
  if (recipe.params.lora.trim() && !loras.includes(recipe.params.lora)) {
    notes.push(`本机没有 LoRA ${recipe.params.lora}`);
  }
  if (recipe.faceLock.enabled) {
    notes.push("锁脸已打开，请重新选参考图");
  }
  if (recipe.params.upscaleMode !== "off") {
    notes.push(`放大模式：${recipe.params.upscaleMode}`);
  }
  if (
    (recipe.params.upscaleMode === "esrgan" ||
      recipe.params.upscaleMode === "hires_esrgan") &&
    recipe.params.upscaleModel
  ) {
    notes.push("若本机没有该放大模型，请先 download-upscale-model.ps1");
  }
  return notes;
}

function tryParseJson(text: string): RecipeParseResult {
  try {
    const data: unknown = JSON.parse(text);
    const recipe = asRecipe(data);
    if (!recipe) return { ok: false, error: "JSON 不是 v1 配方" };
    return { ok: true, recipe };
  } catch {
    return { ok: false, error: "JSON 解析失败" };
  }
}

function asRecipe(data: unknown): Recipe | null {
  if (!isRecord(data) || data.v !== 1) return null;
  if (!isHardware(data.hardware) || !isPreset(data.modelPreset)) return null;
  const params = asParams(data.params);
  const faceLock = asFaceLock(data.faceLock);
  if (!params || !faceLock) return null;
  return {
    v: 1,
    hardware: data.hardware,
    modelPreset: data.modelPreset,
    params,
    faceLock,
  };
}

function asParams(raw: unknown): GenerateParams | null {
  if (!isRecord(raw)) return null;
  const prompt = str(raw.prompt);
  const negativePrompt = str(raw.negativePrompt);
  const checkpoint = str(raw.checkpoint);
  const lora = str(raw.lora);
  const sampler = str(raw.sampler);
  const scheduler = str(raw.scheduler);
  const loraStrength = num(raw.loraStrength);
  const width = num(raw.width);
  const height = num(raw.height);
  const steps = num(raw.steps);
  const cfg = num(raw.cfg);
  const seed = num(raw.seed);
  const clipSkip = num(raw.clipSkip);
  if (
    prompt == null ||
    negativePrompt == null ||
    checkpoint == null ||
    lora == null ||
    sampler == null ||
    scheduler == null ||
    loraStrength == null ||
    width == null ||
    height == null ||
    steps == null ||
    cfg == null ||
    seed == null ||
    clipSkip == null
  ) {
    return null;
  }
  const upscale = asUpscale(raw);
  return {
    prompt,
    negativePrompt,
    checkpoint,
    lora,
    loraStrength,
    width,
    height,
    steps,
    cfg,
    seed,
    clipSkip,
    sampler,
    scheduler,
    ...upscale,
  };
}

function asUpscale(raw: Record<string, unknown>): Pick<
  GenerateParams,
  "upscaleMode" | "upscaleScale" | "hiresDenoise" | "hiresSteps" | "upscaleModel"
> {
  const mode = str(raw.upscaleMode);
  const upscaleMode: GenerateParams["upscaleMode"] =
    mode === "hires" || mode === "esrgan" || mode === "hires_esrgan"
      ? mode
      : "off";
  return {
    upscaleMode,
    upscaleScale: num(raw.upscaleScale) ?? 1.5,
    hiresDenoise: num(raw.hiresDenoise) ?? 0.4,
    hiresSteps: num(raw.hiresSteps) ?? 12,
    upscaleModel: str(raw.upscaleModel) ?? "",
  };
}

function asFaceLock(raw: unknown): FaceLockSettings | null {
  if (!isRecord(raw)) return { enabled: false, weight: 0.8, endAt: 0.9 };
  if (typeof raw.enabled !== "boolean") return null;
  const weight = num(raw.weight);
  const endAt = num(raw.endAt);
  if (weight == null || endAt == null) return null;
  return { enabled: raw.enabled, weight, endAt };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isHardware(v: unknown): v is HardwareId {
  return typeof v === "string" && HARDWARE_IDS.includes(v as HardwareId);
}

function isPreset(v: unknown): v is ModelPresetId {
  return typeof v === "string" && MODEL_PRESET_IDS.includes(v as ModelPresetId);
}

function str(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
