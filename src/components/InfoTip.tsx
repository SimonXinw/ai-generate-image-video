import type { InfoTipProps } from "../types";

export function InfoTip({ text }: InfoTipProps) {
  return (
    <span className="infotip" tabIndex={0} role="note" aria-label={text}>
      ?
      <span className="infotip-bubble">{text}</span>
    </span>
  );
}
