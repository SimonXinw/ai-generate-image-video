import { useState } from "react";
import { copyText } from "../lib/clipboard";
import { metaRows } from "../lib/meta";
import { buildRecipe, recipeToMarkdown } from "../lib/recipe-format";
import type { MetaPanelProps } from "../recipe-types";

export function MetaPanel({
  meta,
  hardwareId,
  modelPresetId,
  faceSettings,
  onReuseSeed,
}: MetaPanelProps) {
  const [hint, setHint] = useState("");

  if (!meta) return null;
  const rows = metaRows(meta.params, meta.seed);
  const markdown = recipeToMarkdown(
    buildRecipe(hardwareId, modelPresetId, meta.params, faceSettings, meta.seed),
  );

  const copy = async (text: string, label: string) => {
    const ok = await copyText(text);
    setHint(ok ? `已复制${label}` : "复制失败，请手动选中");
    window.setTimeout(() => setHint(""), 1600);
  };

  return (
    <section className="card meta">
      <p className="label">本次参数</p>
      <dl className="meta-grid">
        {rows.map(([k, v]) => (
          <div className="meta-item" key={k}>
            <dt>{k}</dt>
            <dd title={v}>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="stage-bar">
        <button
          type="button"
          className="btn-sm"
          onClick={() => void copy(String(meta.seed), "种子")}
        >
          复制种子
        </button>
        <button
          type="button"
          className="btn-sm"
          onClick={() => void copy(markdown, "配方")}
        >
          复制配方
        </button>
        <button
          type="button"
          className="btn-sm"
          onClick={() => onReuseSeed(meta.seed)}
        >
          复用种子
        </button>
        {hint ? <span className="stage-note muted small">{hint}</span> : null}
      </div>
    </section>
  );
}
