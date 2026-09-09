import type { ImageGeneration } from "./hooks/useImageGeneration";
import type {
  FaceLockSettings,
  HardwareId,
  ModelPresetId,
  ProgressState,
} from "./types";

export type PreviewColumnProps = {
  generation: ImageGeneration;
  hardwareId: HardwareId;
  modelPresetId: ModelPresetId;
  faceSettings: FaceLockSettings;
  onReuseSeed: (seed: number) => void;
  onZoom: (url: string) => void;
};

export type ActionDockProps = {
  show: boolean;
  busy: boolean;
  stopping: boolean;
  canSubmit: boolean;
  progress: ProgressState | null;
  onSubmit: () => void;
  onStop: () => void;
};
