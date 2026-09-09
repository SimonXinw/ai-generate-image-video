import { MetaPanel } from "./MetaPanel";
import { ProgressPanel } from "./ProgressPanel";
import { ResultView } from "./ResultView";
import type { PreviewColumnProps } from "../ui-types";

export function PreviewColumn({
  generation,
  hardwareId,
  modelPresetId,
  faceSettings,
  onReuseSeed,
  onZoom,
}: PreviewColumnProps) {
  return (
    <div className="col col-preview">
      <ProgressPanel busy={generation.busy} progress={generation.progress} />
      <ResultView
        imageUrl={generation.imageUrl}
        error={generation.error}
        seed={generation.seedUsed}
        history={generation.history}
        onPick={generation.pickHistory}
        onReuseSeed={onReuseSeed}
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
