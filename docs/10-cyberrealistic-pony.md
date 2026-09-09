# CyberRealistic Pony 写实模型

适用：机器 A（RTX 2080 Super 8GB）、ComfyUI、单张文生图。

## 为什么选它

本项目已有 Pony V6 XL 和大量 Pony 提示词。CyberRealistic Pony v18 CoreShift
保留 `score_9`、Booru 标签、姿势与成人概念，同时把人物、皮肤和光线改成照片风。
相比 Juggernaut XL，它不是绝对更强，但迁移现有提示词时改动更少、回归风险更低。

来源：

- [Civitai 模型页](https://civitai.com/models/443821/cyberrealistic-pony)
- [作者 Hugging Face 权重](https://huggingface.co/cyberdelia/CyberRealisticPony/blob/main/CyberRealisticPony_V18.0_F16.safetensors)

版本：`CyberRealisticPony_V18.0_F16.safetensors`（FP16，约 6.46 GiB）。
VAE 已烘焙，不要再叠外部 VAE。

- 精确大小：`6938041288` bytes
- SHA-256：`1d580c1c3f3612fa4db88af65372255582d5509ca0b28f85387273368301941b`

## 许可证提醒

个人本地使用没有收费推理问题。该模型基于 Pony V6 衍生链；
若以后做收费网站、App 或 API，必须重新核对当时的模型卡和上游许可证并取得授权，
不能把本地可用理解为可直接商业托管。

## 下载

仓库根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\download-cyberrealistic-pony.ps1
```

脚本支持断点续传和重复执行，保存到：

```text
vendor/ComfyUI/models/checkpoints/CyberRealisticPony_V18.0_F16.safetensors
```

模型文件由 `.gitignore` 排除，不会推送 GitHub。下载完成后重启 ComfyUI。

## 推荐参数

- 分辨率：`832×1216` 或 `896×1152`
- Batch：1
- 采样器：`dpmpp_2m`
- 调度：`karras`
- Steps：30（需要时到 35）
- CFG：5
- CLIP Skip：2
- VAE：模型内置

8GB 显存首次不要同时开「高分+ESRGAN」、ControlNet 或多个 LoRA。
放大说明见 [`docs/18-upscale.md`](18-upscale.md)。VAE 解码若 OOM，
先降回 `768×1152`；仍不够再用 `--lowvram --force-fp16` 启动。

## UI 使用

1. 启动 ComfyUI 和前端。
2. 在“模型方案”选择“成人写实 · CyberRealistic Pony”。
3. 页面会匹配 checkpoint，并应用上面的分辨率和采样参数。
4. checkpoint 未安装时会提示先执行下载脚本，不会静默使用错误模型。
5. 仍可在底层“模型”下拉框手动覆盖。

## 提示词

完整存档（含种子）见 [`15-cyber-prompt-keywords.md`](15-cyber-prompt-keywords.md)。
和 Pony 的差异见 [`14-cyber-vs-pony-prompts.md`](14-cyber-vs-pony-prompts.md)。

正向继续使用 Pony score 链：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo,
photorealistic, realistic photo, beautiful adult woman, skin details
```

负向从质量和解剖缺陷开始，不要一开始堆过长的通用负向：

```text
score_6, score_5, score_4, worst quality, low quality, lowres,
bad anatomy, bad hands, extra limbs, unnatural face, watermark
```

详细历史配方在 `docs/09-prompt-keywords.md`。写实模型仍不能保证复杂手脚正确；
固定种子只固定随机噪声，不会训练模型。

## 验证

成功标准：

1. `http://127.0.0.1:8188/object_info` 能找到新文件名。
2. UI 选择写实方案后显示 CFG 5、Steps 30、CLIP Skip 2。
3. 用安全成人肖像烟测能在 8GB 显存完成一张 `832×1216`。
4. 切回 Pony V6 方案后 checkpoint 和默认参数恢复。

ComfyUI 启动后可运行固定烟测：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-cyberrealistic.ps1
```

烟测使用安全成人肖像、固定 seed `20260909`，输出前缀为
`cyberrealistic_smoke`，不会改变或训练模型。

相同 prompt 加相同 seed 会命中 ComfyUI 的任务缓存并秒回旧图，
需要真实重算或回归另一个 checkpoint 时传参：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-cyberrealistic.ps1 -Seed 990909001
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-cyberrealistic.ps1 `
  -Checkpoint "ponyDiffusionV6XL_v6StartWithThisOne.safetensors" -Seed 990909002
```

本机实测（2026-09-09）：RTX 2080 Super 8GB、832×1216、30 steps、
CFG 5、DPM++ 2M Karras，首次含模型加载共 **24.2 秒**，无 OOM；
输出 `cyberrealistic_smoke_00001_.png`。换 seed 重算 **20.1 秒**，
Pony V6 回归重算 **26.1 秒**，两个方案均正常出图。
