import { InfoTip } from "./InfoTip";
import { activeQualityId, qualityList } from "../quality-presets";
import { TIPS } from "../tips";
import type { QualityPresetsProps } from "../types";

export function QualityPresets({
  params,
  profile,
  modelPresetId,
  onChange,
}: QualityPresetsProps) {
  const active = activeQualityId(params, modelPresetId);
  const presets = qualityList(modelPresetId);

  return (
    <section className="card">
      <p className="label">
        画质档位
        <InfoTip text={TIPS.quality} />
      </p>
      <p className="muted small">按当前模型调过的步数与 CFG（{profile.label}）</p>
      <div className="size-chips">
        {presets.map((q) => (
          <button
            key={q.id}
            type="button"
            title={q.note}
            className={active === q.id ? "chip active" : "chip"}
            onClick={() => onChange({ ...params, steps: q.steps, cfg: q.cfg })}
          >
            {q.label} {q.steps} 步 / CFG {q.cfg}
          </button>
        ))}
      </div>
      <p className="muted small">
        当前 {params.steps} 步 / CFG {params.cfg}
        {active ? ` · ${presets.find((q) => q.id === active)?.note}` : "（自定义）"}
      </p>
    </section>
  );
}
