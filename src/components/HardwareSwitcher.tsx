import type { HardwareId, HardwareProfile } from "../types";
import { HARDWARE_IDS, HARDWARE_PROFILES } from "../hardware";

type Props = {
  profile: HardwareProfile;
  onChange: (id: HardwareId) => void;
};

export function HardwareSwitcher({ profile, onChange }: Props) {
  return (
    <section className="card switcher">
      <p className="label">当前机子配置</p>
      <div className="row">
        {HARDWARE_IDS.map((id) => {
          const item = HARDWARE_PROFILES[id];
          const active = id === profile.id;
          return (
            <button
              key={id}
              type="button"
              className={active ? "chip active" : "chip"}
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
      <p>{profile.imageOk}</p>
      <p className="muted">{profile.fluxNote}</p>
      <p className="muted">{profile.videoNote}</p>
      <p className="tip">不够时再买：{profile.buyIfWantMore}</p>
      <ul className="model-list">
        {profile.recommendedModels.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <p className="muted small">
        启动参数：python main.py {profile.comfyFlags.join(" ")}
      </p>
    </section>
  );
}
