# 机器 A：R5 5600 + RTX 2080 Super 8GB + 32GB
# 用法：在已 clone 的 ComfyUI 目录旁，或设置 $env:COMFYUI_ROOT

$ErrorActionPreference = "Stop"
$Root = if ($env:COMFYUI_ROOT) { $env:COMFYUI_ROOT } else {
  Join-Path $PSScriptRoot "..\vendor\ComfyUI"
}

if (-not (Test-Path (Join-Path $Root "main.py"))) {
  Write-Host "未找到 ComfyUI。请先运行 scripts\setup-comfyui.ps1" -ForegroundColor Red
  exit 1
}

Set-Location $Root
$Py = Join-Path $Root "venv\Scripts\python.exe"
if (-not (Test-Path $Py)) { $Py = "python" }
Write-Host "启动 ComfyUI（2080S，无 --lowvram）用 $Py" -ForegroundColor Cyan
& $Py main.py --listen 127.0.0.1 --port 8188 --enable-cors-header --preview-method auto
