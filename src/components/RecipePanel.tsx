import { useState } from "react";
import { copyText, readText } from "../lib/clipboard";
import { buildRecipe, recipeToMarkdown } from "../lib/recipe-format";
import { parseRecipeText, recipeWarnings } from "../lib/recipe-parse";
import type { RecipePanelProps } from "../recipe-types";

export function RecipePanel({
  hardwareId,
  modelPresetId,
  params,
  faceSettings,
  checkpoints,
  loras,
  onImport,
}: RecipePanelProps) {
  const [hint, setHint] = useState("");
  const [paste, setPaste] = useState("");
  const [open, setOpen] = useState(false);

  const markdown = recipeToMarkdown(
    buildRecipe(hardwareId, modelPresetId, params, faceSettings),
  );

  const flash = (msg: string) => {
    setHint(msg);
    window.setTimeout(() => setHint(""), 2800);
  };

  const applyRaw = (raw: string) => {
    const parsed = parseRecipeText(raw);
    if (!parsed.ok) {
      flash(parsed.error);
      return;
    }
    onImport(parsed.recipe);
    const notes = recipeWarnings(parsed.recipe, checkpoints, loras);
    flash(notes.length ? `已导入。${notes.join("；")}` : "已导入配方");
    setPaste("");
    setOpen(false);
  };

  const copyMd = async () => {
    const ok = await copyText(markdown);
    flash(ok ? "已复制 Markdown 配方" : "复制失败，请展开后手动选中");
    if (!ok) {
      setOpen(true);
      setPaste(markdown);
    }
  };

  const importClip = async () => {
    const raw = (await readText()).trim();
    if (raw) {
      applyRaw(raw);
      return;
    }
    setOpen(true);
    flash("读不到剪贴板，把 Markdown 贴到下面再点导入这段");
  };

  return (
    <section className="card form">
      <p className="label">配方</p>
      <p className="muted small">复制到笔记后再导回来，锁脸参考图不会带走。</p>
      <div className="row">
        <button type="button" onClick={() => void copyMd()}>
          复制配方
        </button>
        <button type="button" onClick={() => void importClip()}>
          从剪贴板导入
        </button>
        <button type="button" className="linkish" onClick={() => setOpen(!open)}>
          {open ? "收起粘贴框" : "手动粘贴"}
        </button>
      </div>
      {open ? (
        <>
          <textarea
            rows={8}
            value={paste}
            placeholder="把 Markdown 或 JSON 代码块贴这里"
            onChange={(e) => setPaste(e.target.value)}
          />
          <button type="button" onClick={() => applyRaw(paste)} disabled={!paste.trim()}>
            导入这段
          </button>
        </>
      ) : null}
      {hint ? <p className="muted small">{hint}</p> : null}
    </section>
  );
}
