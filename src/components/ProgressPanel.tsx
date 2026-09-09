import type { ProgressPanelProps } from "../types";

export function ProgressPanel({ busy, progress }: ProgressPanelProps) {
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
        <p className="muted">
          出图中，预览出现前请稍等。开了放大会先出底图再后处理，总时间更长。
        </p>
      )}
    </section>
  );
}
