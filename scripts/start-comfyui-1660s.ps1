# Machine B: R5 9600X + GTX 1660 Super 6GB + 64GB
# 6GB needs --lowvram
$ErrorActionPreference = "Stop"
$Root = if ($env:COMFYUI_ROOT) { $env:COMFYUI_ROOT } else {
  Join-Path $PSScriptRoot "..\vendor\ComfyUI"
}

if (-not (Test-Path (Join-Path $Root "main.py"))) {
  Write-Host "ComfyUI not found. Run scripts\setup-comfyui.ps1 first." -ForegroundColor Red
  exit 1
}

Set-Location $Root
$Py = Join-Path $Root "venv\Scripts\python.exe"
if (-not (Test-Path $Py)) { $Py = "python" }
Write-Host "Starting ComfyUI (1660S, --lowvram) with $Py" -ForegroundColor Cyan
Write-Host "Tip: use 512x768; DreamShaper SD1.5 preferred." -ForegroundColor Yellow
& $Py main.py --listen 127.0.0.1 --port 8188 --lowvram --enable-cors-header --preview-method auto
