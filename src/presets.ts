import type { HardwareId, OutfitId, SizePreset } from "./types";

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
const SIZE_PRESETS_2080S: SizePreset[] = [
  { label: "竖 832×1216", width: 832, height: 1216, note: "SDXL 原生竖图，人像首选" },
  { label: "竖 896×1152", width: 896, height: 1152, note: "比 832 略宽，适合带手臂的构图" },
  { label: "竖 768×1152", width: 768, height: 1152, note: "省显存，8G 最稳" },
  { label: "长 768×1344", width: 768, height: 1344, note: "手机壁纸比例，全身站姿" },
  { label: "方 1024×1024", width: 1024, height: 1024, note: "SDXL 基准尺寸" },
  { label: "横 1216×832", width: 1216, height: 832, note: "横构图、躺姿" },
];

/**
 * SD1.5 尺寸。显存不是硬墙（--lowvram 会把权重换进内存），
 * 真正的限制是底模训练在 512×512，面积超过约 2 倍就开始双头/重复肢体。
 */
const SIZE_PRESETS_1660S: SizePreset[] = [
  { label: "竖 512×768", width: 512, height: 768, note: "SD1.5 原生竖图，6G 最稳" },
  { label: "竖 576×832", width: 576, height: 832, note: "略大一点的人像，还能扛住" },
  { label: "竖 640×960", width: 640, height: 960, note: "2.3 倍原生面积，慢但更细" },
  { label: "竖 704×1056", width: 704, height: 1056, note: "2.8 倍，明显变慢，可能出双头" },
  { label: "竖 768×1152", width: 768, height: 1152, note: "3.4 倍，单次直出双头概率高" },
  { label: "长 512×896", width: 512, height: 896, note: "全身站姿、手机壁纸比例" },
  { label: "方 512×512", width: 512, height: 512, note: "SD1.5 基准尺寸，最快" },
  { label: "横 768×512", width: 768, height: 512, note: "横构图、躺姿" },
  { label: "横 960×640", width: 960, height: 640, note: "更宽的横构图，同样偏大" },
];

export const SIZE_PRESETS_BY_HW: Record<HardwareId, SizePreset[]> = {
  rtx2080s: SIZE_PRESETS_2080S,
  gtx1660s: SIZE_PRESETS_1660S,
};
