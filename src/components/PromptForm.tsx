import type { AspectPreset, GenerateParams, HardwareProfile } from "../types";

type Props = {
  params: GenerateParams;
  profile: HardwareProfile;
  checkpoints: string[];
  loras: string[];
  busy: boolean;
  onChange: (next: GenerateParams) => void;
  onSubmit: () => void;
};

export function PromptForm({
  params,
  profile,
  checkpoints,
  loras,
  busy,
  onChange,
  onSubmit,
}: Props) {
  const set = (patch: Partial<GenerateParams>) => onChange({ ...params, ...patch });

  const setAspect = (aspect: AspectPreset) => {
    set(profile.sizeByAspect[aspect]);
  };

  const p = profile.sizeByAspect.portrait;
  const s = profile.sizeByAspect.square;
  const l = profile.sizeByAspect.landscape;

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
        <textarea
          rows={5}
          value={params.prompt}
          onChange={(e) => set({ prompt: e.target.value })}
        />
      </label>
      <label>
        负向提示词
        <textarea
          rows={3}
          value={params.negativePrompt}
          onChange={(e) => set({ negativePrompt: e.target.value })}
        />
      </label>
      <label>
        模型 checkpoint
        <select
          value={params.checkpoint}
          onChange={(e) => set({ checkpoint: e.target.value })}
        >
          {checkpoints.length === 0 ? (
            <option value="">先启动 ComfyUI 并放入模型</option>
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
        LoRA（可选）
        <select value={params.lora} onChange={(e) => set({ lora: e.target.value })}>
          <option value="">不用 LoRA</option>
          {loras.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <div className="row">
        <button type="button" onClick={() => setAspect("portrait")}>
          竖 {p.width}×{p.height}
        </button>
        <button type="button" onClick={() => setAspect("square")}>
          方 {s.width}×{s.height}
        </button>
        <button type="button" onClick={() => setAspect("landscape")}>
          横 {l.width}×{l.height}
        </button>
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
      <button type="submit" disabled={busy || !params.checkpoint}>
        {busy ? "生成中…" : "开始生成"}
      </button>
    </form>
  );
}
