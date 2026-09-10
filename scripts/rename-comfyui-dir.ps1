# If vendor/ComfyUI is a junction to ComfyUI-next, drop it and rename the folder.
# Close Comfy/Python first. Access-denied means Explorer/Cursor still has the old folder open.
$ErrorActionPreference = "Stop"
$Vendor = Join-Path $PSScriptRoot "..\vendor"
$Next = Join-Path $Vendor "ComfyUI-next"
$Name = Join-Path $Vendor "ComfyUI"

$item = Get-Item $Name -Force -ErrorAction SilentlyContinue
if ($item -and $item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
  Write-Host "Removing junction $Name" -ForegroundColor Cyan
  cmd /c "rmdir `"$Name`""
}
if (Test-Path $Next) {
  Rename-Item -Path $Next -NewName "ComfyUI"
  Write-Host "Renamed ComfyUI-next -> ComfyUI" -ForegroundColor Green
} elseif (Test-Path $Name) {
  Write-Host "vendor\ComfyUI already exists." -ForegroundColor Green
} else {
  throw "Neither vendor\ComfyUI nor vendor\ComfyUI-next exists."
}
