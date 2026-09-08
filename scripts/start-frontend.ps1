# Start frontend; bypass system proxy for local Vite
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
$env:NO_PROXY = "127.0.0.1,localhost"
$env:no_proxy = "127.0.0.1,localhost"
Write-Host "Open http://127.0.0.1:5173/  (not localhost if proxy breaks it)" -ForegroundColor Cyan
npm run dev
