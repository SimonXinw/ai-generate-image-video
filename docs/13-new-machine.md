# 换电脑：给 AI 的识别与下载清单

新会话先读本文件，再动手。不要另开目录、不要下 Flux/视频。

仓库：本地 ComfyUI 文生图 + 手机端网页。权重不进 Git，每台机自己下。
硬红线：禁止未成年人相关内容。

## 30 秒识别本机

仓库根目录执行：

```powershell
nvidia-smi
```

| nvidia-smi | 本机 | 页面档 | 启动 | 必下脚本 |
|------------|------|--------|------|----------|
| RTX 2080 Super / 约 8GB | 机器 A | `rtx2080s` | `scripts/start-comfyui-2080s.ps1` | 写实 Pony，见下 |
| GTX 1660 Super / 约 6GB | 机器 B | `gtx1660s` | `scripts/start-comfyui-1660s.ps1`（必须 `--lowvram`） | DreamShaper 8 |

认显存，不认 CPU 名。未跑 `nvidia-smi` 前不要用 832×1216 去打 6GB 卡。

## 新电脑一次性顺序

用户说「装环境 / 下模型 / 跑起来 / 换电脑继续」时，按这次做完：

1. `git clone` 或 `git pull` 本仓库，`npm install`。
2. `powershell -ExecutionPolicy Bypass -File .\scripts\setup-comfyui.ps1`
3. `powershell -ExecutionPolicy Bypass -File .\scripts\pin-comfyui-v0326.ps1`
   （钉死 ComfyUI **v0.3.26**。最新 master 可能因 `comfy_kitchen` 起不来。）
4. 按 `docs/01-setup.md` 建 `vendor/ComfyUI/venv`，Python **3.11** +
   `torch 2.6.0+cu124`（或同系列 CUDA 轮子），`pip install -r requirements.txt`。
5. 只跑本机「必下」脚本（下一节）。模型约 2GB 或 6.5GB，可用 Clash 代理
   `http://127.0.0.1:7897` 再执行脚本。
6. 启动对应 `start-comfyui-*.ps1`，另开窗口 `npm run dev`。
7. 浏览器用 `http://127.0.0.1:5173`（不要用 `localhost`，代理会白屏）。
8. 页面顶部切到当前机器。烟测脚本见对应模型文档。

## 必下（只下本机这一行）

保存位置一律：`vendor/ComfyUI/models/checkpoints/`。脚本可重复执行，已存在且校验通过会直接退出。

### 机器 B · 1660S（约 2.13GB，先下这个）

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\download-dreamshaper.ps1
```

- 文件：`DreamShaper_8_pruned.safetensors`
- 字节：`2132625894`
- SHA-256：`879db523c30d3b9017143d56705015e15a2cb5628762c11d086fed9538abd7fd`
- 详情：`docs/12-dreamshaper-1660s.md`
- **不要**在这台机默认下 Pony XL / CyberRealistic Pony / Flux。

### 机器 A · 2080S

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\download-cyberrealistic-pony.ps1
```

- 文件：`CyberRealisticPony_V18.0_F16.safetensors`
- 字节：`6938041288`
- SHA-256：`1d580c1c3f3612fa4db88af65372255582d5509ca0b28f85387273368301941b`
- 详情：`docs/10-cyberrealistic-pony.md`

二次元/通用还需要 Pony V6 XL（约 6.46GB，无独立脚本时用直链，校验体积）：

```powershell
curl.exe -L --fail --retry 8 --retry-delay 5 --continue-at - `
  -o vendor\ComfyUI\models\checkpoints\ponyDiffusionV6XL_v6StartWithThisOne.safetensors `
  "https://huggingface.co/LyliaEngine/Pony_Diffusion_V6_XL/resolve/main/ponyDiffusionV6XL_v6StartWithThisOne.safetensors"
```

期望体积：`6938041050` bytes。更小就是下残了，删掉重下。

## 下完怎么验

```powershell
dir vendor\ComfyUI\models\checkpoints
vendor\ComfyUI\venv\Scripts\python.exe -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"
```

ComfyUI 起来后：`GET http://127.0.0.1:8188/object_info` 的 checkpoint 列表里要有上表文件名。

- 1660S 烟测：`scripts\smoke-test-dreamshaper.ps1 -Seed 990909101`
- 2080S 写实烟测：`scripts\smoke-test-cyberrealistic.ps1 -Seed 990909001`

相同 prompt + 相同 seed 会命中 Comfy 缓存并秒回，换 seed 才是真算。

## 网络

Hugging Face 超时：给当前终端设 `HTTP_PROXY`/`HTTPS_PROXY` 为本地 Clash
（常见 `http://127.0.0.1:7897`），再跑下载脚本。不要把代理套到
`127.0.0.1:5173` / `8188`（前端会白屏；start 脚本已对回环走 `NO_PROXY`）。

## 不要做

- 把 `*.safetensors` 提交进 Git。
- 未确认 GPU 就按另一台机的分辨率出图。
- 1660S 上装全精度 Flux / 视频大模型当默认。
- 改 `src/lib/safety.ts` 去放行未成年词。
- `git pull` 把 `vendor/ComfyUI` 升到最新 master。
