param(
  [string]$Checkpoint = "DreamShaper_8_pruned.safetensors",
  [long]$Seed = 20260909
)

$ErrorActionPreference = "Stop"

$Comfy = "http://127.0.0.1:8188"
$env:NO_PROXY = "127.0.0.1,localhost"

$Prompt = @{
  "1" = @{
    class_type = "CheckpointLoaderSimple"
    inputs = @{ ckpt_name = $Checkpoint }
  }
  "2" = @{
    class_type = "CLIPSetLastLayer"
    inputs = @{ clip = @("1", 1); stop_at_clip_layer = -2 }
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
      steps = 24
      cfg = 6
      sampler_name = "euler_ancestral"
      scheduler = "normal"
      denoise = 1
      model = @("1", 0)
      positive = @("3", 0)
      negative = @("4", 0)
      latent_image = @("5", 0)
    }
  }
  "7" = @{
    class_type = "VAEDecode"
    inputs = @{ samples = @("6", 0); vae = @("1", 2) }
  }
  "8" = @{
    class_type = "SaveImage"
    inputs = @{ filename_prefix = "dreamshaper_smoke"; images = @("7", 0) }
  }
}

$Body = @{ prompt = $Prompt; client_id = "smoke-$([guid]::NewGuid())" } |
  ConvertTo-Json -Depth 20 -Compress
$Queued = Invoke-RestMethod -Method Post -Uri "$Comfy/prompt" `
  -ContentType "application/json" -Body $Body
$PromptId = $Queued.prompt_id
if (-not $PromptId) {
  throw "ComfyUI did not return prompt_id"
}

Write-Host "Queued smoke test: $PromptId" -ForegroundColor Cyan
$Started = Get-Date
while (((Get-Date) - $Started).TotalMinutes -lt 15) {
  Start-Sleep -Seconds 2
  $History = Invoke-RestMethod -Uri "$Comfy/history/$PromptId"
  $Entry = $History.$PromptId
  if ($Entry.status.status_str -eq "error") {
    throw "ComfyUI smoke test failed"
  }
  if ($Entry.outputs) {
    $Image = $Entry.outputs."8".images[0]
    Write-Host "Smoke test complete." -ForegroundColor Green
    Write-Host "Seed: $Seed"
    Write-Host "Image: $($Image.filename)"
    Write-Host "Elapsed: $([math]::Round(((Get-Date) - $Started).TotalSeconds, 1))s"
    exit 0
  }
}

throw "Smoke test timed out after 15 minutes"
