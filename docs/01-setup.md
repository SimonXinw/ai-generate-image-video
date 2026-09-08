# 环境安装（不下载模型）

目标：本机有可启动的 ComfyUI，**checkpoints 目录可以是空的**。

## 前置

- Windows + NVIDIA 驱动（能运行 `nvidia-smi`）
- Git
- Python **3.10 或 3.11**（不要 3.13 当默认）
- Node.js 20+（只给前端）

确认显卡：

```powershell
nvidia-smi
```

记下显存：约 8GB → 机器 A；约 6GB → 机器 B。

## 步骤 1：克隆 ComfyUI

在仓库根目录：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-comfyui.ps1
```

成功后应存在：

- `vendor/ComfyUI/main.py`
- `vendor/ComfyUI/models/checkpoints/`
- `vendor/ComfyUI/models/loras/`

若用户已有 ComfyUI，设 `COMFYUI_ROOT` 指向该目录，不要重复克隆。

## 步骤 2：虚拟环境 + PyTorch

在 `vendor/ComfyUI`：

```powershell
cd vendor\ComfyUI
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -U pip
```

PyTorch 选带 CUDA 的轮子（两张卡都是 Turing，用 cu124 或 cu121 即可）：

```powershell
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
pip install -r requirements.txt
```

验证：

```powershell
python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"
```

应打印 `True` 和 GPU 名称。

## 步骤 3：先别下模型

到这里可以停。下一步才是 `docs/02-models.md`。

空目录时启动 ComfyUI 仍会起来，但前端 checkpoint 下拉是空的，无法出图。这是预期。

start 脚本会优先调用 `venv\Scripts\python.exe`，所以 venv 必须建在 `vendor/ComfyUI/venv`。

## 常见问题

- `python` 不是 3.10/3.11：用 `py -3.11` 建 venv。
- `torch.cuda.is_available()` 为 False：驱动过旧或装成 CPU 版 torch，重装 CUDA 轮子。
- 克隆失败：检查 GitHub 网络，或让用户手动把 ComfyUI 放到 `vendor/ComfyUI`。
