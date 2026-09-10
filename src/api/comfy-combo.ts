/** 旧版: [string[], extra] ；v0.35: ["COMBO", { options: string[] }] */
export function comboNames(field: unknown): string[] {
  if (!Array.isArray(field) || field.length === 0) return [];
  const first = field[0];
  if (Array.isArray(first)) {
    return first.filter((n): n is string => typeof n === "string" && n.length > 0);
  }
  if (first !== "COMBO") return [];
  const meta = field[1];
  if (!meta || typeof meta !== "object") return [];
  const options = (meta as { options?: unknown }).options;
  if (!Array.isArray(options)) return [];
  return options.filter((n): n is string => typeof n === "string" && n.length > 0);
}
