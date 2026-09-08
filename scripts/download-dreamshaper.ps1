$ErrorActionPreference = "Stop"

$Root = Join-Path $PSScriptRoot "..\vendor\ComfyUI"
$TargetDir = Join-Path $Root "models\checkpoints"
$FileName = "DreamShaper_8_pruned.safetensors"
$Target = Join-Path $TargetDir $FileName
$Url = "https://huggingface.co/Lykon/DreamShaper/resolve/main/${FileName}?download=true"
$ExpectedBytes = 2132625894
$ExpectedHash = "879db523c30d3b9017143d56705015e15a2cb5628762c11d086fed9538abd7fd"
$Python = Join-Path $Root "venv\Scripts\python.exe"

if (-not (Test-Path (Join-Path $Root "main.py"))) {
  throw "ComfyUI not found at: $Root"
}

New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null

if ((Test-Path $Target) -and (Get-Item $Target).Length -eq $ExpectedBytes) {
  $Hash = (Get-FileHash -Algorithm SHA256 $Target).Hash.ToLowerInvariant()
  if ($Hash -eq $ExpectedHash) {
    Write-Host "Model already exists and checksum is valid." -ForegroundColor Green
    Write-Host "Path: $Target"
    exit 0
  }
  throw "Existing model checksum mismatch: $Hash"
}

Write-Host "Downloading DreamShaper 8 pruned (SD1.5, ~2.13GB)..." -ForegroundColor Cyan
Write-Host "Target: $Target"

$HasHub = $false
if (Test-Path $Python) {
  & $Python -c "import huggingface_hub" 2>$null
  $HasHub = $LASTEXITCODE -eq 0
}

if ($HasHub) {
  Write-Host "Using Hugging Face Xet transfer..."
  $Code = "from huggingface_hub import hf_hub_download; import sys; " +
    "print(hf_hub_download('Lykon/DreamShaper', " +
    "'DreamShaper_8_pruned.safetensors', local_dir=sys.argv[1]))"
  & $Python -c $Code $TargetDir
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Hugging Face download failed; falling back to curl." -ForegroundColor Yellow
    $HasHub = $false
  }
}

if (-not $HasHub) {
  Write-Host "Using curl; existing partial file will be resumed."
  & curl.exe -L --fail --retry 8 --retry-delay 5 --continue-at - `
    --output $Target $Url
  if ($LASTEXITCODE -ne 0) {
    throw "Download failed with curl exit code $LASTEXITCODE"
  }
}

$Size = (Get-Item $Target).Length
if ($Size -ne $ExpectedBytes) {
  throw "Size mismatch: expected $ExpectedBytes, got $Size bytes"
}

$Hash = (Get-FileHash -Algorithm SHA256 $Target).Hash.ToLowerInvariant()
if ($Hash -ne $ExpectedHash) {
  throw "SHA256 mismatch: expected $ExpectedHash, got $Hash"
}
Write-Host "Download complete." -ForegroundColor Green
Write-Host "Size: $Size bytes"
Write-Host "SHA256: $Hash"
