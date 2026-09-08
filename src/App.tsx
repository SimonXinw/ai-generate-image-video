import { useEffect, useState } from "react";
import { newClientId, pingComfy, queuePrompt, waitForImage } from "./api/comfy-client";
import { buildTxt2ImgPrompt, resolveSeed } from "./api/comfy-prompt";
import { AgeGate } from "./components/AgeGate";
import { HardwareBanner } from "./components/HardwareBanner";
import { HardwareSwitcher } from "./components/HardwareSwitcher";
import { ImageOptions } from "./components/ImageOptions";
import { ProgressPanel } from "./components/ProgressPanel";
import { PromptForm } from "./components/PromptForm";
import { ResultView } from "./components/ResultView";
import { AGE_KEY, DEFAULT_PARAMS } from "./constants";
import { HARDWARE_PROFILES, loadHardwareId, saveHardwareId } from "./hardware";
import { findBlockedTerm } from "./lib/safety";
import type {
  ComfyStatus,
  GenerateParams,
  HardwareId,
  HistoryItem,
  ProgressState,
} from "./types";

export function App() {
  const [ageOk, setAgeOk] = useState(() => localStorage.getItem(AGE_KEY) === "1");
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

  useEffect(() => {
    let stop = false;
    pingComfy().then((next) => {
      if (stop) return;
      setStatus(next);
      if (next.checkpoints[0]) {
        setParams((prev) => ({
          ...prev,
          checkpoint: prev.checkpoint || next.checkpoints[0],
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
    setParams((prev) => ({
      ...prev,
      prompt: next.defaultPrompt,
      negativePrompt: next.defaultNegative,
      ...next.sizeByAspect.portrait,
      steps: next.defaultSteps,
      cfg: next.defaultCfg,
    }));
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
      setImageUrl(result.imageUrl);
      setSeedUsed(result.seed);
      setHistory((prev) =>
        [{ url: result.imageUrl, seed: result.seed, at: Date.now() }, ...prev].slice(0, 8),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      if (lastPreview.startsWith("blob:")) URL.revokeObjectURL(lastPreview);
      setProgress(null);
      setBusy(false);
    }
  };

  if (!ageOk) {
    return <AgeGate onConfirm={() => setAgeOk(true)} />;
  }

  return (
    <main className="page">
      <h1>本地出图</h1>
      <HardwareSwitcher profile={profile} onChange={onHardwareChange} />
      <HardwareBanner comfyMessage={status.message} comfyOk={status.ok} />
      <ProgressPanel busy={busy} progress={progress} />
      <ResultView
        imageUrl={imageUrl}
        error={error}
        seed={seedUsed}
        history={history}
        onPick={(item) => {
          setImageUrl(item.url);
          setSeedUsed(item.seed);
        }}
        onReuseSeed={(seed) => setParams((p) => ({ ...p, seed }))}
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
      <ImageOptions params={params} onChange={setParams} />
    </main>
  );
}
