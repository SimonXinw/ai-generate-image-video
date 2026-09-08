import type { HistoryItem } from "../types";

type Props = {
  imageUrl: string;
  error: string;
  seed: number | null;
  history: HistoryItem[];
  onPick: (item: HistoryItem) => void;
  onReuseSeed: (seed: number) => void;
};

export function ResultView({ imageUrl, error, seed, history, onPick, onReuseSeed }: Props) {
  return (
    <section className="card result">
      {error ? <p className="err status-line">{error}</p> : null}
      {!imageUrl ? (
        <p className="muted">还没有成图。预览会在生成过程中出现在进度区。</p>
      ) : (
        <>
          <img src={imageUrl} alt="生成结果" />
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
