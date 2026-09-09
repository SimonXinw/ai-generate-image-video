import { useEffect, useRef, useState } from "react";
import { pingComfy } from "./api/comfy-client";
import { ActionDock } from "./components/ActionDock";
import { FaceLockPanel } from "./components/FaceLockPanel";
import { HardwareBanner } from "./components/HardwareBanner";
import { HardwareSwitcher } from "./components/HardwareSwitcher";
import { ImageLightbox } from "./components/ImageLightbox";
import { ImageOptions } from "./components/ImageOptions";
import { ModelPresetPicker } from "./components/ModelPresetPicker";
import { PreviewColumn } from "./components/PreviewColumn";
import { QualityPresets } from "./components/QualityPresets";
import { PromptForm } from "./components/PromptForm";
import { RecipePanel } from "./components/RecipePanel";
import { SizePresets } from "./components/SizePresets";
import { DEFAULT_PARAMS } from "./constants";
import { HARDWARE_PROFILES, loadHardwareId, saveHardwareId } from "./hardware";
import { useImageGeneration } from "./hooks/useImageGeneration";
import { useInView } from "./hooks/useInView";
import {
  applyPreset,
  findPresetCheckpoint,
  mergeHardwarePreset,
  MODEL_PRESETS,
  preferredPresetId,
} from "./model-presets";
import type { Recipe } from "./recipe-types";
import type {
  ComfyStatus,
  FaceLockSettings,
  GenerateParams,
  HardwareId,
  ModelPresetId,
} from "./types";

export function App() {
  const [hwId, setHwId] = useState<HardwareId>(() => loadHardwareId());
  const profile = HARDWARE_PROFILES[hwId];
  const [params, setParams] = useState<GenerateParams>(() =>
    mergeHardwarePreset(DEFAULT_PARAMS, profile, []),
  );
  const [status, setStatus] = useState<ComfyStatus>({
    ok: false,
    message: "正在检测 ComfyUI…",
    checkpoints: [],
    loras: [],
    faceLockAvailable: false,
  });
  const [faceFile, setFaceFile] = useState<File | null>(null);
  const [faceSettings, setFaceSettings] = useState<FaceLockSettings>({
    enabled: false,
    weight: 0.8,
    endAt: 0.9,
  });
  const [zoomUrl, setZoomUrl] = useState("");
  const [modelPresetId, setModelPresetId] = useState<ModelPresetId>(() =>
    preferredPresetId(loadHardwareId()),
  );
  const generation = useImageGeneration();
  const submitRef = useRef<HTMLButtonElement>(null);
  const submitInView = useInView(submitRef);

  useEffect(() => {
    let stop = false;
    pingComfy().then((next) => {
      if (stop) return;
      setStatus(next);
      if (next.checkpoints[0]) {
        setParams((prev) => ({
          ...prev,
          checkpoint:
            prev.checkpoint ||
            findPresetCheckpoint(
              MODEL_PRESETS[preferredPresetId(hwId)],
              next.checkpoints,
            ) ||
            next.checkpoints[0],
        }));
      }
    });
    return () => {
      stop = true;
    };
  }, []);

  const onHardwareChange = (id: HardwareId) => {
    const next = HARDWARE_PROFILES[id];
    setHwId(id);
    saveHardwareId(id);
    setModelPresetId(preferredPresetId(id));
    setParams((prev) => mergeHardwarePreset(prev, next, status.checkpoints));
    setFaceSettings((prev) => ({
      ...prev,
      weight: id === "gtx1660s" ? 0.75 : 0.8,
    }));
  };

  const onModelPresetChange = (id: ModelPresetId) => {
    const preset = MODEL_PRESETS[id];
    const checkpoint = findPresetCheckpoint(preset, status.checkpoints);
    if (!checkpoint) {
      generation.setError(`未安装 ${preset.label}，请先执行模型下载脚本并重启 ComfyUI`);
      return;
    }
    setModelPresetId(id);
    generation.setError("");
    setParams((prev) => applyPreset(prev, preset, checkpoint));
  };

  const onImportRecipe = (recipe: Recipe) => {
    setHwId(recipe.hardware);
    saveHardwareId(recipe.hardware);
    setModelPresetId(recipe.modelPreset);
    setParams(recipe.params);
    setFaceSettings(recipe.faceLock);
    generation.setError("");
  };

  const onSubmit = () =>
    generation.generate(params, hwId, faceSettings, faceFile);

  return (
    <main className="page">
      <h1>本地出图</h1>
      <div className="layout">
        <PreviewColumn
          generation={generation}
          hardwareId={hwId}
          modelPresetId={modelPresetId}
          faceSettings={faceSettings}
          onReuseSeed={(seed) => setParams((p) => ({ ...p, seed }))}
          onZoom={setZoomUrl}
        />
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
            onFileChange={setFaceFile}
            onChange={setFaceSettings}
          />
          <PromptForm
            params={params}
            checkpoints={status.checkpoints}
            loras={status.loras}
            busy={generation.busy}
            stopping={generation.stopping}
            submitRef={submitRef}
            onChange={setParams}
            onSubmit={() => void onSubmit()}
            onStop={() => void generation.stop()}
          />
          <SizePresets params={params} profile={profile} onChange={setParams} />
          <QualityPresets
            params={params}
            profile={profile}
            modelPresetId={modelPresetId}
            onChange={setParams}
          />
          <ImageOptions params={params} onChange={setParams} />
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
      </div>
      {zoomUrl ? (
        <ImageLightbox imageUrl={zoomUrl} onClose={() => setZoomUrl("")} />
      ) : null}
      <ActionDock
        show={!zoomUrl && !submitInView}
        busy={generation.busy}
        stopping={generation.stopping}
        canSubmit={Boolean(params.checkpoint)}
        progress={generation.progress}
        onSubmit={() => void onSubmit()}
        onStop={() => void generation.stop()}
      />
    </main>
  );
}
