import { useState } from "react";
import type { HardwareId, HardwareProfile } from "../types";
import { HARDWARE_IDS, HARDWARE_PROFILES } from "../hardware";

type Props = {
  profile: HardwareProfile;
  onChange: (id: HardwareId) => void;
};

export function HardwareSwitcher({ profile, onChange }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <section className="card switcher">
      <p className="label">当前机子</p>
      <div className="row">
        {HARDWARE_IDS.map((id) => {
          const item = HARDWARE_PROFILES[id];
          return (
            <button
              key={id}
              type="button"
              className={id === profile.id ? "chip active" : "chip"}
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
