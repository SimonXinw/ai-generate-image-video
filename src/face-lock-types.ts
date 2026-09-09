import type { HardwareId } from "./types";

export type FaceLockSettings = {
  enabled: boolean;
  weight: number;
  endAt: number;
};

export type FaceLockWorkflow = {
  imageName: string;
  preset: "FACEID" | "FACEID PLUS V2";
  weight: number;
  endAt: number;
};

export type FaceLockPanelProps = {
  hardwareId: HardwareId;
  available: boolean;
  file: File | null;
  settings: FaceLockSettings;
  onFileChange: (file: File | null) => void;
  onChange: (next: FaceLockSettings) => void;
};
