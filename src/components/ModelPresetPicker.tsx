import { InfoTip } from "./InfoTip";
import { findPresetCheckpoint, MODEL_PRESET_IDS, MODEL_PRESETS } from "../model-presets";
import type { ModelPresetPickerProps } from "../types";

export function ModelPresetPicker({
  activeId,
  checkpoints,
  vramGb,
  onChange,
}: ModelPresetPickerProps) {
  return (
    <section className="card model-presets">
      <p className="label">
        模型方案
        <InfoTip text="切换 checkpoint 和推荐采样参数，但保留你当前写好的正向、负向提示词。" />
      </p>
      <div className="model-preset-list">
        {MODEL_PRESET_IDS.map((id) => {
          const preset = MODEL_PRESETS[id];
          const installed = Boolean(findPresetCheckpoint(preset, checkpoints));
          const supported = vramGb >= preset.minVramGb;
          return (
            <button
              key={id}
              type="button"
              className={activeId === id ? "model-preset active" : "model-preset"}
              disabled={!installed || !supported}
              onClick={() => onChange(id)}
            >
              <span>{preset.label}</span>
              <small>{preset.description}</small>
              <small className={installed ? "preset-ready" : "preset-missing"}>
                {!supported
                  ? `需要至少 ${preset.minVramGb}GB 显存`
                  : installed
                    ? "已安装"
                    : "未安装"}
              </small>
            </button>
          );
        })}
      </div>
      {!findPresetCheckpoint(MODEL_PRESETS.cyberRealisticPony, checkpoints) ? (
        <p className="muted small">
          写实模型未出现时，执行下载脚本并重启 ComfyUI。
        </p>
      ) : null}
    </section>
  );
}
