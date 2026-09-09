import { useState } from "react";
import {
  newClientId,
  queuePrompt,
  uploadInputImage,
  waitForImage,
} from "../api/comfy-client";
import { buildTxt2ImgPrompt, resolveSeed } from "../api/comfy-prompt";
import { findBlockedTerm } from "../lib/safety";
import type {
  FaceLockSettings,
  GenerateParams,
  GenerationMeta,
  HardwareId,
  HistoryItem,
  ProgressState,
} from "../types";

export function useImageGeneration() {
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [seedUsed, setSeedUsed] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [meta, setMeta] = useState<GenerationMeta | null>(null);

  const generate = async (
    params: GenerateParams,
    hwId: HardwareId,
    face: FaceLockSettings,
    faceFile: File | null,
  ) => {
    const blocked = findBlockedTerm(params.prompt);
    if (blocked) {
      setError(`禁止未成年人相关内容（命中：${blocked}）`);
      return;
    }
    if (face.enabled && !faceFile) {
      setError("启用脸锁定前，请先选择一张清晰的成人正脸参考图");
      return;
    }
    setBusy(true);
    setError("");
    setProgress({ percent: 1, step: 0, max: 1, label: "提交任务", previewUrl: "" });
    const seed = resolveSeed(params);
    const clientId = newClientId();
    let lastPreview = "";
    try {
      const imageName = face.enabled && faceFile
        ? await uploadInputImage(faceFile)
        : "";
      const faceWorkflow = imageName
        ? {
            imageName,
            preset: hwId === "gtx1660s"
              ? "FACEID" as const
              : "FACEID PLUS V2" as const,
            weight: face.weight,
            endAt: face.endAt,
          }
        : undefined;
      const graph = buildTxt2ImgPrompt(params, seed, faceWorkflow);
      const promptId = await queuePrompt(graph, clientId);
      const result = await waitForImage(promptId, clientId, seed, (next) => {
        lastPreview = next.previewUrl || lastPreview;
        setProgress(next);
      });
      const snapshot = { ...params, seed: result.seed };
      setImageUrl(result.imageUrl);
      setSeedUsed(result.seed);
      setMeta({ params: snapshot, seed: result.seed });
      setHistory((prev) => [
        { url: result.imageUrl, seed: result.seed, at: Date.now(), params: snapshot },
        ...prev,
      ].slice(0, 8));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "生成失败");
    } finally {
      if (lastPreview.startsWith("blob:")) URL.revokeObjectURL(lastPreview);
      setProgress(null);
      setBusy(false);
    }
  };

  const pickHistory = (item: HistoryItem) => {
    setImageUrl(item.url);
    setSeedUsed(item.seed);
    setMeta({ params: item.params, seed: item.seed });
  };

  return {
    busy,
    imageUrl,
    seedUsed,
    error,
    progress,
    history,
    meta,
    setError,
    generate,
    pickHistory,
  };
}
