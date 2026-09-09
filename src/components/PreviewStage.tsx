import { ProgressPanel } from "./ProgressPanel";
import { StageActions } from "./StageActions";
import { StageDownload } from "./StageDownload";
import { StageStrip } from "./StageStrip";
import type { PreviewStageProps } from "../ui-types";

export function PreviewStage({
  imageUrl,
  error,
  history,
  meta,
  canUpscale,
  busy,
  progress,
  onPick,
  onLoadParams,
  onUpscaleRerun,
  onZoom,
}: PreviewStageProps) {
  const livePreview = busy ? progress?.previewUrl ?? "" : "";
  const shownUrl = livePreview || imageUrl;

  return (
    <section className="card preview-stage">
      {error ? <p className="err status-line">{error}</p> : null}
      <ProgressPanel busy={busy} progress={progress} />
      <div className="stage-media">
        {shownUrl ? (
          <div className="stage-frame">
            <button
              type="button"
              className="stage-image"
              title="点击放大查看"
              onClick={() => onZoom(shownUrl)}
            >
              <img
                src={shownUrl}
                alt={livePreview ? "生成预览" : "生成结果"}
              />
            </button>
            {livePreview ? null : (
              <StageDownload imageUrl={imageUrl} meta={meta} />
            )}
          </div>
        ) : (
          <p className="stage-empty muted">
            {busy
              ? "出图中，预览会直接显示在这里。开了放大会先出底图再后处理，总时间更长。"
              : "还没有成图。建议先关放大出小图，构图满意后再用同种子放大。"}
          </p>
        )}
      </div>
      <StageActions
        imageUrl={imageUrl}
        seed={meta?.seed ?? null}
        metaUpscaleMode={meta?.params.upscaleMode ?? null}
        canUpscale={canUpscale}
        onUpscaleRerun={onUpscaleRerun}
      />
      <StageStrip
        history={history}
        onPick={onPick}
        onLoadParams={onLoadParams}
      />
    </section>
  );
}
