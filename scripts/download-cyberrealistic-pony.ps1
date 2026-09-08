$ErrorActionPreference = "Stop"

$Root = Join-Path $PSScriptRoot "..\vendor\ComfyUI"
$TargetDir = Join-Path $Root "models\checkpoints"
$FileName = "CyberRealisticPony_V18.0_F16.safetensors"
$Target = Join-Path $TargetDir $FileName
$Url = "https://huggingface.co/cyberdelia/CyberRealisticPony/resolve/main/${FileName}?download=true"
$ExpectedBytes = 6938041288
$ExpectedHash = "1d580c1c3f3612fa4db88af65372255582d5509ca0b28f85387273368301941b"
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

Write-Host "Downloading CyberRealistic Pony v18 FP16..." -ForegroundColor Cyan
Write-Host "Target: $Target"

$HasHub = $false
if (Test-Path $Python) {
  & $Python -c "import huggingface_hub" 2>$null
  $HasHub = $LASTEXITCODE -eq 0
}

if ($HasHub) {
  Write-Host "Using Hugging Face Xet transfer..."
  $Code = "from huggingface_hub import hf_hub_download; import sys; " +
    "print(hf_hub_download('cyberdelia/CyberRealisticPony', " +
    "'CyberRealisticPony_V18.0_F16.safetensors', local_dir=sys.argv[1]))"
  & $Python -c $Code $TargetDir
  if ($LASTEXITCODE -ne 0) {
    throw "Hugging Face download failed with exit code $LASTEXITCODE"
  }
} else {
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
