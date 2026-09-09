import { finalSize, upscaleModeLabel } from "../lib/upscale-guard";
import type { StageStripProps, StageThumbProps } from "../ui-types";

export function StageStrip({
  history,
  onPick,
  onLoadParams,
}: StageStripProps) {
  if (history.length === 0) return null;

  return (
    <div className="stage-strip" aria-label="最近生成，点选载入参数">
      {history.map((item) => (
        <StripThumb
          key={`${item.at}-${item.seed}`}
          item={item}
          onPick={onPick}
          onLoadParams={onLoadParams}
        />
      ))}
    </div>
  );
}

function StripThumb({ item, onPick, onLoadParams }: StageThumbProps) {
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
      title={`种子 ${item.seed} · ${upscaleModeLabel(mode)} · ${size.width}×${size.height}（点选载入参数）`}
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
