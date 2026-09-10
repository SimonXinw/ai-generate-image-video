# ComfyUI v0.35.0

本仓库只用一套运行时：`vendor/ComfyUI`，tag **v0.35.0**，端口 **8188**。  
前端构图仍是 `CheckpointLoaderSimple` + `KSampler`（放大 / 锁脸节点图不改）。

需要 **Python 3.11** + **torch 2.7.1+cu126** + `comfy_kitchen`。不要把这个目录 `git pull` 到最新 master。

## 安装

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-comfyui.ps1
```

权重放在 `vendor/ComfyUI/models/`（不进 Git）。不要再写指向旧目录的 `extra_model_paths.yaml`。

本机若磁盘上仍能看到 `vendor/ComfyUI-next`，是因为文件夹被占用无法立刻改名；`vendor/ComfyUI` 已是指向它的联接。关尽 Python/资源管理器后可跑：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\rename-comfyui-dir.ps1
```

## 启动

```powershell
# RTX 2080 Super
powershell -ExecutionPolicy Bypass -File .\scripts\start-comfyui-2080s.ps1
# GTX 1660 Super
# powershell -ExecutionPolicy Bypass -File .\scripts\start-comfyui-1660s.ps1

powershell -ExecutionPolicy Bypass -File .\scripts\start-frontend.ps1
```

- 画布 / API：`http://127.0.0.1:8188`
- 页面：`http://127.0.0.1:5173`

## object_info

0.35 部分下拉是 `COMBO.options`。前端用 `src/api/comfy-combo.ts` 读，构图不变。

启动日志可能提示「需要 cu130」。2080S 用 cu126 + eager，SDXL 文生图可用。

## 锁脸

IP-Adapter 装到 **这一套** `vendor/ComfyUI/custom_nodes`：`scripts/setup-face-lock.ps1`。
