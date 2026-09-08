import { InfoTip } from "./InfoTip";
import { OUTFIT_CHIPS, OUTFIT_NEG } from "../presets";
import { TIPS } from "../tips";
import type { GenerateParams, OutfitId, PromptFormProps } from "../types";

export function PromptForm({
  params,
  profile,
  checkpoints,
  loras,
  busy,
  onChange,
  onSubmit,
}: PromptFormProps) {
  const set = (patch: Partial<GenerateParams>) => onChange({ ...params, ...patch });
  const p = profile.sizeByAspect.portrait;
  const s = profile.sizeByAspect.square;
  const l = profile.sizeByAspect.landscape;

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
      <label>
        正向提示词
        <textarea rows={4} value={params.prompt} onChange={(e) => set({ prompt: e.target.value })} />
      </label>
      <div className="row">
        {OUTFIT_CHIPS.map((c) => (
          <button key={c.id} type="button" className="chip" onClick={() => applyOutfit(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <label>
        负向提示词
        <textarea
          rows={2}
          value={params.negativePrompt}
          onChange={(e) => set({ negativePrompt: e.target.value })}
        />
      </label>
      <label>
        <span className="field-label">
          模型 <InfoTip text={TIPS.checkpoint} />
        </span>
        <select value={params.checkpoint} onChange={(e) => set({ checkpoint: e.target.value })}>
          {checkpoints.length === 0 ? (
            <option value="">先启动 ComfyUI</option>
          ) : (
            checkpoints.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))
          )}
        </select>
      </label>
      <label>
        <span className="field-label">
          LoRA <InfoTip text={TIPS.lora} />
        </span>
        <select value={params.lora} onChange={(e) => set({ lora: e.target.value })}>
          <option value="">不用</option>
          {loras.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <p className="label">画幅</p>
      <div className="row">
        <button type="button" className="chip" onClick={() => set(p)}>
          竖 {p.width}×{p.height}
        </button>
        <button type="button" className="chip" onClick={() => set(s)}>
          方 {s.width}×{s.height}
        </button>
        <button type="button" className="chip" onClick={() => set(l)}>
          横 {l.width}×{l.height}
        </button>
      </div>
      <button type="submit" disabled={busy || !params.checkpoint}>
        {busy ? "生成中…" : "开始生成"}
      </button>
    </form>
  );
}
