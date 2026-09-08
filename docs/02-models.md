# 模型下载清单（先读，后下）

**默认不下。** 只有用户明确说「下载模型 / 安装检查点」时才执行。

来源以 [Civitai](https://civitai.com) 为主。Civitai 页面会变，**用搜索词找当前最热的同名/同系列文件**，下 `.safetensors`，不要下 exe。

## 放到哪

| 文件类型 | 目录 |
|----------|------|
| 大模型 checkpoint | `vendor/ComfyUI/models/checkpoints/` |
| LoRA | `vendor/ComfyUI/models/loras/` |
| 独立 VAE（仅当说明需要） | `vendor/ComfyUI/models/vae/` |

文件名可保留原名。前端会从 ComfyUI `/object_info` 列出，不必改代码。

## 按机器选（只下对应档的「必下」）

### 机器 A · 2080 Super 8GB（必下）

Civitai 搜索：

1. `Pony Diffusion V6 XL` — 主 checkpoint（约 6–7GB）
2. 可选：`pony nsfw lora` 或角色 LoRA，各几十到几百 MB

不要作为默认去下：全精度 Flux、CHROMA 全量、视频大模型。

出图默认：768×1152，clip skip 2，步数 22。Pony 提示词可带 `score_9, score_8_up, score_7_up`。

### 机器 B · 1660 Super 6GB（必下）

优先单文件 SD1.5（约 2GB），**不要先下 Pony**。

已验证可直链（Hugging Face，无需登录）：

1. **DreamShaper 8 pruned**（主推，NSFW 友好）  
   `https://huggingface.co/Lykon/DreamShaper/resolve/main/DreamShaper_8_pruned.safetensors`  
   保存为：`vendor/ComfyUI/models/checkpoints/DreamShaper_8_pruned.safetensors`
2. 可选写实：`Realistic_Vision_V5.1_fp16-no-ema.safetensors`  
   来自 `SG161222/Realistic_Vision_V5.1_noVAE`

Civitai 搜 `nsfw sd1.5` / `undress` 可再找更「去衣」的 merge（要账号）。

出图默认：512×768；OOM 再降。Pony/Flux 见「可选」。

不要下：Flux、CHROMA、视频权重。

## 可选（两台都暂缓）

| 搜索词 | 说明 | 建议显存 |
|--------|------|----------|
| `Juggernaut XL` / `RealVis XL` | 写实 SDXL | 8GB 可试，6GB 不优先 |
| `aidmaNSFWunlock` / `Flux NSFW LoRA` | 给 Flux 解锁 | 需先有 Flux，12GB+ 再考虑 |
| `CHROMA` / `Fluxed Up` / `Lustify` | 写实无审查 Flux 系 | 12GB+ |
| `Z-Image Turbo NSFW` | 若社区仍提供 | 看体积，6GB 不优先 |

## 下载方式（给 AI）

1. 打开 Civitai，用上面搜索词。
2. 选 **safetensors**，版本选下载量高、说明匹配 SD1.5 或 Pony/SDXL 的。
3. 保存到对应文件夹。不要用「下载到仓库根目录再忘记移动」。
4. 下完后重启 ComfyUI，前端刷新才能看到新名字。
5. 若站点要登录：告诉用户去浏览器登录后手动下载，AI 不要硬撞验证码。

无法稳定提供永久直链（会失效）。以搜索词 + 目录为准。

## 体积参考

- SD1.5 checkpoint：约 2GB
- Pony / SDXL：约 6–7GB
- 单个 LoRA：通常 <800MB

磁盘预留：机器 B 至少 10GB；机器 A 至少 20GB（含 Pony + 若干 LoRA）。
