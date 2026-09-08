# 给后续 AI 的执行说明

用户可能说：「按文档把环境装好 / 把模型下好 / 跑起来」。按本文件做，不要发明另一套目录。

## 当前状态（默认）

- 前端代码已在仓库里。
- ComfyUI 目标路径 `vendor/ComfyUI`（已 gitignore），当前机器 A 已安装并固定兼容版本。
- 已授权安装 CyberRealistic Pony v18；1660S 主推 DreamShaper 8。
  其他模型未接到明确指令前仍不要下载。
- 两台物理机：2080S 8G、1660S 6G。先问用户现在坐的是哪一台；不问就按 `docs/04-hardware.md` 两套都写好命令。

## 允许做

1. 跑 `scripts/setup-comfyui.ps1`（克隆 ComfyUI、建 `models` 目录）。
2. 按 `docs/01-setup.md` 建 venv、装 PyTorch + ComfyUI 依赖。
3. 用户明确要求下载时，按 `docs/02-models.md` 的搜索词和目标路径下载。
4. 按 `docs/03-run.md` 启动对应 `start-comfyui-*.ps1` 和 `npm run dev`。
5. 修脚本/前端以对接 ComfyUI API（`http://127.0.0.1:8188`）。

## 禁止做

- 自动下载未成年人相关模型或 LoRA。
- 改安全拦截（`src/lib/safety.ts` / `BLOCKED_TERMS`）去放行未成年内容。
- 把模型提交进 git。
- 在 1660S 上装全精度 Flux / 视频大模型当默认。
- 未确认 GPU 就用 2080S 的分辨率默认值去打 1660S。

## 执行顺序（用户说「按文档处理」时）

1. 读 `README.md` 和本文件。
2. 确认本机 GPU（`nvidia-smi`）：8G → 2080S 脚本；6G → 1660S 脚本。
3. 做 `docs/01-setup.md`，直到 `vendor/ComfyUI/main.py` 存在且 venv 能 `python main.py --help`。
   - **1660S 已验证组合**：ComfyUI **v0.3.26** + Python 3.11 + torch 2.6.0+cu124。最新 master 可能因 `comfy_kitchen` 起不来，见 `docs/08-run-1660s.md`。
4. 仅当用户要模型：打开 `docs/02-models.md`；机器 A 写实款见
   `docs/10-cyberrealistic-pony.md`；机器 B 见 `docs/12-dreamshaper-1660s.md`。
5. 做 `docs/03-run.md` 或直接 `docs/08-run-1660s.md`。前端页面切到对应机器档。
6. 验证：`GET http://127.0.0.1:8188/object_info` 能返回；页面能列出 checkpoint。
7. 在对应机器填 `docs/05-inventory.md` 模板。模型权重绝不进 Git；模型文件名可按用户要求写入安装文档。

## 路径约定（不要改）

```
vendor/ComfyUI/                 # ComfyUI 本体
vendor/ComfyUI/models/checkpoints/
vendor/ComfyUI/models/loras/
vendor/ComfyUI/models/vae/      # 若模型需要独立 VAE 再放
scripts/setup-comfyui.ps1
scripts/start-comfyui-2080s.ps1
scripts/start-comfyui-1660s.ps1
```

环境变量可选：`COMFYUI_ROOT` 指向已有的 ComfyUI 安装。前端：`VITE_COMFY_URL` 默认 `http://127.0.0.1:8188`。

## 规范

- 每个源文件不超过 199 行。
- `.tsx` 只导出 function component；类型放 `.ts`。
- UI 默认按手机端。
- 回复用户用简体中文。
