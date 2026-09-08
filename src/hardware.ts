import type { HardwareId, HardwareProfile } from "./types";

/** 机器 A：R5 5600 + 2080 Super 8G + 32G */
export const PROFILE_2080S: HardwareProfile = {
  id: "rtx2080s",
  label: "机器 A · 2080 Super",
  cpu: "R5 5600",
  gpu: "RTX 2080 Super 8GB",
  ram: "32GB",
  vramGb: 8,
  imageOk: "Pony XL / CyberRealistic Pony 可跑（8G 单张）",
  fluxNote: "Flux / CHROMA 全精度不够；GGUF 量化能试，会很慢",
  videoNote: "图生视频基本不够，建议 24GB 显存",
  buyIfWantMore: "舒服跑 Flux：4060 Ti 16G / 3080 12G；视频：3090/4090 24G",
  comfyFlags: [
    "--listen",
    "127.0.0.1",
    "--port",
    "8188",
    "--enable-cors-header",
    "--preview-method",
    "auto",
  ],
  recommendedModels: [
    "CyberRealistic Pony v18（成人写实主推）",
    "Pony Diffusion V6 XL（二次元/通用）",
    "勿优先全精度 Flux",
  ],
  defaultPrompt:
    "score_9, score_8_up, score_7_up, 1girl, looking at viewer, detailed face",
  defaultNegative:
    "score_4, score_5, score_6, blurry, extra fingers, bad anatomy, child, loli, shota, underage",
  sizeByAspect: {
    portrait: { width: 768, height: 1152 },
    square: { width: 832, height: 832 },
    landscape: { width: 1152, height: 768 },
  },
  defaultSteps: 22,
  defaultCfg: 7,
};

/** 机器 B：9600X + 1660 Super 6G + 64G —— 显存更紧，内存可换速度 */
export const PROFILE_1660S: HardwareProfile = {
  id: "gtx1660s",
  label: "机器 B · 1660 Super",
  cpu: "R5 9600X",
  gpu: "GTX 1660 Super 6GB",
  ram: "64GB",
  vramGb: 6,
  imageOk: "优先 SD1.5 / 轻量 Pony；SDXL 用 640 竖图 + lowvram",
  fluxNote: "Flux 几乎别想；哪怕量化也会极慢，靠 64G 内存卸载",
  videoNote: "视频生成不够，别在这台机硬上",
  buyIfWantMore: "想舒服本地出图：至少 12G（4060/3080）；视频仍要 24G",
  comfyFlags: [
    "--listen",
    "127.0.0.1",
    "--port",
    "8188",
    "--lowvram",
    "--enable-cors-header",
    "--preview-method",
    "auto",
  ],
  recommendedModels: [
    "DreamShaper 8（已推荐，NSFW 友好）",
    "Realistic Vision 等 SD1.5；512–640 最稳",
    "Pony/SDXL 仅试探；Flux 不推荐",
  ],
  defaultPrompt:
    "beautiful adult woman, looking at viewer, detailed face, natural lighting",
  defaultNegative:
    "blurry, extra fingers, bad anatomy, deformed, child, loli, shota, underage, teen",
  sizeByAspect: {
    portrait: { width: 512, height: 768 },
    square: { width: 512, height: 512 },
    landscape: { width: 768, height: 512 },
  },
  defaultSteps: 24,
  defaultCfg: 6,
};

export const HARDWARE_PROFILES: Record<HardwareId, HardwareProfile> = {
  rtx2080s: PROFILE_2080S,
  gtx1660s: PROFILE_1660S,
};

export const HARDWARE_IDS: HardwareId[] = ["rtx2080s", "gtx1660s"];

export const HW_KEY = "local-gen-hardware-id";

export function loadHardwareId(): HardwareId {
  const raw = localStorage.getItem(HW_KEY);
  if (raw === "rtx2080s" || raw === "gtx1660s") return raw;
  return "gtx1660s";
}

export function saveHardwareId(id: HardwareId): void {
  localStorage.setItem(HW_KEY, id);
}
