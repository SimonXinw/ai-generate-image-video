import { Field } from "./Field";
import { OUTFIT_CHIPS, OUTFIT_NEG } from "../presets";
import { checkpointCaption } from "../select-options";
import { TIPS } from "../tips";
import type { GenerateParams, OutfitId } from "../types";
import type { PromptFormProps } from "../ui-types";

export function PromptForm({
  params,
  checkpoints,
  loras,
  busy,
  stopping,
  submitLabel,
  submitRef,
  onChange,
  onSubmit,
  onStop,
}: PromptFormProps) {
  const set = (patch: Partial<GenerateParams>) => onChange({ ...params, ...patch });

  const applyOutfit = (id: OutfitId) => {
    const chip = OUTFIT_CHIPS.find((c) => c.id === id);
    if (!chip) return;
    const stripped = params.prompt
      .replace(/,?\s*(wearing clothes|fashionable outfit|topless|jeans|nude|completely nude|detailed skin)/gi, "")
      .replace(/,\s*,/g, ",")
      .trim()
      .replace(/,$/, "");
    set({
      prompt: stripped ? `${stripped}, ${chip.tags}` : chip.tags,
      negativePrompt: (() => {
        const cleaned = params.negativePrompt
          .replace(/,?\s*(clothes|dressed|bra|panties|covered|shirt|covered breasts)/gi, "")
          .replace(/,\s*,/g, ",")
          .trim()
          .replace(/^,|,$/g, "");
        const extra = OUTFIT_NEG[id];
        if (!extra) return cleaned;
        return cleaned ? `${cleaned}, ${extra}` : extra;
      })(),
    });
  };

  return (
    <form
      className="card form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Field
        label="正向提示词"
        tip={TIPS.prompt}
        hint="Pony / Cyber 带 score_9；DreamShaper 不要写 score。"
      >
        <textarea rows={4} value={params.prompt} onChange={(e) => set({ prompt: e.target.value })} />
      </Field>
      <div className="outfit-chips">
        {OUTFIT_CHIPS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="chip"
            title={TIPS.outfit}
            onClick={() => applyOutfit(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="field-hint">{TIPS.outfit}</p>
      <Field
        label="负向提示词"
        tip={TIPS.negative}
        hint="不想出现的内容。红线排除词不要删。"
      >
        <textarea
          rows={2}
          value={params.negativePrompt}
          onChange={(e) => set({ negativePrompt: e.target.value })}
        />
      </Field>
      <Field
        label="模型"
        tip={TIPS.checkpoint}
        hint="换模型等于换画风。下面方案按钮会同步采样参数。"
      >
        <select value={params.checkpoint} onChange={(e) => set({ checkpoint: e.target.value })}>
          {checkpoints.length === 0 ? (
            <option value="">先启动 ComfyUI</option>
          ) : (
            checkpoints.map((name) => (
              <option key={name} value={name}>
                {checkpointCaption(name)}
              </option>
            ))
          )}
        </select>
      </Field>
      <Field
        label="LoRA"
        tip={TIPS.lora}
        hint={params.lora ? "叠加在主模型上，强度在图片选项里调。" : "不用也可以，只靠主模型出图。"}
      >
        <select value={params.lora} onChange={(e) => set({ lora: e.target.value })}>
          <option value="">不用 · 只靠主模型</option>
          {loras.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </Field>
      <p className="field-hint">
        {params.upscaleMode === "off"
          ? "当前：只出小图。构图满意后可在结果区点「同种子放大」。"
          : "当前：生成后会自动走放大管线，耗时更长。"}
      </p>
      <div className="form-actions">
        <button ref={submitRef} type="submit" disabled={busy || !params.checkpoint}>
          {submitLabel}
        </button>
        <button type="button" className="stop" onClick={onStop} disabled={!busy || stopping}>
          {stopping ? "正在停止…" : "停止出图"}
        </button>
      </div>
    </form>
  );
}
