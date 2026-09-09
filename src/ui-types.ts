import type { RefObject } from "react";
import type { ImageGeneration } from "./hooks/useImageGeneration";
import type { Recipe } from "./recipe-types";
import type {
  ComfyStatus,
  FaceLockSettings,
  GenerateParams,
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

export type ResultViewProps = {
  imageUrl: string;
  error: string;
  seed: number | null;
  history: HistoryItem[];
  metaUpscaleMode: UpscaleMode | null;
  canUpscale: boolean;
  onPick: (item: HistoryItem) => void;
  onReuseSeed: (seed: number) => void;
  onLoadParams: (params: GenerateParams) => void;
  onUpscaleRerun: (mode: UpscaleMode) => void;
  onZoom: (url: string) => void;
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
