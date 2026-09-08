type Props = {
  comfyMessage: string;
  comfyOk: boolean;
};

export function HardwareBanner({ comfyMessage, comfyOk }: Props) {
  return (
    <p className={comfyOk ? "ok status-line" : "err status-line"}>{comfyMessage}</p>
  );
}
