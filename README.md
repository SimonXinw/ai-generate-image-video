# 本地无审查出图

本仓库是 **ComfyUI 本机出图 + 手机端网页**。不接在线平台，内容由本机模型决定。  
模型权重只存在本机并由 Git 忽略；安装清单和校验信息写在 `docs/`。

仓库名含 video，当前 **只做本地文生图**。视频见 `docs/07-known-gaps.md`。

## 两台机器

| 页面选项 | 硬件 | 启动脚本 | 默认分辨率 |
|----------|------|----------|------------|
| 机器 A · 2080 Super | R5 5600 · RTX 2080S **8GB** · 32G | `scripts/start-comfyui-2080s.ps1` | 768×1152 |
| 机器 B · 1660 Super | R5 9600X · GTX 1660S **6GB** · 64G | `scripts/start-comfyui-1660s.ps1` | 512×768 |

1660S 必须加 `--lowvram`。瓶颈是显存，不是 CPU/内存。

## 文档（按顺序读）

| 文件 | 用途 |
|------|------|
| [docs/00-for-ai.md](docs/00-for-ai.md) | 给后续 AI：能做什么、不能做什么 |
| [docs/13-new-machine.md](docs/13-new-machine.md) | **换电脑：识别 GPU、下载脚本、哈希、烟测** |
| [docs/01-setup.md](docs/01-setup.md) | 装 Python / 克隆 ComfyUI / 装依赖（仍不下载模型） |
| [docs/02-models.md](docs/02-models.md) | 模型搜什么、下到哪、按哪台机选 |
| [docs/03-run.md](docs/03-run.md) | 启动 ComfyUI + 前端出图 |
| [docs/04-hardware.md](docs/04-hardware.md) | 两台机能力、不够时买什么 |
| [docs/05-inventory.md](docs/05-inventory.md) | 每台机装了什么、双机如何共用模型 |
| [docs/06-prompts.md](docs/06-prompts.md) | Pony / SD1.5 / SDXL 提示词不要混；含类型对照 |
| [docs/prompts/README.md](docs/prompts/README.md) | **提示词存档规范（机型 / 模型 / 类型）** |
| [docs/07-known-gaps.md](docs/07-known-gaps.md) | 已修问题、未做能力、建议实现顺序 |
| [docs/08-run-1660s.md](docs/08-run-1660s.md) | **1660S 开跑手册（照着启动）** |
| [docs/09-prompt-keywords.md](docs/09-prompt-keywords.md) | 历史：Pony v1–v8（只读） |
| [docs/10-cyberrealistic-pony.md](docs/10-cyberrealistic-pony.md) | **2080S 成人写实模型安装与参数** |
| [docs/11-prompt-keywords-v9-v11.md](docs/11-prompt-keywords-v9-v11.md) | 历史：Pony v9–v11（只读） |
| [docs/12-dreamshaper-1660s.md](docs/12-dreamshaper-1660s.md) | **1660S DreamShaper 8 安装与参数** |
| [docs/14-cyber-vs-pony-prompts.md](docs/14-cyber-vs-pony-prompts.md) | **Cyber / Pony / DreamShaper 提示词差异与迁移** |
| [docs/15-cyber-prompt-keywords.md](docs/15-cyber-prompt-keywords.md) | 已迁到 `docs/prompts/2080s/cyberrealistic-pony/` |
| [docs/16-face-lock.md](docs/16-face-lock.md) | **1660S / 2080S 参考脸锁定安装与烟测** |
| [docs/17-dreamshaper-prompt-keywords.md](docs/17-dreamshaper-prompt-keywords.md) | 已迁到 `docs/prompts/1660s/dreamshaper-8/` |
| [docs/18-upscale.md](docs/18-upscale.md) | **高分修复 / ESRGAN 分块放大（2K·4K 文件）** |

## 以后真正开跑时（摘要）

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-comfyui.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\pin-comfyui-v0326.ps1
# 再按 docs/01-setup.md 建 venv 并装 torch（脚本不会自动装）
# 按 docs/13-new-machine.md 只下当前 GPU 的 checkpoint
# 可选：安装两台机器的参考脸锁定权重与节点
powershell -ExecutionPolicy Bypass -File .\scripts\setup-face-lock.ps1 -Hardware all
# 可选：高分 / ESRGAN 放大权重（约 64MB）
powershell -ExecutionPolicy Bypass -File .\scripts\download-upscale-model.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\start-comfyui-1660s.ps1
# 或 start-comfyui-2080s.ps1
npm install
npm run dev
```

浏览器：`http://127.0.0.1:5173`，先选对「当前机子配置」。要 2K/4K 文件见 [`docs/18-upscale.md`](docs/18-upscale.md)。

## 模型方案

- DreamShaper 8：SD1.5，机器 B（1660S 6GB）主推。
- Pony V6：二次元/通用，使用现有 `score_9` 提示词；机器 A。
- CyberRealistic Pony v18：成人写实，仍兼容 Pony 标签；机器 A 推荐。

提示词不再堆进 README，统一按机型 / 模型 / 类型存到 `docs/prompts/`。

## 硬红线

禁止任何未成年人相关内容（提示词也会拦截）。成人向内容由本机模型生成。
