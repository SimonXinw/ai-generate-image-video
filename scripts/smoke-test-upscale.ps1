param(
  [ValidateSet("hires", "esrgan", "hires_esrgan")]
  [string]$Mode = "hires",
  [string]$Checkpoint = "DreamShaper_8_pruned.safetensors",
  [string]$UpscaleModel = "RealESRGAN_x4plus.pth",
  [long]$Seed = 20260909
)

$ErrorActionPreference = "Stop"
$Comfy = "http://127.0.0.1:8188"
$env:NO_PROXY = "127.0.0.1,localhost"

$Prompt = [ordered]@{
  "1" = @{
    class_type = "CheckpointLoaderSimple"
    inputs = @{ ckpt_name = $Checkpoint }
  }
  "2" = @{
    class_type = "CLIPSetLastLayer"
    inputs = @{ clip = @("1", 1); stop_at_clip_layer = -1 }
  }
  "3" = @{
    class_type = "CLIPTextEncode"
    inputs = @{
      clip = @("2", 0)
      text = "beautiful adult woman, looking at viewer, detailed face, natural lighting, photograph"
    }
  }
  "4" = @{
    class_type = "CLIPTextEncode"
    inputs = @{
      clip = @("2", 0)
      text = "blurry, extra fingers, bad anatomy, deformed, child, loli, shota, underage, teen"
    }
  }
  "5" = @{
    class_type = "EmptyLatentImage"
    inputs = @{ width = 512; height = 768; batch_size = 1 }
  }
  "6" = @{
    class_type = "KSampler"
    inputs = @{
      seed = $Seed
      steps = 20
      cfg = 7
      sampler_name = "dpmpp_2m"
      scheduler = "karras"
      denoise = 1
      model = @("1", 0)
      positive = @("3", 0)
      negative = @("4", 0)
      latent_image = @("5", 0)
    }
  }
}

$Latent = @("6", 0)
if ($Mode -eq "hires" -or $Mode -eq "hires_esrgan") {
  $Prompt["13"] = @{
    class_type = "LatentUpscaleBy"
    inputs = @{ samples = $Latent; upscale_method = "bislerp"; scale_by = 1.5 }
  }
  $Prompt["14"] = @{
    class_type = "KSampler"
    inputs = @{
      seed = ($Seed + 1)
      steps = 12
      cfg = 7
      sampler_name = "dpmpp_2m"
      scheduler = "karras"
      denoise = 0.4
      model = @("1", 0)
      positive = @("3", 0)
      negative = @("4", 0)
      latent_image = @("13", 0)
    }
  }
  $Latent = @("14", 0)
}

$Prompt["8"] = @{
  class_type = "VAEDecodeTiled"
  inputs = @{
    samples = $Latent
    vae = @("1", 2)
    tile_size = 320
    overlap = 64
    temporal_size = 64
    temporal_overlap = 8
  }
}

$Images = @("8", 0)
if ($Mode -eq "esrgan" -or $Mode -eq "hires_esrgan") {
  $Prompt["16"] = @{
    class_type = "UpscaleModelLoader"
    inputs = @{ model_name = $UpscaleModel }
  }
  $Prompt["17"] = @{
    class_type = "ImageUpscaleWithModel"
    inputs = @{ upscale_model = @("16", 0); image = $Images }
  }
  $Images = @("17", 0)
}

$Prompt["9"] = @{
  class_type = "SaveImage"
  inputs = @{ filename_prefix = "upscale_$Mode"; images = $Images }
}

$Body = @{ prompt = $Prompt; client_id = "upscale-smoke-$([guid]::NewGuid())" } |
  ConvertTo-Json -Depth 20 -Compress
$Queued = Invoke-RestMethod -Method Post -Uri "$Comfy/prompt" `
  -ContentType "application/json" -Body $Body
$PromptId = $Queued.prompt_id
if (-not $PromptId) { throw "ComfyUI did not return prompt_id" }

Write-Host "Queued upscale smoke ($Mode): $PromptId" -ForegroundColor Cyan
$Started = Get-Date
while (((Get-Date) - $Started).TotalMinutes -lt 20) {
  Start-Sleep -Seconds 3
  $History = Invoke-RestMethod -Uri "$Comfy/history/$PromptId"
  $Entry = $History.$PromptId
  if ($Entry.status.status_str -eq "error") {
    $Entry.status.messages | ConvertTo-Json -Depth 6 | Write-Host
    throw "ComfyUI upscale smoke failed ($Mode)"
  }
  if ($Entry.outputs) {
    $Image = $Entry.outputs."9".images[0]
    Write-Host "Upscale smoke complete ($Mode)." -ForegroundColor Green
    Write-Host "Image: $($Image.filename)"
    Write-Host "Elapsed: $([math]::Round(((Get-Date) - $Started).TotalSeconds, 1))s"
    exit 0
  }
}

throw "Upscale smoke timed out after 20 minutes ($Mode)"
