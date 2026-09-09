import type {
  FaceLockSettings,
  GenerateParams,
  GenerationMeta,
  HardwareId,
  ModelPresetId,
} from "./types";

/** 可粘进 Markdown、也能整段导回 UI 的出图配方 */
export type Recipe = {
  v: 1;
  hardware: HardwareId;
  modelPreset: ModelPresetId;
  params: GenerateParams;
  faceLock: FaceLockSettings;
};

export type RecipeParseOk = { ok: true; recipe: Recipe };
export type RecipeParseFail = { ok: false; error: string };
export type RecipeParseResult = RecipeParseOk | RecipeParseFail;

export type RecipePanelProps = {
  hardwareId: HardwareId;
  modelPresetId: ModelPresetId;
  params: GenerateParams;
  faceSettings: FaceLockSettings;
  checkpoints: string[];
  loras: string[];
  onImport: (recipe: Recipe) => void;
};

export type MetaPanelProps = {
  meta: GenerationMeta | null;
  hardwareId: HardwareId;
  modelPresetId: ModelPresetId;
  faceSettings: FaceLockSettings;
  onReuseSeed: (seed: number) => void;
};
