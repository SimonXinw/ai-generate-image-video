import { FaceLockPanel } from "./FaceLockPanel";
import { HardwareBanner } from "./HardwareBanner";
import { HardwareSwitcher } from "./HardwareSwitcher";
import { ImageOptions } from "./ImageOptions";
import { ModelPresetPicker } from "./ModelPresetPicker";
import { PromptForm } from "./PromptForm";
import { QualityPresets } from "./QualityPresets";
import { RecipePanel } from "./RecipePanel";
import { SizePresets } from "./SizePresets";
import { UpscalePanel } from "./UpscalePanel";
import type { StudioFormProps } from "../ui-types";

export function StudioForm({
  profile,
  hwId,
  status,
  params,
  modelPresetId,
  faceFile,
  faceSettings,
  generation,
  submitLabel,
  submitRef,
  onHardwareChange,
  onModelPresetChange,
  onFaceFile,
  onFaceSettings,
  onParams,
  onSubmit,
  onStop,
  onImportRecipe,
}: StudioFormProps) {
  return (
    <div className="col col-form">
      <HardwareSwitcher profile={profile} onChange={onHardwareChange} />
      <HardwareBanner comfyMessage={status.message} comfyOk={status.ok} />
      <ModelPresetPicker
        activeId={modelPresetId}
        checkpoints={status.checkpoints}
        vramGb={profile.vramGb}
        onChange={onModelPresetChange}
      />
      <FaceLockPanel
        hardwareId={hwId}
        available={status.faceLockAvailable}
        file={faceFile}
        settings={faceSettings}
        onFileChange={onFaceFile}
        onChange={onFaceSettings}
      />
      <PromptForm
        params={params}
        checkpoints={status.checkpoints}
        loras={status.loras}
        busy={generation.busy}
        stopping={generation.stopping}
        submitLabel={submitLabel}
        submitRef={submitRef}
        onChange={onParams}
        onSubmit={onSubmit}
        onStop={onStop}
      />
      <div className="form-pair">
        <SizePresets params={params} profile={profile} onChange={onParams} />
        <QualityPresets
          params={params}
          profile={profile}
          modelPresetId={modelPresetId}
          onChange={onParams}
        />
      </div>
      <UpscalePanel
        params={params}
        hardwareId={hwId}
        upscaleModels={status.upscaleModels}
        faceOn={faceSettings.enabled}
        onChange={onParams}
      />
      <ImageOptions params={params} onChange={onParams} />
      <RecipePanel
        hardwareId={hwId}
        modelPresetId={modelPresetId}
        params={params}
        faceSettings={faceSettings}
        checkpoints={status.checkpoints}
        loras={status.loras}
        onImport={onImportRecipe}
      />
    </div>
  );
}
