# Machine B: R5 9600X + GTX 1660 Super 6GB. ComfyUI v0.35.0, port 8188.
$ErrorActionPreference = "Stop"
$Root = if ($env:COMFYUI_ROOT) { $env:COMFYUI_ROOT } else {
  Join-Path $PSScriptRoot "..\vendor\ComfyUI"
}
$Py = Join-Path $Root "venv\Scripts\python.exe"

if (-not (Test-Path (Join-Path $Root "main.py"))) {
  Write-Host "ComfyUI not found. Run scripts\setup-comfyui.ps1 first." -ForegroundColor Red
  exit 1
}
if (-not (Test-Path $Py)) { throw "venv missing. Run setup-comfyui.ps1" }

$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"
Set-Location $Root

Write-Host "Starting ComfyUI (1660S, --lowvram) on 127.0.0.1:8188" -ForegroundColor Cyan
Write-Host "Tip: use 512x768; DreamShaper SD1.5 preferred." -ForegroundColor Yellow
& $Py main.py --listen 127.0.0.1 --port 8188 --lowvram --enable-cors-header --preview-method auto
