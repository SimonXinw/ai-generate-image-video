import type { HardwareBannerProps } from "../types";

export function HardwareBanner({ comfyMessage, comfyOk }: HardwareBannerProps) {
  return (
    <p className={comfyOk ? "ok status-line" : "err status-line"}>{comfyMessage}</p>
  );
}
