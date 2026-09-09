param(
  [ValidateSet("all", "1660s", "2080s")]
  [string]$Hardware = "all"
)

$ErrorActionPreference = "Stop"
$Comfy = Join-Path $PSScriptRoot "..\vendor\ComfyUI"
$Python = Join-Path $Comfy "venv\Scripts\python.exe"
$NodeDir = Join-Path $Comfy "custom_nodes\ComfyUI_IPAdapter_plus"
$NodeCommit = "a0f451a5113cf9becb0847b92884cb10cbdec0ef"

if (-not (Test-Path (Join-Path $Comfy "main.py"))) {
  throw "ComfyUI not found. Run scripts\setup-comfyui.ps1 first."
}
if (-not (Test-Path $Python)) {
  throw "ComfyUI venv not found. Complete docs\01-setup.md first."
}

if (-not (Test-Path (Join-Path $NodeDir ".git"))) {
  git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus.git $NodeDir
}
git -C $NodeDir fetch origin
git -C $NodeDir checkout $NodeCommit

$Wheel = Join-Path $env:TEMP "insightface-0.7.3-cp311-cp311-win_amd64.whl"
if (-not (Test-Path $Wheel)) {
  curl.exe -L --fail --retry 5 -o $Wheel `
    "https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp311-cp311-win_amd64.whl"
  if ($LASTEXITCODE -ne 0) { throw "InsightFace wheel download failed." }
}
& $Python -m pip install $Wheel "onnxruntime==1.20.1"
if ($LASTEXITCODE -ne 0) { throw "InsightFace dependency install failed." }

$InsightInit = Join-Path $Comfy "venv\Lib\site-packages\insightface\app\__init__.py"
if (Test-Path $InsightInit) {
  Set-Content -Path $InsightInit -Encoding ascii -Value "from .face_analysis import *`n"
}

function Install-Model {
  param(
    [string]$Url,
    [string]$Target,
    [long]$Bytes,
    [string]$Sha256
  )
  New-Item -ItemType Directory -Force (Split-Path $Target) | Out-Null
  $Valid = (Test-Path $Target) -and (Get-Item $Target).Length -eq $Bytes
  if ($Valid) {
    $Valid = (Get-FileHash $Target -Algorithm SHA256).Hash.ToLowerInvariant() -eq $Sha256
  }
  if ($Valid) {
    Write-Host "Valid: $(Split-Path $Target -Leaf)" -ForegroundColor Green
    return
  }
  curl.exe -L --fail --retry 8 --retry-delay 5 --continue-at - `
    --output $Target $Url
  if ($LASTEXITCODE -ne 0) { throw "Download failed: $Target" }
  if ((Get-Item $Target).Length -ne $Bytes) { throw "Size mismatch: $Target" }
  $Hash = (Get-FileHash $Target -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($Hash -ne $Sha256) { throw "SHA256 mismatch: $Target" }
}

$Models = Join-Path $Comfy "models"
Install-Model `
  "https://huggingface.co/h94/IP-Adapter/resolve/main/models/image_encoder/model.safetensors" `
  (Join-Path $Models "clip_vision\CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors") `
  2528373448 "6ca9667da1ca9e0b0f75e46bb030f7e011f44f86cbfb8d5a36590fcd7507b030"

if ($Hardware -in @("all", "1660s")) {
  Install-Model `
    "https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid_sd15.bin" `
    (Join-Path $Models "ipadapter\ip-adapter-faceid_sd15.bin") `
    96740574 "201344e22e6f55849cf07ca7a6e53d8c3b001327c66cb9710d69fd5da48a8da7"
  Install-Model `
    "https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid_sd15_lora.safetensors" `
    (Join-Path $Models "loras\ip-adapter-faceid_sd15_lora.safetensors") `
    51059544 "70699f0dbfadd47de1f81d263cf4c86bd4b7271d841304af9b340b3a7f38e86a"
}

if ($Hardware -in @("all", "2080s")) {
  Install-Model `
    "https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plusv2_sdxl.bin" `
    (Join-Path $Models "ipadapter\ip-adapter-faceid-plusv2_sdxl.bin") `
    1487555181 "c6945d82b543700cc3ccbb98d363b837e9c596281607857c74b713a876daf5fb"
  Install-Model `
    "https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plusv2_sdxl_lora.safetensors" `
    (Join-Path $Models "loras\ip-adapter-faceid-plusv2_sdxl_lora.safetensors") `
    371842896 "f24b4bb2dad6638a09c00f151cde84991baf374409385bcbab53c1871a30cb7b"
}

$BuffaloDir = Join-Path $Models "insightface\models\buffalo_l"
$BuffaloZip = Join-Path $env:TEMP "buffalo_l.zip"
New-Item -ItemType Directory -Force $BuffaloDir | Out-Null
$Onnx = @(Get-ChildItem $BuffaloDir -Filter *.onnx -ErrorAction SilentlyContinue)
if ($Onnx.Count -lt 5) {
  curl.exe -L --fail --retry 8 --retry-delay 5 -o $BuffaloZip `
    "https://github.com/deepinsight/insightface/releases/download/v0.7/buffalo_l.zip"
  if ($LASTEXITCODE -ne 0) { throw "buffalo_l download failed." }
  Expand-Archive -Force -Path $BuffaloZip -DestinationPath $BuffaloDir
}
& $Python -c "from insightface.app import FaceAnalysis; print('FaceAnalysis import ok')"
if ($LASTEXITCODE -ne 0) { throw "InsightFace import still failing." }
Write-Host "Face lock setup complete. Restart ComfyUI." -ForegroundColor Green
