import { upscaleModeLabel } from "../lib/upscale-guard";
import type { StageActionsProps } from "../ui-types";

export function StageActions({
  imageUrl,
  seed,
  metaUpscaleMode,
  canUpscale,
  onUpscaleRerun,
}: StageActionsProps) {
  const doneLabel =
    metaUpscaleMode && metaUpscaleMode !== "off"
      ? upscaleModeLabel(metaUpscaleMode)
      : "";
  const showUpscale =
    seed !== null && metaUpscaleMode === "off" && canUpscale;
  if (!imageUrl || (!doneLabel && !showUpscale)) return null;

  return (
    <div className="stage-bar">
      {doneLabel ? (
        <span className="stage-note muted small">已走 {doneLabel} 管线</span>
      ) : null}
      {showUpscale ? (
        <span className="stage-group">
          <span className="stage-note muted small">同种子放大</span>
          <button
            type="button"
            className="btn-sm"
            onClick={() => onUpscaleRerun("hires")}
          >
            高分
          </button>
          <button
            type="button"
            className="btn-sm"
            onClick={() => onUpscaleRerun("esrgan")}
          >
            ESRGAN
          </button>
          <button
            type="button"
            className="btn-sm accent-btn"
            onClick={() => onUpscaleRerun("hires_esrgan")}
          >
            高分+ESRGAN
          </button>
        </span>
      ) : null}
    </div>
  );
}
