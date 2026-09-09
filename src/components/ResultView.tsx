import { finalSize, upscaleModeLabel } from "../lib/upscale-guard";
import type { ResultViewProps } from "../ui-types";

export function ResultView({
  imageUrl,
  error,
  seed,
  history,
  metaUpscaleMode,
  canUpscale,
  onPick,
  onReuseSeed,
  onLoadParams,
  onUpscaleRerun,
  onZoom,
}: ResultViewProps) {
  const showUpscaleCta =
    Boolean(imageUrl) && seed !== null && metaUpscaleMode === "off" && canUpscale;

  return (
    <section className="card result">
      {error ? <p className="err status-line">{error}</p> : null}
      {!imageUrl ? (
        <div className="result-empty muted">
          还没有成图。建议先关放大出小图，预览会出现在进度区。
        </div>
      ) : (
        <>
          <button
            type="button"
            className="result-image"
            title="点击放大查看"
            onClick={() => onZoom(imageUrl)}
          >
            <img src={imageUrl} alt="生成结果" />
          </button>
          {metaUpscaleMode && metaUpscaleMode !== "off" ? (
            <p className="muted small">
              本张已走 {upscaleModeLabel(metaUpscaleMode)} 管线
            </p>
          ) : null}
          <div className="row">
            {seed !== null ? (
              <button type="button" onClick={() => onReuseSeed(seed)}>
                复用种子 {seed}
              </button>
            ) : null}
            <a href={imageUrl} download>
              下载
            </a>
          </div>
          {showUpscaleCta ? (
            <div className="upscale-cta">
              <p className="field-hint">构图满意？用同一种子跑放大管线：</p>
              <div className="row">
                <button type="button" onClick={() => onUpscaleRerun("hires")}>
                  同种子 · 高分
                </button>
                <button type="button" onClick={() => onUpscaleRerun("esrgan")}>
                  同种子 · ESRGAN
                </button>
                <button
                  type="button"
                  className="accent-btn"
                  onClick={() => onUpscaleRerun("hires_esrgan")}
                >
                  同种子 · 高分+ESRGAN
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
      {history.length > 0 ? (
        <>
          <p className="label">最近生成（点选载入参数）</p>
          <div className="thumbs">
            {history.map((item) => (
              <HistoryThumb
                key={`${item.at}-${item.seed}`}
                item={item}
                onPick={onPick}
                onLoadParams={onLoadParams}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

function HistoryThumb({
  item,
  onPick,
  onLoadParams,
}: {
  item: ResultViewProps["history"][number];
  onPick: ResultViewProps["onPick"];
  onLoadParams: ResultViewProps["onLoadParams"];
}) {
  const mode = item.params.upscaleMode;
  const size = finalSize(
    item.params.width,
    item.params.height,
    mode,
    item.params.upscaleScale,
  );
  return (
    <button
      type="button"
      className="thumb"
      title={`种子 ${item.seed} · ${upscaleModeLabel(mode)} · ${size.width}×${size.height}`}
      onClick={() => {
        onPick(item);
        onLoadParams(item.params);
      }}
    >
      <img src={item.url} alt={`种子 ${item.seed}`} />
      <span className="thumb-badge">{upscaleModeLabel(mode)}</span>
    </button>
  );
}
