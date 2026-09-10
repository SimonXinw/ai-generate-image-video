# Machine A: R5 5600 + RTX 2080 Super 8GB + 32GB. ComfyUI v0.35.0, port 8188.
$ErrorActionPreference = "Stop"
$Root = if ($env:COMFYUI_ROOT) { $env:COMFYUI_ROOT } else {
  Join-Path $PSScriptRoot "..\vendor\ComfyUI"
}
$Py = Join-Path $Root "venv\Scripts\python.exe"

if (-not (Test-Path (Join-Path $Root "main.py"))) {
  throw "ComfyUI not found. Run scripts\setup-comfyui.ps1 first."
}
if (-not (Test-Path $Py)) {
  throw "ComfyUI venv missing. Run scripts\setup-comfyui.ps1 first."
}

$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"
Set-Location $Root

Write-Host "Starting ComfyUI (2080S) on 127.0.0.1:8188" -ForegroundColor Cyan
& $Py main.py --listen 127.0.0.1 --port 8188 --enable-cors-header --preview-method auto
