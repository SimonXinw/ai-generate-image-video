import { useEffect, useState } from "react";
import { pingComfy, queuePrompt, waitForImage } from "./api/comfy-client";
import { buildTxt2ImgPrompt } from "./api/comfy-prompt";
import { AgeGate } from "./components/AgeGate";
import { HardwareBanner } from "./components/HardwareBanner";
import { HardwareSwitcher } from "./components/HardwareSwitcher";
import { PromptForm } from "./components/PromptForm";
import { ResultView } from "./components/ResultView";
import { AGE_KEY, DEFAULT_PARAMS } from "./constants";
import {
  HARDWARE_PROFILES,
  loadHardwareId,
  saveHardwareId,
} from "./hardware";
import { findBlockedTerm } from "./lib/safety";
import type { ComfyStatus, GenerateParams, HardwareId } from "./types";

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
  const [error, setError] = useState("");

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
    try {
      const promptId = await queuePrompt(buildTxt2ImgPrompt(params));
      const result = await waitForImage(promptId);
      setImageUrl(result.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
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
      <PromptForm
        params={params}
        profile={profile}
        checkpoints={status.checkpoints}
        loras={status.loras}
        busy={busy}
        onChange={setParams}
        onSubmit={() => void onSubmit()}
      />
      <ResultView imageUrl={imageUrl} error={error} />
    </main>
  );
}
