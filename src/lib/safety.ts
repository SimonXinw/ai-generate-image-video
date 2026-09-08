import { BLOCKED_TERMS } from "../constants";

function matchesTerm(text: string, term: string): boolean {
  const lower = text.toLowerCase();
  const t = term.toLowerCase();
  if (/[a-z]/.test(t) && t.length <= 5) {
    const re = new RegExp(`(?:^|[^a-z0-9])${t}(?:$|[^a-z0-9])`, "i");
    return re.test(lower);
  }
  return lower.includes(t);
}

/** 只扫正向提示词。负向里写 child/loli 是为了排除，不能当拦截。 */
export function findBlockedTerm(text: string): string | null {
  for (const term of BLOCKED_TERMS) {
    if (matchesTerm(text, term)) return term;
  }
  return null;
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2_147_483_647);
}
