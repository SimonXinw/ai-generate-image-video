import type { ResultViewProps } from "../types";

export function ResultView({
  imageUrl,
  error,
  seed,
  history,
  onPick,
  onReuseSeed,
  onZoom,
}: ResultViewProps) {
  return (
    <section className="card result">
      {error ? <p className="err status-line">{error}</p> : null}
      {!imageUrl ? (
        <div className="result-empty muted">
          还没有成图。预览会在生成过程中出现在进度区。
        </div>
      ) : (
        <>
          <button
            type="button"
            className="result-image"
            title="点击放大"
            onClick={() => onZoom(imageUrl)}
          >
            <img src={imageUrl} alt="生成结果" />
          </button>
          <div className="row">
            {seed !== null && (
              <button type="button" onClick={() => onReuseSeed(seed)}>
                复用种子 {seed}
              </button>
            )}
            <a href={imageUrl} download>
              下载
            </a>
          </div>
        </>
      )}
      {history.length > 0 && (
        <>
          <p className="label">最近生成</p>
          <div className="thumbs">
            {history.map((item) => (
              <button
                key={`${item.at}-${item.seed}`}
                type="button"
                className="thumb"
                onClick={() => onPick(item)}
              >
                <img src={item.url} alt={`种子 ${item.seed}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
