# Clone and pin ComfyUI v0.35.0 into vendor/ComfyUI (port 8188).
$ErrorActionPreference = "Stop"
$Vendor = Join-Path $PSScriptRoot "..\vendor"
$Root = Join-Path $Vendor "ComfyUI"
$Tag = "v0.35.0"

New-Item -ItemType Directory -Force -Path $Vendor | Out-Null

if (-not (Test-Path (Join-Path $Root "main.py"))) {
  Write-Host "Cloning ComfyUI $Tag -> vendor\ComfyUI ..." -ForegroundColor Cyan
  git clone --depth 1 --branch $Tag https://github.com/comfyanonymous/ComfyUI.git $Root
} else {
  Write-Host "ComfyUI already present." -ForegroundColor Green
  $Head = git -C $Root describe --tags --always
  if ($Head -ne $Tag) {
    git -C $Root fetch --tags --depth 1 origin tag $Tag
    git -C $Root checkout $Tag
  } else {
    Write-Host "Already on $Tag" -ForegroundColor Green
  }
}

$Yaml = Join-Path $Root "extra_model_paths.yaml"
if (Test-Path $Yaml) {
  Remove-Item $Yaml -Force
  Write-Host "Removed extra_model_paths.yaml (models live in this install)." -ForegroundColor Yellow
}

$Ckpt = Join-Path $Root "models\checkpoints"
$Lora = Join-Path $Root "models\loras"
New-Item -ItemType Directory -Force -Path $Ckpt, $Lora | Out-Null

$Py = Join-Path $Root "venv\Scripts\python.exe"
if (-not (Test-Path $Py)) {
  Write-Host "Creating Python 3.11 venv ..." -ForegroundColor Cyan
  Push-Location $Root
  try { py -3.11 -m venv venv } finally { Pop-Location }
}

$NeedPip = $true
if (Test-Path $Py) {
  & $Py -c "import torch, comfy_kitchen; v=torch.__version__; assert v.startswith('2.7'); print('ok', v)"
  if ($LASTEXITCODE -eq 0) { $NeedPip = $false }
}

if ($NeedPip) {
  Write-Host "Installing torch 2.7.1+cu126 + Comfy requirements ..." -ForegroundColor Cyan
  & $Py -m pip install -U pip
  & $Py -m pip install "torch==2.7.1" "torchvision==0.22.1" "torchaudio==2.7.1" --index-url https://download.pytorch.org/whl/cu126
  if ($LASTEXITCODE -ne 0) { throw "torch install failed" }
  & $Py -m pip install -r (Join-Path $Root "requirements.txt")
  if ($LASTEXITCODE -ne 0) { throw "Comfy requirements failed" }
}

& $Py -c "import torch; import comfy_kitchen; print('torch', torch.__version__, 'cuda', torch.cuda.is_available(), torch.cuda.get_device_name(0) if torch.cuda.is_available() else None)"
if ($LASTEXITCODE -ne 0) { throw "Import check failed (need torch>=2.7 + cu126)" }

Write-Host "ComfyUI v0.35.0 ready. Port 8188." -ForegroundColor Green
Write-Host "2080S: scripts\start-comfyui-2080s.ps1" -ForegroundColor Cyan
Write-Host "1660S: scripts\start-comfyui-1660s.ps1" -ForegroundColor Cyan
Write-Host "Put checkpoints in: $Ckpt" -ForegroundColor Cyan
