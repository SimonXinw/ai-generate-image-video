param(
  [Parameter(Mandatory = $true)]
  [string]$ReferenceImage,
  [ValidateSet("1660s", "2080s")]
  [string]$Hardware = "1660s",
  [string]$Checkpoint = "",
  [long]$Seed = 20260909
)

$ErrorActionPreference = "Stop"
$ComfyRoot = Join-Path $PSScriptRoot "..\vendor\ComfyUI"
$ComfyUrl = "http://127.0.0.1:8188"
$env:NO_PROXY = "127.0.0.1,localhost"
if (-not (Test-Path $ReferenceImage)) { throw "Reference image not found." }

$Is1660 = $Hardware -eq "1660s"
if (-not $Checkpoint) {
  $Checkpoint = if ($Is1660) {
    "DreamShaper_8_pruned.safetensors"
  } else {
    "CyberRealisticPony_V18.0_F16.safetensors"
  }
}
$Preset = if ($Is1660) { "FACEID" } else { "FACEID PLUS V2" }
$Width = if ($Is1660) { 512 } else { 768 }
$Height = if ($Is1660) { 768 } else { 1024 }
$FaceWeight = if ($Is1660) { 0.75 } else { 0.8 }

$Ext = [IO.Path]::GetExtension($ReferenceImage)
$InputName = "face_smoke_$([guid]::NewGuid().ToString('N'))$Ext"
Copy-Item $ReferenceImage (Join-Path $ComfyRoot "input\$InputName")

$Prompt = @{
  "1" = @{
    class_type = "CheckpointLoaderSimple"
    inputs = @{ ckpt_name = $Checkpoint }
  }
  "2" = @{
    class_type = "IPAdapterUnifiedLoaderFaceID"
    inputs = @{
      model = @("1", 0)
      preset = $Preset
      lora_strength = 0.6
      provider = "CPU"
    }
  }
  "3" = @{
    class_type = "LoadImage"
    inputs = @{ image = $InputName }
  }
  "4" = @{
    class_type = "IPAdapterFaceID"
    inputs = @{
      model = @("2", 0)
      ipadapter = @("2", 1)
      image = @("3", 0)
      weight = $FaceWeight
      weight_faceidv2 = 1.0
      weight_type = "linear"
      combine_embeds = "concat"
      start_at = 0.0
      end_at = 0.9
      embeds_scaling = "V only"
    }
  }
  "5" = @{
    class_type = "CLIPSetLastLayer"
    inputs = @{ clip = @("1", 1); stop_at_clip_layer = -2 }
  }
  "6" = @{
    class_type = "CLIPTextEncode"
    inputs = @{
      clip = @("5", 0)
      text = "portrait of the same adult woman, detailed face, natural light"
    }
  }
  "7" = @{
    class_type = "CLIPTextEncode"
    inputs = @{
      clip = @("5", 0)
      text = "child, teen, underage, blurry, deformed, bad anatomy"
    }
  }
  "8" = @{
    class_type = "EmptyLatentImage"
    inputs = @{ width = $Width; height = $Height; batch_size = 1 }
  }
  "9" = @{
    class_type = "KSampler"
    inputs = @{
      seed = $Seed
      steps = 24
      cfg = 6
      sampler_name = "euler_ancestral"
      scheduler = "normal"
      denoise = 1
      model = @("4", 0)
      positive = @("6", 0)
      negative = @("7", 0)
      latent_image = @("8", 0)
    }
  }
  "10" = @{
    class_type = "VAEDecode"
    inputs = @{ samples = @("9", 0); vae = @("1", 2) }
  }
  "11" = @{
    class_type = "SaveImage"
    inputs = @{ filename_prefix = "face_lock_smoke"; images = @("10", 0) }
  }
}

$Body = @{ prompt = $Prompt; client_id = "face-smoke-$([guid]::NewGuid())" } |
  ConvertTo-Json -Depth 20 -Compress
$Queued = Invoke-RestMethod -Method Post -Uri "$ComfyUrl/prompt" `
  -ContentType "application/json" -Body $Body
if (-not $Queued.prompt_id) { throw "ComfyUI did not return prompt_id." }
Write-Host "Queued FaceID smoke test: $($Queued.prompt_id)" -ForegroundColor Cyan

$Started = Get-Date
while (((Get-Date) - $Started).TotalMinutes -lt 15) {
  Start-Sleep -Seconds 2
  $History = Invoke-RestMethod -Uri "$ComfyUrl/history/$($Queued.prompt_id)"
  $Entry = $History.($Queued.prompt_id)
  if ($Entry.status.status_str -eq "error") {
    $Messages = $Entry.status.messages | ConvertTo-Json -Depth 10 -Compress
    throw "FaceID smoke test failed: $Messages"
  }
  if ($Entry.outputs) {
    $Image = $Entry.outputs."11".images[0]
    Write-Host "FaceID smoke test complete: $($Image.filename)" -ForegroundColor Green
    Write-Host "Elapsed: $([math]::Round(((Get-Date) - $Started).TotalSeconds, 1))s"
    exit 0
  }
}
throw "FaceID smoke test timed out after 15 minutes."
