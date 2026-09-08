import { PROFILE_2080S } from "./hardware";
import type { GenerateParams } from "./types";

export const COMFY_URL =
  import.meta.env.VITE_COMFY_URL ?? "http://127.0.0.1:8188";

export const AGE_KEY = "local-gen-age-ok";

export const DEFAULT_PARAMS: GenerateParams = {
  prompt: "score_9, score_8_up, score_7_up, 1girl, looking at viewer, detailed face",
  negativePrompt:
    "score_4, score_5, score_6, blurry, extra fingers, bad anatomy, child, loli, shota, underage",
  checkpoint: "",
  lora: "",
  loraStrength: 0.8,
  width: PROFILE_2080S.sizeByAspect.portrait.width,
  height: PROFILE_2080S.sizeByAspect.portrait.height,
  steps: PROFILE_2080S.defaultSteps,
  cfg: PROFILE_2080S.defaultCfg,
  seed: -1,
  clipSkip: 2,
};

/** 硬红线：未成年人相关，本地也不做 */
export const BLOCKED_TERMS = [
  "child",
  "kid",
  "teen",
  "loli",
  "shota",
  "underage",
  "minor",
  "preteen",
  "幼儿",
  "儿童",
  "小孩",
  "未成年",
  "萝莉",
  "正太",
  "小学生",
];
