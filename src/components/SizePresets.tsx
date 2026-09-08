import { InfoTip } from "./InfoTip";
import { SIZE_PRESETS } from "../presets";
import { TIPS } from "../tips";
import type { SizePresetsProps } from "../types";

export function SizePresets({ params, onChange }: SizePresetsProps) {
  const pixels = params.width * params.height;
  const bad = params.width % 64 !== 0 || params.height % 64 !== 0;

  return (
    <section className="card">
      <p className="label">
        画幅预设
        <InfoTip text={TIPS.size} />
      </p>
      <div className="size-chips">
        {SIZE_PRESETS.map((p) => {
          const active = params.width === p.width && params.height === p.height;
          return (
            <button
              key={p.label}
              type="button"
              title={p.note}
              className={active ? "chip active" : "chip"}
              onClick={() => onChange({ ...params, width: p.width, height: p.height })}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <p className="muted small">
        当前 {params.width}×{params.height}，约 {(pixels / 1e6).toFixed(2)} 百万像素
        {pixels > 1_300_000 ? "（8G 可能爆显存）" : ""}
        {bad ? "（宽高建议用 64 的倍数）" : ""}
      </p>
    </section>
  );
}
