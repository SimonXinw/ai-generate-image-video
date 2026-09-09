import { useState } from "react";
import type { InfoTipProps } from "../types";

export function InfoTip({ text }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={open ? "infotip open" : "infotip"}
      tabIndex={0}
      role="note"
      aria-label={text}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpen((prev) => !prev);
      }}
      onBlur={() => setOpen(false)}
    >
      ?
      <span className="infotip-bubble">{text}</span>
    </span>
  );
}
