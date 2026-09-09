import type { RefObject } from "react";
import type { ImageGeneration } from "./hooks/useImageGeneration";
import type { Recipe } from "./recipe-types";
import type {
  ComfyStatus,
  FaceLockSettings,
  GenerateParams,
  GenerationMeta,
  HardwareId,
  HardwareProfile,
  HistoryItem,
  ModelPresetId,
  ProgressState,
} from "./types";
import type { UpscaleMode } from "./upscale-types";

export type PreviewColumnProps = {
  generation: ImageGeneration;
  hardwareId: HardwareId;
  modelPresetId: ModelPresetId;
  faceSettings: FaceLockSettings;
  canUpscale: boolean;
  onReuseSeed: (seed: number) => void;
  onLoadParams: (params: GenerateParams) => void;
  onUpscaleRerun: (mode: UpscaleMode) => void;
  onZoom: (url: string) => void;
};

export type ActionDockProps = {
  show: boolean;
  busy: boolean;
  stopping: boolean;
  canSubmit: boolean;
  submitLabel: string;
  progress: ProgressState | null;
  onSubmit: () => void;
  onStop: () => void;
};

/** 左侧预览区：进度条 + 大图 + 操作条 + 一行缩略图 */
export type PreviewStageProps = {
  imageUrl: string;
  error: string;
  history: HistoryItem[];
  /** 当前显示这张图的参数快照：种子、放大管线、下载文件名都从它来 */
  meta: GenerationMeta | null;
  canUpscale: boolean;
  busy: boolean;
  progress: ProgressState | null;
  onPick: (item: HistoryItem) => void;
  onLoadParams: (params: GenerateParams) => void;
  onUpscaleRerun: (mode: UpscaleMode) => void;
  onZoom: (url: string) => void;
};

/** 大图下面那条矮操作条：只放放大管线（下载按钮浮在大图上，种子在参数卡里） */
export type StageActionsProps = {
  imageUrl: string;
  seed: number | null;
  metaUpscaleMode: UpscaleMode | null;
  canUpscale: boolean;
  onUpscaleRerun: (mode: UpscaleMode) => void;
};

/** 浮在大图右下角的下载按钮，文件名由 meta 拼出来 */
export type StageDownloadProps = {
  imageUrl: string;
  meta: GenerationMeta | null;
};

export type StageStripProps = {
  history: HistoryItem[];
  onPick: (item: HistoryItem) => void;
  onLoadParams: (params: GenerateParams) => void;
};

export type StageThumbProps = {
  item: HistoryItem;
  onPick: (item: HistoryItem) => void;
  onLoadParams: (params: GenerateParams) => void;
};

export type PromptFormProps = {
  params: GenerateParams;
  checkpoints: string[];
  loras: string[];
  busy: boolean;
  stopping: boolean;
  submitLabel: string;
  submitRef: RefObject<HTMLButtonElement | null>;
  onChange: (next: GenerateParams) => void;
  onSubmit: () => void;
  onStop: () => void;
};

export type StudioFormProps = {
  profile: HardwareProfile;
  hwId: HardwareId;
  status: ComfyStatus;
  params: GenerateParams;
  modelPresetId: ModelPresetId;
  faceFile: File | null;
  faceSettings: FaceLockSettings;
  generation: ImageGeneration;
  submitLabel: string;
  submitRef: RefObject<HTMLButtonElement | null>;
  onHardwareChange: (id: HardwareId) => void;
  onModelPresetChange: (id: ModelPresetId) => void;
  onFaceFile: (file: File | null) => void;
  onFaceSettings: (next: FaceLockSettings) => void;
  onParams: (next: GenerateParams) => void;
  onSubmit: () => void;
  onStop: () => void;
  onImportRecipe: (recipe: Recipe) => void;
};
