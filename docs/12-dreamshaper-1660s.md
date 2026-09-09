# DreamShaper 8（1660 Super 主推）

适用：机器 B（GTX 1660 Super 6GB）、ComfyUI、单张文生图。
不要在这张卡上默认跑 Pony XL / CyberRealistic Pony（约 6–7GB 权重）。

## 为什么选它

1660S 只有 6GB 显存，必须 `--lowvram`。SD1.5 单文件约 2GB，512×768
能稳定出图。DreamShaper 8 pruned 对 NSFW 友好，提示词用自然语言，
不要写 Pony 的 `score_9` 前缀。

来源：

- [Civitai 模型页](https://civitai.com/models/4384/dreamshaper)
- [Hugging Face 权重](https://huggingface.co/Lykon/DreamShaper/blob/main/DreamShaper_8_pruned.safetensors)

版本：`DreamShaper_8_pruned.safetensors`（约 2.13GB）。

- 精确大小：`2132625894` bytes
- SHA-256：`879db523c30d3b9017143d56705015e15a2cb5628762c11d086fed9538abd7fd`

## 许可证提醒

DreamShaper 使用 CreativeML OpenRAIL-M。个人本地使用通常没问题；
若以后做收费网站或 API，必须重新核对当时的模型卡，不能把本地可用
理解为可直接商业托管。

## 下载

仓库根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\download-dreamshaper.ps1
```

脚本支持断点续传和重复执行，保存到：

```text
vendor/ComfyUI/models/checkpoints/DreamShaper_8_pruned.safetensors
```

模型文件由 `.gitignore` 排除。下载完成后用 1660S 脚本重启 ComfyUI：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-comfyui-1660s.ps1
```

## 推荐参数

- 分辨率：`512×768`（OOM 再降到 `512×512`）
- Batch：1
- 采样器：`dpmpp_2m`
- 调度：`karras`
- Steps：28
- CFG：7
- CLIP Skip：1

不要叠多个 LoRA。高分修复 / ESRGAN **默认关闭**；要 2K/4K 文件再开，见
[`docs/18-upscale.md`](18-upscale.md)。Pony / Flux 权重不要当这台机默认。

## UI 使用

1. 启动 ComfyUI（1660S 脚本）和前端。
2. 顶部选「机器 B · 1660 Super」。
3. 在「模型方案」选择「1660S · DreamShaper 8」。
4. 页面会匹配 checkpoint，并应用 512×768 与上面的采样参数。
5. checkpoint 未安装时会提示先执行下载脚本。
6. 可选：跑 `download-upscale-model.ps1` 后，用「ESRGAN」或「高分+ESRGAN」出大图。

切到这台机时，页面会改用自然语言默认提示词，并丢掉 `score_9` 前缀。

## 提示词

正向：

```text
beautiful adult woman, looking at viewer, detailed face, natural lighting
```

负向：

```text
blurry, extra fingers, bad anatomy, deformed, child, loli, shota, underage, teen
```

更细的 NSFW 写法见 `docs/08-run-1660s.md`。
已验证露骨词见
[`prompts/1660s/dreamshaper-8/explicit.md`](prompts/1660s/dreamshaper-8/explicit.md)。

## 验证

成功标准：

1. `/object_info` 能找到 `DreamShaper_8_pruned.safetensors`。
2. UI 选择该方案后显示 CFG 7、Steps 28、CLIP Skip 1、512×768。
3. 1660S + `--lowvram` 能完成一张安全成人肖像，无 OOM。
4. 切回 2080S 档后 Pony 方案可再选。

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-dreamshaper.ps1
```

相同 prompt 加相同 seed 会命中缓存并秒回；真实重算请换 seed：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-dreamshaper.ps1 -Seed 990909101
```

本机 2080 Super 上用同一套 512×768 / 24 steps 参数校验工作流：
换 seed 重算约 **4–6 秒**，输出约 0.5MB，无 OOM。
6GB 实机必须用 `start-comfyui-1660s.ps1`（`--lowvram`），会更慢。
