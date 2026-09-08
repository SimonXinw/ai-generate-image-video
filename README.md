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
| [docs/00-for-ai.md](docs/00-for-ai.md) | 给后续 AI：能做什么、不能做什么、执行顺序 |
| [docs/01-setup.md](docs/01-setup.md) | 装 Python / 克隆 ComfyUI / 装依赖（仍不下载模型） |
| [docs/02-models.md](docs/02-models.md) | 模型搜什么、下到哪、按哪台机选 |
| [docs/03-run.md](docs/03-run.md) | 启动 ComfyUI + 前端出图 |
| [docs/04-hardware.md](docs/04-hardware.md) | 两台机能力、不够时买什么 |
| [docs/05-inventory.md](docs/05-inventory.md) | 每台机装了什么、双机如何共用模型 |
| [docs/06-prompts.md](docs/06-prompts.md) | Pony / SD1.5 / SDXL 提示词不要混；含已验证写实向配方 |
| [docs/07-known-gaps.md](docs/07-known-gaps.md) | 已修问题、未做能力、建议实现顺序 |
| [docs/08-run-1660s.md](docs/08-run-1660s.md) | **1660S 开跑手册（照着启动）** |
| [docs/09-prompt-keywords.md](docs/09-prompt-keywords.md) | 提示词存档 v1–v8 |
| [docs/10-cyberrealistic-pony.md](docs/10-cyberrealistic-pony.md) | **2080S 成人写实模型安装与参数** |
| [docs/11-prompt-keywords-v9-v11.md](docs/11-prompt-keywords-v9-v11.md) | 提示词存档 v9–v11 与草稿 |
| [docs/12-dreamshaper-1660s.md](docs/12-dreamshaper-1660s.md) | **1660S DreamShaper 8 安装与参数** |

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

## 模型方案

- DreamShaper 8：SD1.5，机器 B（1660S 6GB）主推。
- Pony V6：二次元/通用，使用现有 `score_9` 提示词；机器 A。
- CyberRealistic Pony v18：成人写实，仍兼容 Pony 标签；机器 A 推荐。

提示词不再堆进 README，统一存档到 `docs/09-*` 和 `docs/11-*`。

## 硬红线

禁止任何未成年人相关内容（提示词也会拦截）。成人向内容由本机模型生成。
