import type { OutfitId } from "./types";

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
