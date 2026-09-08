import { useEffect, useState } from "react";
import { newClientId, pingComfy, queuePrompt, waitForImage } from "./api/comfy-client";
import { buildTxt2ImgPrompt, resolveSeed } from "./api/comfy-prompt";
import { HardwareBanner } from "./components/HardwareBanner";
import { HardwareSwitcher } from "./components/HardwareSwitcher";
import { ImageLightbox } from "./components/ImageLightbox";
import { ImageOptions } from "./components/ImageOptions";
import { MetaPanel } from "./components/MetaPanel";
import { ModelPresetPicker } from "./components/ModelPresetPicker";
import { ProgressPanel } from "./components/ProgressPanel";
import { PromptForm } from "./components/PromptForm";
import { SizePresets } from "./components/SizePresets";
import { ResultView } from "./components/ResultView";
import { DEFAULT_PARAMS } from "./constants";
import { HARDWARE_PROFILES, loadHardwareId, saveHardwareId } from "./hardware";
import { findBlockedTerm } from "./lib/safety";
import {
  applyPreset,
  findPresetCheckpoint,
  mergeHardwarePreset,
  MODEL_PRESETS,
  preferredPresetId,
} from "./model-presets";
import type {
  ComfyStatus,
  GenerateParams,
  GenerationMeta,
  HardwareId,
  HistoryItem,
  ModelPresetId,
  ProgressState,
} from "./types";

export function App() {
  const [hwId, setHwId] = useState<HardwareId>(() => loadHardwareId());
  const profile = HARDWARE_PROFILES[hwId];
  const [params, setParams] = useState<GenerateParams>(() => ({
    ...DEFAULT_PARAMS,
    ...profile.sizeByAspect.portrait,
    steps: profile.defaultSteps,
    cfg: profile.defaultCfg,
  }));
  const [status, setStatus] = useState<ComfyStatus>({
    ok: false,
    message: "正在检测 ComfyUI…",
    checkpoints: [],
    loras: [],
  });
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [seedUsed, setSeedUsed] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [zoomUrl, setZoomUrl] = useState("");
  const [meta, setMeta] = useState<GenerationMeta | null>(null);
  const [modelPresetId, setModelPresetId] = useState<ModelPresetId>(() =>
    preferredPresetId(loadHardwareId()),
  );

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
  };

  const onModelPresetChange = (id: ModelPresetId) => {
    const preset = MODEL_PRESETS[id];
    const checkpoint = findPresetCheckpoint(preset, status.checkpoints);
    if (!checkpoint) {
      setError(`未安装 ${preset.label}，请先执行模型下载脚本并重启 ComfyUI`);
      return;
    }
    setModelPresetId(id);
    setError("");
    setParams((prev) => applyPreset(prev, preset, checkpoint));
  };

  const onSubmit = async () => {
    const blocked = findBlockedTerm(params.prompt);
    if (blocked) {
      setError(`禁止未成年人相关内容（命中：${blocked}）`);
      return;
    }
    setBusy(true);
    setError("");
    setProgress({ percent: 1, step: 0, max: 1, label: "提交任务", previewUrl: "" });
    const seed = resolveSeed(params);
    const clientId = newClientId();
    let lastPreview = "";
    try {
      const promptId = await queuePrompt(buildTxt2ImgPrompt(params, seed), clientId);
      const result = await waitForImage(promptId, clientId, seed, (p) => {
        lastPreview = p.previewUrl || lastPreview;
        setProgress(p);
      });
      const snapshot = { ...params, seed: result.seed };
      setImageUrl(result.imageUrl);
      setSeedUsed(result.seed);
      setMeta({ params: snapshot, seed: result.seed });
      setHistory((prev) =>
        [
          { url: result.imageUrl, seed: result.seed, at: Date.now(), params: snapshot },
          ...prev,
        ].slice(0, 8),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      if (lastPreview.startsWith("blob:")) URL.revokeObjectURL(lastPreview);
      setProgress(null);
      setBusy(false);
    }
  };

  return (
    <main className="page">
      <h1>本地出图</h1>
      <div className="layout">
        <div className="col col-preview">
          <ProgressPanel busy={busy} progress={progress} />
          <ResultView
            imageUrl={imageUrl}
            error={error}
            seed={seedUsed}
            history={history}
            onPick={(item) => {
              setImageUrl(item.url);
              setSeedUsed(item.seed);
              setMeta({ params: item.params, seed: item.seed });
            }}
            onReuseSeed={(seed) => setParams((p) => ({ ...p, seed }))}
            onZoom={setZoomUrl}
          />
          <MetaPanel
            meta={meta}
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
          <PromptForm
            params={params}
            profile={profile}
            checkpoints={status.checkpoints}
            loras={status.loras}
            busy={busy}
            onChange={setParams}
            onSubmit={() => void onSubmit()}
          />
          <SizePresets params={params} onChange={setParams} />
          <ImageOptions params={params} onChange={setParams} />
        </div>
      </div>
      {zoomUrl ? (
        <ImageLightbox imageUrl={zoomUrl} onClose={() => setZoomUrl("")} />
      ) : null}
    </main>
  );
}
