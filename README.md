# 本地无审查出图

本仓库是 **ComfyUI 本机出图 + 手机端网页**。不接在线平台，内容由本机模型决定。  
**现在不要下载模型。** 模型清单和放置路径写在 `docs/`，以后让 AI 按文档执行即可。

仓库名含 video，当前 **只做本地文生图**。视频见 `docs/07-known-gaps.md`。

## 两台机器

| 页面选项 | 硬件 | 启动脚本 | 默认分辨率 |
|----------|------|----------|------------|
| 机器 A · 2080 Super | R5 5600 · RTX 2080S **8GB** · 32G | `scripts/start-comfyui-2080s.ps1` | 768×1152 |
| 机器 B · 1660 Super | R5 9600X · GTX 1660S **6GB** · 64G | `scripts/start-comfyui-1660s.ps1` | 640×960 |

1660S 必须加 `--lowvram`。瓶颈是显存，不是 CPU/内存。

## 文档（按顺序读）

| 文件 | 用途 |
|------|------|
| [docs/00-for-ai.md](docs/00-for-ai.md) | 给后续 AI：能做什么、不能做什么、执行顺序 |
| [docs/01-setup.md](docs/01-setup.md) | 装 Python / 克隆 ComfyUI / 装依赖（仍不下载模型） |
| [docs/02-models.md](docs/02-models.md) | 模型搜什么、下到哪、按哪台机选 |
| [docs/03-run.md](docs/03-run.md) | 启动 ComfyUI + 前端出图 |
| [docs/04-hardware.md](docs/04-hardware.md) | 两台机能力、不够时买什么 |
| [docs/05-inventory.md](docs/05-inventory.md) | 每台机装了什么、双机如何共用模型 |
| [docs/06-prompts.md](docs/06-prompts.md) | Pony / SD1.5 / SDXL 提示词不要混 |
| [docs/07-known-gaps.md](docs/07-known-gaps.md) | 已修问题、未做能力、建议实现顺序 |

## 以后真正开跑时（摘要）

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-comfyui.ps1
# 按 docs/02-models.md 下载 checkpoint / LoRA 到指定目录
powershell -ExecutionPolicy Bypass -File .\scripts\start-comfyui-1660s.ps1
# 或 start-comfyui-2080s.ps1
npm install
npm run dev
```

浏览器：`http://127.0.0.1:5173`，先选对「当前机子配置」。

## 硬红线

禁止任何未成年人相关内容（提示词也会拦截）。成人向内容由本机模型生成。
