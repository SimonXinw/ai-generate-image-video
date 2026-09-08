# Machine A: R5 5600 + RTX 2080 Super 8GB + 32GB
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
Write-Host "Starting ComfyUI (2080S, no --lowvram) with $Py" -ForegroundColor Cyan
& $Py main.py --listen 127.0.0.1 --port 8188 --enable-cors-header --preview-method auto
