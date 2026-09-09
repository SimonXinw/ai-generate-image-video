import { InfoTip } from "./InfoTip";
import type { FieldProps } from "../field-types";

export function Field({ label, tip, hint, children }: FieldProps) {
  return (
    <label>
      <span className="field-label">
        {label}
        {tip ? <InfoTip text={tip} /> : null}
      </span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}
