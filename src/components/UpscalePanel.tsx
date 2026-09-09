import { Field } from "./Field";
import { InfoTip } from "./InfoTip";
import { TIPS } from "../tips";
import {
  finalSize,
  upscaleModeLabel,
  upscaleWarnings,
} from "../lib/upscale-guard";
import {
  needsHires,
  needsUpscaleModel,
  upscaleChips,
} from "../upscale-presets";
import type { GenerateParams } from "../types";
import type { UpscaleMode, UpscalePanelProps } from "../upscale-types";

export function UpscalePanel({
  params,
  hardwareId,
  upscaleModels,
  faceOn,
  onChange,
}: UpscalePanelProps) {
  const chips = upscaleChips(hardwareId);
  const set = (patch: Partial<GenerateParams>) => onChange({ ...params, ...patch });
  const mode = params.upscaleMode;
  const lowVram = hardwareId === "gtx1660s";
  const size = finalSize(params.width, params.height, mode, params.upscaleScale);
  const warnings = upscaleWarnings(params, hardwareId, upscaleModels, faceOn);

  const pickMode = (next: UpscaleMode, scale: number) => {
    set({
      upscaleMode: next,
      upscaleScale: scale > 1 ? scale : params.upscaleScale,
      upscaleModel:
        needsUpscaleModel(next)
          ? params.upscaleModel || upscaleModels[0] || ""
          : params.upscaleModel,
    });
  };

  return (
    <section className="card upscale-panel">
      <p className="label">
        放大 / 高分修复
        <InfoTip text={TIPS.upscale} />
      </p>
      <ol className="upscale-steps">
        <li className={mode === "off" ? "on" : ""}>
          <strong>① 小图</strong> 先关放大，定构图与种子
        </li>
        <li className={mode !== "off" ? "on" : ""}>
          <strong>② 放大</strong> 满意后再开；左侧可「同种子放大」
        </li>
      </ol>
      <p className="field-hint">
        {lowVram
          ? "1660S：底图保持 512×768 最稳。放大是管线后处理，不是把宽高填成 2K。"
          : "底图用方案默认画幅。硬拉 2K 宽高会崩构图；要大文件用本区模式。"}
      </p>
      <div className="size-chips">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            title={c.note}
            className={mode === c.id ? "chip active" : "chip"}
            onClick={() => pickMode(c.id, c.scale)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="muted small">
        底图 {params.width}×{params.height}
        {mode === "off"
          ? " · 本次只出小图"
          : ` → ${upscaleModeLabel(mode)} → 约 ${size.width}×${size.height}`}
      </p>
      {warnings.map((w) => (
        <p className="tip" key={w}>
          {w}
        </p>
      ))}
      {needsHires(mode) ? (
        <div className="row">
          <Field
            label={`重绘幅度 ${params.hiresDenoise.toFixed(2)}`}
            tip={TIPS.hiresDenoise}
            hint="0.35–0.45 保构图；高于 0.5 可能改姿势。"
          >
            <input
              type="range"
              min="0.25"
              max="0.65"
              step="0.05"
              value={params.hiresDenoise}
              onChange={(e) => set({ hiresDenoise: Number(e.target.value) })}
            />
          </Field>
          <Field label="高分步数" tip={TIPS.hiresSteps} hint="10–16 够用，再高主要更慢。">
            <input
              type="number"
              min={8}
              max={24}
              value={params.hiresSteps}
              onChange={(e) => set({ hiresSteps: Number(e.target.value) })}
            />
          </Field>
        </div>
      ) : null}
      {needsUpscaleModel(mode) && upscaleModels.length > 0 ? (
        <Field label="放大模型" tip={TIPS.upscaleModel} hint="×4 模型：512 底图 → 约 2K。">
          <select
            value={params.upscaleModel || upscaleModels[0]}
            onChange={(e) => set({ upscaleModel: e.target.value })}
          >
            {upscaleModels.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Field>
      ) : null}
    </section>
  );
}
