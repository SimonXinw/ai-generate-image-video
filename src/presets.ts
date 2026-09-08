import type { OutfitId, SizePreset } from "./types";

export const SAMPLERS = [
  "euler_ancestral",
  "euler",
  "dpmpp_2m",
  "dpmpp_sde",
  "ddim",
] as const;

export const SCHEDULERS = ["normal", "karras", "simple", "exponential"] as const;

export const OUTFIT_CHIPS: { id: OutfitId; label: string; tags: string }[] = [
  { id: "clothed", label: "穿衣", tags: "wearing clothes, fashionable outfit" },
  { id: "topless", label: "半裸", tags: "topless, jeans, detailed skin" },
  { id: "nude", label: "裸体", tags: "nude, completely nude, detailed skin" },
];

export const OUTFIT_NEG: Record<OutfitId, string> = {
  clothed: "",
  topless: "bra, shirt, covered breasts",
  nude: "clothes, dressed, bra, panties, covered",
};

/** SDXL/Pony 原生分桶尺寸，总像素都在 100 万左右，8G 显存能吃下 */
export const SIZE_PRESETS: SizePreset[] = [
  { label: "竖 832×1216", width: 832, height: 1216, note: "SDXL 原生竖图，人像首选" },
  { label: "竖 896×1152", width: 896, height: 1152, note: "比 832 略宽，适合带手臂的构图" },
  { label: "竖 768×1152", width: 768, height: 1152, note: "省显存，8G 最稳" },
  { label: "长 768×1344", width: 768, height: 1344, note: "手机壁纸比例，全身站姿" },
  { label: "方 1024×1024", width: 1024, height: 1024, note: "SDXL 基准尺寸" },
  { label: "横 1216×832", width: 1216, height: 832, note: "横构图、躺姿" },
];
