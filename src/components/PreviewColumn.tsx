import { MetaPanel } from "./MetaPanel";
import { PreviewStage } from "./PreviewStage";
import type { PreviewColumnProps } from "../ui-types";

export function PreviewColumn({
  generation,
  hardwareId,
  modelPresetId,
  faceSettings,
  canUpscale,
  onReuseSeed,
  onLoadParams,
  onUpscaleRerun,
  onZoom,
}: PreviewColumnProps) {
  return (
    <div className="col col-preview">
      <PreviewStage
        imageUrl={generation.imageUrl}
        error={generation.error}
        history={generation.history}
        meta={generation.meta}
        canUpscale={canUpscale}
        busy={generation.busy}
        progress={generation.progress}
        onPick={generation.pickHistory}
        onLoadParams={onLoadParams}
        onUpscaleRerun={onUpscaleRerun}
        onZoom={onZoom}
      />
      <MetaPanel
        meta={generation.meta}
        hardwareId={hardwareId}
        modelPresetId={modelPresetId}
        faceSettings={faceSettings}
        onReuseSeed={onReuseSeed}
      />
    </div>
  );
}
