# 一次性：克隆 ComfyUI 到 vendor/ComfyUI 并提示装依赖
$ErrorActionPreference = "Stop"
$Vendor = Join-Path $PSScriptRoot "..\vendor"
$Root = Join-Path $Vendor "ComfyUI"

New-Item -ItemType Directory -Force -Path $Vendor | Out-Null

if (-not (Test-Path (Join-Path $Root "main.py"))) {
  Write-Host "克隆 ComfyUI..." -ForegroundColor Cyan
  git clone https://github.com/comfyanonymous/ComfyUI.git $Root
} else {
  Write-Host "ComfyUI 已存在：$Root" -ForegroundColor Green
}

$Models = Join-Path $Root "models"
$Ckpt = Join-Path $Models "checkpoints"
$Lora = Join-Path $Models "loras"
New-Item -ItemType Directory -Force -Path $Ckpt, $Lora | Out-Null

Write-Host ""
Write-Host "接下来请手动：" -ForegroundColor Yellow
Write-Host "1. cd $Root"
Write-Host "2. 建议用 Python 3.10/3.11 建 venv，再 pip install -r requirements.txt"
Write-Host "3. 从 Civitai 下载模型到：$Ckpt"
Write-Host "   - 2080S(8G)：Pony Diffusion V6 XL"
Write-Host "   - 1660S(6G)：优先 SD1.5 NSFW；Pony 也能试但用 640 分辨率"
Write-Host "4. LoRA 放到：$Lora"
Write-Host "5. 本机对应脚本启动："
Write-Host "   scripts\start-comfyui-2080s.ps1   或"
Write-Host "   scripts\start-comfyui-1660s.ps1"
Write-Host "6. 另一终端：npm install && npm run dev"
