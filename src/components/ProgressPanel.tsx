import type { ProgressPanelProps } from "../types";

export function ProgressPanel({ busy, progress }: ProgressPanelProps) {
  if (!busy || !progress) return null;
  const percent = progress.percent;
  return (
    <div className="stage-progress">
      <div
        className="bar"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className="muted small stage-progress-text">
        {progress.label} · {percent}%
        {progress.max > 1 ? ` · ${progress.step}/${progress.max}` : ""}
      </p>
    </div>
  );
}
