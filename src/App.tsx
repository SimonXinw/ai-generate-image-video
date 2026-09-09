import { useEffect, useRef, useState } from "react";
import { pingComfy } from "./api/comfy-client";
import { ActionDock } from "./components/ActionDock";
import { ImageLightbox } from "./components/ImageLightbox";
import { PreviewColumn } from "./components/PreviewColumn";
import { StudioForm } from "./components/StudioForm";
import { DEFAULT_PARAMS } from "./constants";
import { HARDWARE_PROFILES, loadHardwareId, saveHardwareId } from "./hardware";
import { useImageGeneration } from "./hooks/useImageGeneration";
import { useInView } from "./hooks/useInView";
import { submitButtonLabel } from "./lib/upscale-guard";
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
import type { UpscaleMode } from "./upscale-types";
import { needsUpscaleModel } from "./upscale-presets";

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
    upscaleModels: [],
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
  const submitLabel = submitButtonLabel(params, generation.busy);

  useEffect(() => {
    let stop = false;
    pingComfy().then((next) => {
      if (stop) return;
      setStatus(next);
      setParams((prev) => ({
        ...prev,
        checkpoint:
          prev.checkpoint ||
          findPresetCheckpoint(
            MODEL_PRESETS[preferredPresetId(hwId)],
            next.checkpoints,
          ) ||
          next.checkpoints[0] ||
          "",
        upscaleModel: prev.upscaleModel || next.upscaleModels[0] || "",
      }));
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
    setParams((prev) => ({
      ...mergeHardwarePreset(prev, next, status.checkpoints),
      upscaleMode: "off",
      upscaleModel: prev.upscaleModel || status.upscaleModels[0] || "",
    }));
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
    setParams({
      ...recipe.params,
      upscaleModel:
        recipe.params.upscaleModel || status.upscaleModels[0] || "",
    });
    setFaceSettings(recipe.faceLock);
    generation.setError("");
  };

  const onUpscaleRerun = (mode: UpscaleMode) => {
    if (generation.seedUsed === null || generation.busy) return;
    if (needsUpscaleModel(mode) && status.upscaleModels.length === 0) {
      generation.setError("未安装放大模型，请先运行 download-upscale-model.ps1 并重启 ComfyUI");
      return;
    }
    const next: GenerateParams = {
      ...params,
      seed: generation.seedUsed,
      upscaleMode: mode,
      upscaleScale: mode === "esrgan" ? params.upscaleScale : 1.5,
      upscaleModel: params.upscaleModel || status.upscaleModels[0] || "",
    };
    setParams(next);
    void generation.generate(next, hwId, faceSettings, faceFile);
  };

  const onSubmit = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    void generation.generate(params, hwId, faceSettings, faceFile);
  };

  return (
    <main className="page">
      <h1>本地出图</h1>
      <p className="workflow-hint muted small">
        推荐流程：关放大出小图 → 结果区「同种子放大」→ 下载大图
      </p>
      <div className="layout">
        <PreviewColumn
          generation={generation}
          hardwareId={hwId}
          modelPresetId={modelPresetId}
          faceSettings={faceSettings}
          canUpscale={!generation.busy}
          onReuseSeed={(seed) => setParams((p) => ({ ...p, seed }))}
          onLoadParams={(next) => setParams(next)}
          onUpscaleRerun={onUpscaleRerun}
          onZoom={setZoomUrl}
        />
        <StudioForm
          profile={profile}
          hwId={hwId}
          status={status}
          params={params}
          modelPresetId={modelPresetId}
          faceFile={faceFile}
          faceSettings={faceSettings}
          generation={generation}
          submitLabel={submitLabel}
          submitRef={submitRef}
          onHardwareChange={onHardwareChange}
          onModelPresetChange={onModelPresetChange}
          onFaceFile={setFaceFile}
          onFaceSettings={setFaceSettings}
          onParams={setParams}
          onSubmit={() => void onSubmit()}
          onStop={() => void generation.stop()}
          onImportRecipe={onImportRecipe}
        />
      </div>
      {zoomUrl ? (
        <ImageLightbox imageUrl={zoomUrl} onClose={() => setZoomUrl("")} />
      ) : null}
      <ActionDock
        show={!zoomUrl && !submitInView}
        busy={generation.busy}
        stopping={generation.stopping}
        canSubmit={Boolean(params.checkpoint)}
        submitLabel={submitLabel}
        progress={generation.progress}
        onSubmit={() => void onSubmit()}
        onStop={() => void generation.stop()}
      />
    </main>
  );
}
