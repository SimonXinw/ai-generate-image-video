import type { ProgressState } from "../types";

type Props = {
  busy: boolean;
  progress: ProgressState | null;
};

export function ProgressPanel({ busy, progress }: Props) {
  if (!busy || !progress) return null;
  const percent = progress.percent;
  return (
    <section className="card progress">
      <p className="label">{progress.label}</p>
      <div className="bar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className="muted small">
        {percent}%
        {progress.max > 1 ? ` · ${progress.step}/${progress.max}` : ""}
      </p>
      {progress.previewUrl ? (
        <img className="preview" src={progress.previewUrl} alt="生成预览" />
      ) : (
        <p className="muted">出图中，预览出现前请稍等（1660S 会慢一些）。</p>
      )}
    </section>
  );
}
