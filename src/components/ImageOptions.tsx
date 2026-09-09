import { Field } from "./Field";
import { SAMPLER_OPTIONS, SCHEDULER_OPTIONS, optionHint } from "../select-options";
import { TIPS } from "../tips";
import type { GenerateParams, ImageOptionsProps } from "../types";

export function ImageOptions({ params, onChange }: ImageOptionsProps) {
  const set = (patch: Partial<GenerateParams>) => onChange({ ...params, ...patch });

  return (
    <section className="card form">
      <p className="label">图片选项</p>
      <div className="row">
        <Field label="宽" tip={TIPS.width} hint="64 的倍数。加宽就减高。">
          <input
            type="number"
            min={256}
            max={1536}
            step={64}
            value={params.width}
            onChange={(e) => set({ width: Number(e.target.value) })}
          />
        </Field>
        <Field label="高" tip={TIPS.height} hint="竖图人像常用 768 / 1152 / 1216。">
          <input
            type="number"
            min={256}
            max={1536}
            step={64}
            value={params.height}
            onChange={(e) => set({ height: Number(e.target.value) })}
          />
        </Field>
      </div>
      <div className="row">
        <Field label="步数" tip={TIPS.steps} hint="20–30 够用，再高主要是更慢。">
          <input
            type="number"
            min={8}
            max={40}
            value={params.steps}
            onChange={(e) => set({ steps: Number(e.target.value) })}
          />
        </Field>
        <Field label="CFG" tip={TIPS.cfg} hint="Pony 常用 7；Cyber 必须 5；DreamShaper 7。">
          <input
            type="number"
            min={1}
            max={12}
            step={0.5}
            value={params.cfg}
            onChange={(e) => set({ cfg: Number(e.target.value) })}
          />
        </Field>
      </div>
      <div className="row">
        <Field label="CLIP Skip" tip={TIPS.clipSkip} hint="写实 SD1.5 用 1，Pony / Cyber 用 2。">
          <input
            type="number"
            min={1}
            max={4}
            value={params.clipSkip}
            onChange={(e) => set({ clipSkip: Number(e.target.value) })}
          />
        </Field>
        <Field label="LoRA 强度" tip={TIPS.loraStrength} hint="没选 LoRA 时无效。常用 0.6–0.9。">
          <input
            type="number"
            min={0}
            max={1.5}
            step={0.05}
            value={params.loraStrength}
            onChange={(e) => set({ loraStrength: Number(e.target.value) })}
          />
        </Field>
      </div>
      <div className="row">
        <Field
          label="采样器"
          tip={TIPS.sampler}
          hint={optionHint(SAMPLER_OPTIONS, params.sampler)}
        >
          <select
            value={params.sampler}
            onChange={(e) => set({ sampler: e.target.value })}
          >
            {SAMPLER_OPTIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="调度"
          tip={TIPS.scheduler}
          hint={optionHint(SCHEDULER_OPTIONS, params.scheduler)}
        >
          <select
            value={params.scheduler}
            onChange={(e) => set({ scheduler: e.target.value })}
          >
            {SCHEDULER_OPTIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="种子" tip={TIPS.seed} hint="-1 每次随机；固定数字才能复现同一张。">
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
      </Field>
    </section>
  );
}
