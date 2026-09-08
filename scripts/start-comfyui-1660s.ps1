# 机器 B：R5 9600X + GTX 1660 Super 6GB + 64GB
# 6GB 必须 --lowvram，否则 SDXL/Pony 很容易 OOM

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
Write-Host "启动 ComfyUI（1660S，--lowvram）用 $Py" -ForegroundColor Cyan
Write-Host "建议分辨率 ≤640×960；优先 SD1.5。" -ForegroundColor Yellow
& $Py main.py --listen 127.0.0.1 --port 8188 --lowvram --enable-cors-header --preview-method auto
