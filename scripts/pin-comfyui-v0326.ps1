# Pin ComfyUI to a Torch-2.6-compatible tag (run inside vendor/ComfyUI if needed)
$ErrorActionPreference = "Stop"
$Root = Join-Path $PSScriptRoot "..\vendor\ComfyUI"
if (-not (Test-Path (Join-Path $Root "main.py"))) {
  Write-Host "ComfyUI missing. Run setup-comfyui.ps1 first." -ForegroundColor Red
  exit 1
}
Push-Location $Root
try {
  git fetch --tags
  git checkout v0.3.26
} finally {
  Pop-Location
}
Write-Host "Pinned ComfyUI to v0.3.26. Start with scripts\start-comfyui-1660s.ps1" -ForegroundColor Green
