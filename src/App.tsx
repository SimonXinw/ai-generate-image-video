import { useEffect, useState } from "react";
import { pingComfy } from "./api/comfy-client";
import { FaceLockPanel } from "./components/FaceLockPanel";
import { HardwareBanner } from "./components/HardwareBanner";
import { HardwareSwitcher } from "./components/HardwareSwitcher";
import { ImageLightbox } from "./components/ImageLightbox";
import { ImageOptions } from "./components/ImageOptions";
import { MetaPanel } from "./components/MetaPanel";
import { ModelPresetPicker } from "./components/ModelPresetPicker";
import { QualityPresets } from "./components/QualityPresets";
import { ProgressPanel } from "./components/ProgressPanel";
import { PromptForm } from "./components/PromptForm";
import { SizePresets } from "./components/SizePresets";
import { ResultView } from "./components/ResultView";
import { DEFAULT_PARAMS } from "./constants";
import { HARDWARE_PROFILES, loadHardwareId, saveHardwareId } from "./hardware";
import { useImageGeneration } from "./hooks/useImageGeneration";
import { balancedQuality } from "./quality-presets";
import {
  applyPreset,
  findPresetCheckpoint,
  mergeHardwarePreset,
  MODEL_PRESETS,
  preferredPresetId,
} from "./model-presets";
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
  const [params, setParams] = useState<GenerateParams>(() => ({
    ...DEFAULT_PARAMS,
    ...profile.sizeByAspect.portrait,
    ...balancedQuality(profile.id),
  }));
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

  const onSubmit = () =>
    generation.generate(params, hwId, faceSettings, faceFile);

  return (
    <main className="page">
      <h1>本地出图</h1>
      <div className="layout">
        <div className="col col-preview">
          <ProgressPanel busy={generation.busy} progress={generation.progress} />
          <ResultView
            imageUrl={generation.imageUrl}
            error={generation.error}
            seed={generation.seedUsed}
            history={generation.history}
            onPick={generation.pickHistory}
            onReuseSeed={(seed) => setParams((p) => ({ ...p, seed }))}
            onZoom={setZoomUrl}
          />
          <MetaPanel
            meta={generation.meta}
            onReuseSeed={(seed) => setParams((p) => ({ ...p, seed }))}
          />
        </div>
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
            onChange={setParams}
            onSubmit={() => void onSubmit()}
          />
          <SizePresets params={params} profile={profile} onChange={setParams} />
          <QualityPresets params={params} profile={profile} onChange={setParams} />
          <ImageOptions params={params} onChange={setParams} />
        </div>
      </div>
      {zoomUrl ? (
        <ImageLightbox imageUrl={zoomUrl} onClose={() => setZoomUrl("")} />
      ) : null}
    </main>
  );
}
