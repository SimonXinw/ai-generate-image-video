export type SelectOption = {
  id: string;
  label: string;
  hint: string;
};

export const SAMPLER_OPTIONS: SelectOption[] = [
  {
    id: "euler_ancestral",
    label: "euler_ancestral · 动画活",
    hint: "每步加噪，画面更跳，适合 Pony。同一颗种子也会飘。",
  },
  {
    id: "euler",
    label: "euler · 更干净",
    hint: "比 ancestral 稳一点，细节略平，少用。",
  },
  {
    id: "dpmpp_2m",
    label: "dpmpp_2m · 写实稳",
    hint: "干净、能复现。DreamShaper / Cyber 默认。",
  },
  {
    id: "dpmpp_sde",
    label: "dpmpp_sde · 更润",
    hint: "皮肤更润，但和 2M 同种子对不上。",
  },
  {
    id: "ddim",
    label: "ddim · 老算法",
    hint: "偏硬。只在对照旧图时选。",
  },
];

export const SCHEDULER_OPTIONS: SelectOption[] = [
  {
    id: "normal",
    label: "normal · 动画通用",
    hint: "节奏均匀，Pony 默认。",
  },
  {
    id: "karras",
    label: "karras · 写实干净",
    hint: "低步数也清楚，写实默认。换它同种子会变。",
  },
  {
    id: "simple",
    label: "simple · 更软",
    hint: "噪点掉得快，容易糊。",
  },
  {
    id: "exponential",
    label: "exponential · 更锐",
    hint: "后期步更狠，偶尔过锐。",
  },
];

export function optionHint(list: SelectOption[], id: string): string {
  return list.find((item) => item.id === id)?.hint ?? "";
}

export function checkpointCaption(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("dreamshaper")) return `${name} · 写实 SD1.5`;
  if (lower.includes("cyberrealistic")) return `${name} · 写实 Pony`;
  if (lower.includes("pony")) return `${name} · 动画 XL`;
  return name;
}
