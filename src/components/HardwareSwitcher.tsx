import { useState } from "react";
import { InfoTip } from "./InfoTip";
import { HARDWARE_IDS, HARDWARE_PROFILES } from "../hardware";
import { TIPS } from "../tips";
import type { HardwareSwitcherProps } from "../types";

export function HardwareSwitcher({ profile, onChange }: HardwareSwitcherProps) {
  const [open, setOpen] = useState(false);
  return (
    <section className="card switcher">
      <p className="label">
        当前机子
        <InfoTip text={TIPS.hardware} />
      </p>
      <p className="field-hint">按实际显卡选，会改分辨率和默认模型。</p>
      <div className="row">
        {HARDWARE_IDS.map((id) => {
          const item = HARDWARE_PROFILES[id];
          return (
            <button
              key={id}
              type="button"
              className={id === profile.id ? "chip active" : "chip"}
              title={`${item.gpu} · 默认 ${item.sizeByAspect.portrait.width}×${item.sizeByAspect.portrait.height}`}
              onClick={() => onChange(id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <p>
        {profile.cpu} · {profile.gpu} · {profile.ram}
      </p>
      <button type="button" className="linkish" onClick={() => setOpen(!open)}>
        {open ? "收起说明" : "硬件说明"}
      </button>
      {open && (
        <>
          <p>{profile.imageOk}</p>
          <p className="muted">{profile.fluxNote}</p>
          <p className="tip">不够时再买：{profile.buyIfWantMore}</p>
        </>
      )}
    </section>
  );
}
