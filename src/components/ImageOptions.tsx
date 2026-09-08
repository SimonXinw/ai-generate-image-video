import type { GenerateParams } from "../types";
import { SAMPLERS, SCHEDULERS } from "../presets";

type Props = {
  params: GenerateParams;
  onChange: (next: GenerateParams) => void;
};

export function ImageOptions({ params, onChange }: Props) {
  const set = (patch: Partial<GenerateParams>) => onChange({ ...params, ...patch });

  return (
    <section className="card form">
      <p className="label">图片选项</p>
      <div className="row">
        <label>
          宽
          <input
            type="number"
            min={256}
            max={1280}
            step={64}
            value={params.width}
            onChange={(e) => set({ width: Number(e.target.value) })}
          />
        </label>
        <label>
          高
          <input
            type="number"
            min={256}
            max={1280}
            step={64}
            value={params.height}
            onChange={(e) => set({ height: Number(e.target.value) })}
          />
        </label>
      </div>
      <div className="row">
        <label>
          步数
          <input
            type="number"
            min={8}
            max={40}
            value={params.steps}
            onChange={(e) => set({ steps: Number(e.target.value) })}
          />
        </label>
        <label>
          CFG
          <input
            type="number"
            min={1}
            max={12}
            step={0.5}
            value={params.cfg}
            onChange={(e) => set({ cfg: Number(e.target.value) })}
          />
        </label>
      </div>
      <div className="row">
        <label>
          CLIP Skip
          <input
            type="number"
            min={1}
            max={4}
            value={params.clipSkip}
            onChange={(e) => set({ clipSkip: Number(e.target.value) })}
          />
        </label>
        <label>
          LoRA 强度
          <input
            type="number"
            min={0}
            max={1.5}
            step={0.05}
            value={params.loraStrength}
            onChange={(e) => set({ loraStrength: Number(e.target.value) })}
          />
        </label>
      </div>
      <label>
        采样器
        <select value={params.sampler} onChange={(e) => set({ sampler: e.target.value })}>
          {SAMPLERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        调度
        <select value={params.scheduler} onChange={(e) => set({ scheduler: e.target.value })}>
          {SCHEDULERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        种子（-1 随机）
        <div className="row">
          <input
            type="number"
            value={params.seed}
            onChange={(e) => set({ seed: Number(e.target.value) })}
          />
          <button type="button" onClick={() => set({ seed: -1 })}>
            随机
          </button>
        </div>
      </label>
    </section>
  );
}
