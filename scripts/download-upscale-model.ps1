$ErrorActionPreference = "Stop"

$Root = Join-Path $PSScriptRoot "..\vendor\ComfyUI"
$TargetDir = Join-Path $Root "models\upscale_models"
$FileName = "RealESRGAN_x4plus.pth"
$Target = Join-Path $TargetDir $FileName
# Official Real-ESRGAN v0.1.0 release
$Url = "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth"
$ExpectedBytes = 67040989

if (-not (Test-Path (Join-Path $Root "main.py"))) {
  throw "ComfyUI not found at: $Root"
}

New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null

if ((Test-Path $Target) -and (Get-Item $Target).Length -eq $ExpectedBytes) {
  Write-Host "Upscale model already exists." -ForegroundColor Green
  Write-Host "Path: $Target"
  exit 0
}

Write-Host "Downloading RealESRGAN_x4plus (~64MB)..." -ForegroundColor Cyan
Write-Host "Target: $Target"

& curl.exe -L --fail --retry 8 --retry-delay 5 --continue-at - `
  --output $Target $Url
if ($LASTEXITCODE -ne 0) {
  throw "Download failed with curl exit code $LASTEXITCODE"
}

$Size = (Get-Item $Target).Length
if ($Size -ne $ExpectedBytes) {
  throw "Size mismatch: expected $ExpectedBytes, got $Size bytes"
}

Write-Host "Download complete." -ForegroundColor Green
Write-Host "Size: $Size bytes"
Write-Host "Restart ComfyUI, then pick ESRGAN / 高分+ESRGAN in the UI."
