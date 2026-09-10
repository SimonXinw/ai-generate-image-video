# Pin vendor/ComfyUI to v0.35.0 (torch 2.7 + cu126).
$ErrorActionPreference = "Stop"
$Root = Join-Path $PSScriptRoot "..\vendor\ComfyUI"
if (-not (Test-Path (Join-Path $Root "main.py"))) {
  Write-Host "ComfyUI missing. Run setup-comfyui.ps1 first." -ForegroundColor Red
  exit 1
}
Push-Location $Root
try {
  git fetch --tags --depth 1 origin tag v0.35.0
  git checkout v0.35.0
} finally {
  Pop-Location
}
Write-Host "Pinned ComfyUI to v0.35.0." -ForegroundColor Green
