# 给后续 AI 的执行说明

用户可能说：「按文档把环境装好 / 把模型下好 / 跑起来」。按本文件做，不要发明另一套目录。

## 当前状态（默认）

- 前端代码已在仓库里。
- ComfyUI **可能还没克隆**（目标路径 `vendor/ComfyUI`，已 gitignore）。
- **模型尚未下载。** 未接到「下载模型 / 安装模型」前，不要下 `.safetensors`。
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
4. 仅当用户要模型：打开 `docs/02-models.md`，只下对应该 GPU 的「必下」项。
5. 做 `docs/03-run.md`。前端页面切到对应机器档。
6. 验证：`GET http://127.0.0.1:8188/object_info` 能返回；页面能列出 checkpoint。
7. 在对应机器填 `docs/05-inventory.md` 模板（不要把 NSFW 文件名推远程，除非用户要求）。

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
