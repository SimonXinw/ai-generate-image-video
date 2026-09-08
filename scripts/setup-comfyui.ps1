# Clone ComfyUI into vendor/ComfyUI (ASCII-only messages for Windows PowerShell)
$ErrorActionPreference = "Stop"
$Vendor = Join-Path $PSScriptRoot "..\vendor"
$Root = Join-Path $Vendor "ComfyUI"

New-Item -ItemType Directory -Force -Path $Vendor | Out-Null

if (-not (Test-Path (Join-Path $Root "main.py"))) {
  Write-Host "Cloning ComfyUI..." -ForegroundColor Cyan
  git clone https://github.com/comfyanonymous/ComfyUI.git $Root
} else {
  Write-Host "ComfyUI already exists: $Root" -ForegroundColor Green
}

$Models = Join-Path $Root "models"
$Ckpt = Join-Path $Models "checkpoints"
$Lora = Join-Path $Models "loras"
New-Item -ItemType Directory -Force -Path $Ckpt, $Lora | Out-Null

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. cd vendor\ComfyUI"
Write-Host "2. py -3.11 -m venv venv && Activate, then pip install torch+cu124 and -r requirements.txt"
Write-Host "3. Put checkpoints in: $Ckpt"
Write-Host "   - 2080S 8GB: Pony Diffusion V6 XL"
Write-Host "   - 1660S 6GB: scripts\download-dreamshaper.ps1"
Write-Host "4. Put LoRAs in: $Lora"
Write-Host "5. Start: scripts\start-comfyui-1660s.ps1 or start-comfyui-2080s.ps1"
Write-Host "6. Other terminal: npm install && npm run dev"
Write-Host "7. See docs\08-run-1660s.md"
