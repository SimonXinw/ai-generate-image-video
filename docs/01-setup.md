# 环境安装（不下载模型）

目标：本机有可启动的 ComfyUI **v0.35.0**，**checkpoints 目录可以是空的**。

## 前置

- Windows + NVIDIA 驱动（能运行 `nvidia-smi`）
- Git
- Python **3.11**（不要 3.13 当默认）
- Node.js 20+（只给前端）

确认显卡：

```powershell
nvidia-smi
```

记下显存：约 8GB → 机器 A；约 6GB → 机器 B。换机完整命令见
[`docs/13-new-machine.md`](13-new-machine.md)。

## 步骤 1：克隆并装依赖

在仓库根目录：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-comfyui.ps1
```

脚本会：钉 **v0.35.0**、建 Python 3.11 venv、装 **torch 2.7.1+cu126** 和 Comfy 依赖。

成功后应存在：

- `vendor/ComfyUI/main.py`
- `vendor/ComfyUI/venv\Scripts\python.exe`
- `vendor/ComfyUI/models/checkpoints/`
- `vendor/ComfyUI/models/loras/`

若用户已有 ComfyUI，设 `COMFYUI_ROOT` 指向该目录，不要重复克隆。  
版本细节见 [`docs/21-comfyui.md`](21-comfyui.md)。

## 步骤 2：验证 CUDA

```powershell
vendor\ComfyUI\venv\Scripts\python.exe -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"
```

应打印 `True` 和 GPU 名称。

## 步骤 3：先别下模型

到这里可以停。下一步才是 `docs/02-models.md`。

空目录时启动 ComfyUI 仍会起来，但前端 checkpoint 下拉是空的，无法出图。这是预期。

start 脚本调用 `vendor/ComfyUI/venv\Scripts\python.exe`。

## 常见问题

- `python` 不是 3.11：用 `py -3.11` 建 venv（setup 脚本已这样写）。
- `torch.cuda.is_available()` 为 False：驱动过旧或装成 CPU 版 torch，重跑 setup。
- 克隆失败：检查 GitHub 网络，或让用户手动把 ComfyUI 放到 `vendor/ComfyUI`。
- 日志提示 cu130：Turing 卡用 cu126 + eager 即可，不要为这条去升 CUDA。
