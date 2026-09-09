import { InfoTip } from "./InfoTip";
import { SIZE_PRESETS_BY_HW } from "../presets";
import { TIPS } from "../tips";
import type { SizePresetsProps } from "../types";

export function SizePresets({ params, profile, onChange }: SizePresetsProps) {
  const pixels = params.width * params.height;
  const bad = params.width % 64 !== 0 || params.height % 64 !== 0;
  const presets = SIZE_PRESETS_BY_HW[profile.id];
  const ratio = pixels / profile.basePixels;

  return (
    <section className="card">
      <p className="label">
        画幅预设
        <InfoTip text={TIPS.size} />
      </p>
      <p className="field-hint">点尺寸即可。超过底模太多容易双头。</p>
      <div className="size-chips">
        {presets.map((p) => {
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
        当前 {params.width}×{params.height}，约 {(pixels / 1e6).toFixed(2)} 百万像素，
        底模原生面积的 {ratio.toFixed(1)} 倍
        {bad ? "（宽高建议用 64 的倍数）" : ""}
      </p>
      {ratio > 2.5 ? (
        <p className="tip">
          超过原生面积 2.5 倍，单次直出容易双头或多肢。要更大建议先小图定构图，再做二段式放大。
        </p>
      ) : null}
      {pixels > profile.vramGb * 165_000 ? (
        <p className="tip">对这张卡偏大，可能爆显存，OOM 就往下降一档。</p>
      ) : null}
    </section>
  );
}
