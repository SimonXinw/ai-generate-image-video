import { useEffect, useState } from "react";
import type { FaceLockPanelProps } from "../types";

export function FaceLockPanel({
  hardwareId,
  available,
  file,
  settings,
  onFileChange,
  onChange,
}: FaceLockPanelProps) {
  const [previewUrl, setPreviewUrl] = useState("");
  const isLowVram = hardwareId === "gtx1660s";

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const set = (patch: Partial<typeof settings>) => {
    onChange({ ...settings, ...patch });
  };

  return (
    <section className="card face-lock">
      <label className="face-lock-toggle">
        <input
          type="checkbox"
          checked={settings.enabled}
          disabled={!available}
          onChange={(event) => set({ enabled: event.target.checked })}
        />
        启用参考脸锁定
      </label>
      <p className="small muted">
        {isLowVram
          ? "1660S：FaceID SD1.5 低显存方案，脸部分析走 CPU。"
          : "2080S：FaceID Plus V2 SDXL，适配 Pony 架构但速度更慢。"}
      </p>
      {!available ? (
        <p className="small err-text">IP-Adapter 节点未就绪，请先运行安装脚本并重启 ComfyUI。</p>
      ) : null}
      <label>
        成人参考脸图
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
      </label>
      {previewUrl ? <img className="face-preview" src={previewUrl} alt="参考脸预览" /> : null}
      <div className="row">
        <label>
          身份强度 {settings.weight.toFixed(2)}
          <input
            type="range"
            min="0.4"
            max="1.3"
            step="0.05"
            value={settings.weight}
            onChange={(event) => set({ weight: Number(event.target.value) })}
          />
        </label>
        <label>
          结束比例 {settings.endAt.toFixed(2)}
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            value={settings.endAt}
            onChange={(event) => set({ endAt: Number(event.target.value) })}
          />
        </label>
      </div>
      <p className="small muted">
        仅使用本人或已获授权的成年人照片；图片会上传到本机 ComfyUI，不会传到在线平台。
      </p>
    </section>
  );
}
