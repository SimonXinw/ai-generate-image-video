# 模型下载清单（先读，后下）

换电脑时的 GPU 对照、脚本和哈希以
[`docs/13-new-machine.md`](13-new-machine.md) 为准。本文件是补充清单。

用户说「下载模型 / 安装检查点 / 换电脑跑起来」时，**只下当前 GPU 的必下脚本**，
不要把两台机的 XL 权重都下到 6GB 卡上。不要下 exe。

## 放到哪

| 文件类型 | 目录 |
|----------|------|
| 大模型 checkpoint | `vendor/ComfyUI/models/checkpoints/` |
| LoRA | `vendor/ComfyUI/models/loras/` |
| 独立 VAE（仅当说明需要） | `vendor/ComfyUI/models/vae/` |
| FaceID / IP-Adapter | `vendor/ComfyUI/models/ipadapter/` |
| CLIP Vision（FaceID 共用） | `vendor/ComfyUI/models/clip_vision/` |
| InsightFace buffalo_l | `vendor/ComfyUI/models/insightface/models/buffalo_l/` |

文件名可保留原名。前端从 ComfyUI `/object_info` 列出，不必改代码。

## 官方下载脚本（优先用）

| 机器 | 脚本 | 文件名 |
|------|------|--------|
| B 1660S | `scripts/download-dreamshaper.ps1` | `DreamShaper_8_pruned.safetensors` |
| A 2080S 写实 | `scripts/download-cyberrealistic-pony.ps1` | `CyberRealisticPony_V18.0_F16.safetensors` |
| A 2080S 二次元 | 13 号文档里的 Pony V6 `curl` 直链 | `ponyDiffusionV6XL_v6StartWithThisOne.safetensors` |

脚本可重复跑。Hugging Face 超时先给终端加 Clash 代理再跑，见 13 号文档。

## 按机器选（只下对应档的「必下」）

### 机器 A · 2080 Super 8GB（必下）

1. `Pony Diffusion V6 XL` — 二次元/通用 Pony checkpoint（已验证）
2. `CyberRealistic Pony v18 CoreShift FP16` — 成人写实主推（约 6.46 GiB）
3. 可选：Pony 角色或风格 LoRA，各几十到几百 MB

不要作为默认去下：全精度 Flux、CHROMA 全量、视频大模型。

CyberRealistic Pony 安装、许可证、参数和烟测见
[`docs/10-cyberrealistic-pony.md`](10-cyberrealistic-pony.md)。
两款都兼容 `score_9, score_8_up, score_7_up`，但写实款推荐
832×1216、CLIP Skip 2、30 steps、CFG 5、DPM++ 2M Karras。

### 机器 B · 1660 Super 6GB（必下）

优先单文件 SD1.5（约 2GB），**不要先下 Pony**。

已验证可直链（Hugging Face，无需登录）：

1. **DreamShaper 8 pruned**（主推，NSFW 友好）  
   安装、校验与 UI 方案见 [`docs/12-dreamshaper-1660s.md`](12-dreamshaper-1660s.md)。  
   脚本：`scripts/download-dreamshaper.ps1`
2. 可选写实：`Realistic_Vision_V5.1_fp16-no-ema.safetensors`  
   来自 `SG161222/Realistic_Vision_V5.1_noVAE`

Civitai 搜 `nsfw sd1.5` / `undress` 可再找更「去衣」的 merge（要账号）。

出图默认：512×768；OOM 再降。Pony/Flux 见「可选」。

不要下：Flux、CHROMA、视频权重。

## 可选（两台都暂缓）

| 搜索词 | 说明 | 建议显存 |
|--------|------|----------|
| `Juggernaut XL` / `RealVis XL` | 通用写实 SDXL；需重写为自然语言提示词 | 8GB 可试，6GB 不优先 |
| `aidmaNSFWunlock` / `Flux NSFW LoRA` | 给 Flux 解锁 | 需先有 Flux，12GB+ 再考虑 |
| `CHROMA` / `Fluxed Up` / `Lustify` | 写实无审查 Flux 系 | 12GB+ |
| `Z-Image Turbo NSFW` | 若社区仍提供 | 看体积，6GB 不优先 |

## 下载方式（给 AI）

1. 打开 Civitai，用上面搜索词。
2. 选 **safetensors**，版本选下载量高、说明匹配 SD1.5 或 Pony/SDXL 的。
3. 保存到对应文件夹。不要用「下载到仓库根目录再忘记移动」。
4. 下完后重启 ComfyUI，前端刷新才能看到新名字。
5. 若站点要登录：告诉用户去浏览器登录后手动下载，AI 不要硬撞验证码。

无法稳定提供永久直链的 Civitai 文件，用搜索词 + 目录。
已列入 `scripts/download-*.ps1` 的 Hugging Face 文件以脚本校验为准。

## 体积参考

- SD1.5 checkpoint：约 2GB
- Pony / SDXL：约 6–7GB
- 单个 LoRA：通常 <800MB

磁盘预留：机器 B 至少 10GB；机器 A 至少 20GB（含 Pony + 若干 LoRA）。
