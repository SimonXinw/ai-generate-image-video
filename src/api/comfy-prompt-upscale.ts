import type { GenerateParams } from "../types";
import { needsHires, needsUpscaleModel } from "../upscale-presets";

type Node = {
  class_type: string;
  inputs: Record<string, unknown>;
};

type Ref = [string, number];

/**
 * 在首段 KSampler（节点 7）之后接高分修复 / ESRGAN。
 * 只保留一个 SaveImage（节点 9），避免 waitForImage 拿到中间图。
 */
export function attachUpscale(
  graph: Record<string, Node>,
  params: GenerateParams,
  seed: number,
  model: Ref,
  vae: Ref,
  positive: Ref,
  negative: Ref,
): void {
  const mode = params.upscaleMode;
  if (mode === "off") {
    graph["8"] = {
      class_type: "VAEDecode",
      inputs: { samples: ["7", 0], vae },
    };
    graph["9"] = {
      class_type: "SaveImage",
      inputs: { filename_prefix: "local_gen", images: ["8", 0] },
    };
    return;
  }

  let latent: Ref = ["7", 0];

  if (needsHires(mode)) {
    const scale = Math.min(2, Math.max(1.25, params.upscaleScale || 1.5));
    graph["13"] = {
      class_type: "LatentUpscaleBy",
      inputs: {
        samples: latent,
        upscale_method: "bislerp",
        scale_by: scale,
      },
    };
    graph["14"] = {
      class_type: "KSampler",
      inputs: {
        seed: seed + 1,
        steps: Math.max(8, Math.min(24, params.hiresSteps || 12)),
        cfg: params.cfg,
        sampler_name: params.sampler || "euler_ancestral",
        scheduler: params.scheduler || "normal",
        denoise: Math.min(0.65, Math.max(0.25, params.hiresDenoise || 0.4)),
        model,
        positive,
        negative,
        latent_image: ["13", 0],
      },
    };
    latent = ["14", 0];
  }

  // 放大路径用 tiled decode，6GB 更稳
  graph["8"] = {
    class_type: "VAEDecodeTiled",
    inputs: {
      samples: latent,
      vae,
      tile_size: 320,
      overlap: 64,
      temporal_size: 64,
      temporal_overlap: 8,
    },
  };

  let images: Ref = ["8", 0];

  if (needsUpscaleModel(mode)) {
    const name = params.upscaleModel.trim();
    if (!name) {
      throw new Error("已选 ESRGAN，但没有可用的放大模型，请先运行 download-upscale-model.ps1");
    }
    graph["16"] = {
      class_type: "UpscaleModelLoader",
      inputs: { model_name: name },
    };
    graph["17"] = {
      class_type: "ImageUpscaleWithModel",
      inputs: { upscale_model: ["16", 0], image: images },
    };
    images = ["17", 0];
  }

  graph["9"] = {
    class_type: "SaveImage",
    inputs: { filename_prefix: "local_gen", images },
  };
}
