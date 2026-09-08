import type { GenerateParams } from "../types";

/** 参数摘要，按 seed / 尺寸 / 采样 分组，便于人眼扫读 */
export function metaRows(params: GenerateParams, seed: number): [string, string][] {
  const rows: [string, string][] = [
    ["种子", String(seed)],
    ["尺寸", `${params.width}×${params.height}`],
    ["步数", String(params.steps)],
    ["CFG", String(params.cfg)],
    ["采样器", params.sampler],
    ["调度", params.scheduler],
    ["CLIP Skip", String(params.clipSkip)],
    ["模型", params.checkpoint || "（未选）"],
  ];
  if (params.lora.trim()) {
    rows.push(["LoRA", `${params.lora} @ ${params.loraStrength}`]);
  }
  return rows;
}

/** 复制用的纯文本，含正负提示词，粘到笔记里能直接复现 */
export function metaToText(params: GenerateParams, seed: number): string {
  const head = metaRows(params, seed)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return [
    head,
    "",
    "正向:",
    params.prompt,
    "",
    "负向:",
    params.negativePrompt,
  ].join("\n");
}
