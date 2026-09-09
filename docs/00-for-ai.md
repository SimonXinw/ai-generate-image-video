# 给后续 AI 的执行说明

**换电脑 / 新会话：先读 [`docs/13-new-machine.md`](13-new-machine.md)。**
里面有 GPU 对照、必下脚本、哈希、钉死版本和烟测命令。

用户可能说：「按文档把环境装好 / 把模型下好 / 跑起来 / 换电脑继续」。
按 13 号文档做，不要发明另一套目录。

## 当前状态（2026-09-09）

- 前端在仓库里；ComfyUI 在 `vendor/ComfyUI`（gitignore），版本钉 **v0.3.26**。
- 两台物理机：机器 A RTX 2080 Super **8GB**；机器 B GTX 1660 Super **6GB**。
- 已授权本机必下：
  - 2080S：`download-cyberrealistic-pony.ps1`（写实）+ Pony V6 XL 直链
  - 1660S：`download-dreamshaper.ps1`（SD1.5）
- 参考脸锁定（可选，用户点名再装）：`scripts/setup-face-lock.ps1`，说明见 `docs/16-face-lock.md`。
- 其他模型未点名不要下。权重绝不进 Git。

先 `nvidia-smi` 认卡。不问就按 13 号文档两套命令都写好，但**只执行当前 GPU 那一套**。

## 允许做

1. `scripts/setup-comfyui.ps1` + `scripts/pin-comfyui-v0326.ps1`。
2. 按 `docs/01-setup.md` 建 venv、装 PyTorch cu124 + ComfyUI 依赖。
3. 用户要下载或换机跑通时：只跑 13 号文档里该 GPU 的脚本。
4. 按 `docs/03-run.md` 启动对应 `start-comfyui-*.ps1` 和 `npm run dev`。
5. 修前端以对接 `http://127.0.0.1:8188`。

## 禁止做

- 自动下载未成年人相关模型或 LoRA。
- 改安全拦截（`src/lib/safety.ts`）去放行未成年内容。
- 把模型提交进 git。
- 在 1660S 上装全精度 Flux / 视频大模型当默认。
- 未确认 GPU 就用 2080S 分辨率去打 1660S。
- 把 `vendor/ComfyUI` 升到最新 master。

## 执行顺序（用户说「按文档处理」）

1. 读本文件和 `docs/13-new-machine.md`。
2. `nvidia-smi`：8G → 2080S；6G → 1660S。
3. `docs/01-setup.md` 直到 `vendor/ComfyUI/main.py` 存在，并 pin 到 v0.3.26。
   已验证：ComfyUI **v0.3.26** + Python 3.11 + torch 2.6.0+cu124。
4. 下载：`docs/13-new-machine.md` 必下表；细节见
   `docs/10-cyberrealistic-pony.md` / `docs/12-dreamshaper-1660s.md`。
5. 启动：`docs/03-run.md`；1660S 也可直接 `docs/08-run-1660s.md`。
6. 验证：`GET http://127.0.0.1:8188/object_info` 能列出 checkpoint。
7. 本机记录用 `docs/05-inventory.md` 模板（`docs/STATUS-*.md` 已 gitignore）。

## 路径约定（不要改）

```
vendor/ComfyUI/
vendor/ComfyUI/models/checkpoints/
vendor/ComfyUI/models/loras/
scripts/setup-comfyui.ps1
scripts/pin-comfyui-v0326.ps1
scripts/download-dreamshaper.ps1
scripts/download-cyberrealistic-pony.ps1
scripts/start-comfyui-2080s.ps1
scripts/start-comfyui-1660s.ps1
```

可选：`COMFYUI_ROOT`。前端：`VITE_COMFY_URL` 默认 `http://127.0.0.1:8188`。

## 规范

- 每个源文件不超过 199 行。
- `.tsx` 只导出 function component；类型放 `.ts`。
- UI 默认按手机端。
- 回复用户用简体中文。
- 提示词按 [`docs/prompts/README.md`](prompts/README.md)：
  `机型/模型/类型.md`。不要往 `09` / `11` / `15` / `17` 追加。
