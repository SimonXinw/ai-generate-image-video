import type { ActionDockProps } from "../ui-types";

/** 主按钮滚出视口后停靠在底部；出图中固定显示，随时能停 */
export function ActionDock({
  show,
  busy,
  stopping,
  canSubmit,
  progress,
  onSubmit,
  onStop,
}: ActionDockProps) {
  if (!show) return null;
  const percent = progress?.percent ?? 0;

  return (
    <div className="action-dock">
      {busy ? <span className="dock-progress" style={{ width: `${percent}%` }} /> : null}
      <div className="dock-inner">
        <div className="dock-action">
          <button
            type="button"
            className="dock-submit"
            onClick={onSubmit}
            disabled={busy || !canSubmit}
          >
            {busy ? `生成中 ${percent}%` : "开始生成"}
          </button>
          <button
            type="button"
            className="stop"
            onClick={onStop}
            disabled={!busy || stopping}
          >
            {stopping ? "正在停止…" : "停止出图"}
          </button>
        </div>
      </div>
    </div>
  );
}
