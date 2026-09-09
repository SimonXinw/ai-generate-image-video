import { useRef, useState } from "react";
import {
  cancelPrompt,
  newClientId,
  queuePrompt,
  uploadInputImage,
} from "../api/comfy-client";
import { waitForImage } from "../api/comfy-progress";
import { buildTxt2ImgPrompt, resolveSeed } from "../api/comfy-prompt";
import { findBlockedTerm } from "../lib/safety";
import { progressStartLabel } from "../lib/upscale-guard";
import { needsUpscaleModel } from "../upscale-presets";
import type {
  FaceLockSettings,
  GenerateParams,
  GenerationMeta,
  HardwareId,
  HistoryItem,
  ProgressState,
} from "../types";

export type ImageGeneration = ReturnType<typeof useImageGeneration>;

export function useImageGeneration() {
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [seedUsed, setSeedUsed] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [meta, setMeta] = useState<GenerationMeta | null>(null);
  const [stopping, setStopping] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const promptIdRef = useRef("");

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
    if (needsUpscaleModel(params.upscaleMode) && !params.upscaleModel.trim()) {
      setError("已选 ESRGAN，请先下载放大模型并在下拉框里选中");
      return;
    }
    setBusy(true);
    setStopping(false);
    setError("");
    setProgress({
      percent: 1,
      step: 0,
      max: 1,
      label: progressStartLabel(params.upscaleMode),
      previewUrl: "",
    });
    const seed = resolveSeed(params);
    const clientId = newClientId();
    const controller = new AbortController();
    abortRef.current = controller;
    promptIdRef.current = "";
    let lastPreview = "";
    const timeoutMs = params.upscaleMode === "off" ? 300_000 : 600_000;
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
      const graph = buildTxt2ImgPrompt(params, seed, hwId, faceWorkflow);
      const promptId = await queuePrompt(graph, clientId);
      promptIdRef.current = promptId;
      if (controller.signal.aborted) await cancelPrompt(promptId);
      const result = await waitForImage(
        promptId,
        clientId,
        seed,
        (next) => {
          lastPreview = next.previewUrl || lastPreview;
          setProgress(next);
        },
        controller.signal,
        timeoutMs,
      );
      const snapshot = { ...params, seed: result.seed };
      const at = Date.now();
      setImageUrl(result.imageUrl);
      setSeedUsed(result.seed);
      setMeta({ params: snapshot, seed: result.seed, at });
      setHistory((prev) => [
        { url: result.imageUrl, seed: result.seed, at, params: snapshot },
        ...prev,
      ].slice(0, 8));
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : "生成失败");
      }
    } finally {
      if (lastPreview.startsWith("blob:")) URL.revokeObjectURL(lastPreview);
      abortRef.current = null;
      promptIdRef.current = "";
      setProgress(null);
      setStopping(false);
      setBusy(false);
    }
  };

  const stop = async () => {
    const controller = abortRef.current;
    if (!controller || controller.signal.aborted) return;
    setStopping(true);
    controller.abort();
    await cancelPrompt(promptIdRef.current);
  };

  const pickHistory = (item: HistoryItem) => {
    setImageUrl(item.url);
    setSeedUsed(item.seed);
    setMeta({ params: item.params, seed: item.seed, at: item.at });
  };

  return {
    busy,
    stopping,
    imageUrl,
    seedUsed,
    error,
    progress,
    history,
    meta,
    setError,
    generate,
    stop,
    pickHistory,
  };
}
