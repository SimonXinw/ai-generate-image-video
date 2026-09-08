import { PROFILE_1660S } from "./hardware";
import type { GenerateParams } from "./types";

export const COMFY_URL =
  import.meta.env.VITE_COMFY_URL ?? "http://127.0.0.1:8188";

/** 默认按当前更常用的 1660S / SD1.5；切到 2080S 会换成 Pony 句 */
export const DEFAULT_PARAMS: GenerateParams = {
  prompt: PROFILE_1660S.defaultPrompt,
  negativePrompt: PROFILE_1660S.defaultNegative,
  checkpoint: "",
  lora: "",
  loraStrength: 0.8,
  width: PROFILE_1660S.sizeByAspect.portrait.width,
  height: PROFILE_1660S.sizeByAspect.portrait.height,
  steps: PROFILE_1660S.defaultSteps,
  cfg: PROFILE_1660S.defaultCfg,
  seed: -1,
  clipSkip: 2,
  sampler: "euler_ancestral",
  scheduler: "normal",
};

/** 放大弹窗的缩放范围与滚轮步长 */
export const LIGHTBOX_MIN_SCALE = 0.2;
export const LIGHTBOX_MAX_SCALE = 6;
export const LIGHTBOX_STEP = 0.2;

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
