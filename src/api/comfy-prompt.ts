import type { FaceLockWorkflow, GenerateParams } from "../types";
import { randomSeed } from "../lib/safety";
import { attachUpscale } from "./comfy-prompt-upscale";

type Node = {
  class_type: string;
  inputs: Record<string, unknown>;
};

export function resolveSeed(params: GenerateParams): number {
  return params.seed < 0 ? randomSeed() : params.seed;
}

export function buildTxt2ImgPrompt(
  params: GenerateParams,
  seed: number,
  faceLock?: FaceLockWorkflow,
): Record<string, Node> {
  const useLora = params.lora.trim().length > 0;
  const graph: Record<string, Node> = {
    "1": {
      class_type: "CheckpointLoaderSimple",
      inputs: { ckpt_name: params.checkpoint },
    },
  };

  let model: [string, number] = ["1", 0];
  let clip: [string, number] = ["1", 1];
  const vae: [string, number] = ["1", 2];

  if (useLora) {
    graph["2"] = {
      class_type: "LoraLoader",
      inputs: {
        model,
        clip,
        lora_name: params.lora,
        strength_model: params.loraStrength,
        strength_clip: params.loraStrength,
      },
    };
    model = ["2", 0];
    clip = ["2", 1];
  }

  if (faceLock) {
    graph["10"] = {
      class_type: "IPAdapterUnifiedLoaderFaceID",
      inputs: {
        model,
        preset: faceLock.preset,
        lora_strength: 0.6,
        provider: "CPU",
      },
    };
    graph["11"] = {
      class_type: "LoadImage",
      inputs: { image: faceLock.imageName },
    };
    graph["12"] = {
      class_type: "IPAdapterFaceID",
      inputs: {
        model: ["10", 0],
        ipadapter: ["10", 1],
        image: ["11", 0],
        weight: faceLock.weight,
        weight_faceidv2: 1,
        weight_type: "linear",
        combine_embeds: "concat",
        start_at: 0,
        end_at: faceLock.endAt,
        embeds_scaling: "V only",
      },
    };
    model = ["12", 0];
  }

  graph["3"] = {
    class_type: "CLIPSetLastLayer",
    inputs: { clip, stop_at_clip_layer: -Math.abs(params.clipSkip || 2) },
  };
  clip = ["3", 0];

  graph["4"] = {
    class_type: "CLIPTextEncode",
    inputs: { clip, text: params.prompt },
  };
  graph["5"] = {
    class_type: "CLIPTextEncode",
    inputs: { clip, text: params.negativePrompt },
  };
  graph["6"] = {
    class_type: "EmptyLatentImage",
    inputs: { width: params.width, height: params.height, batch_size: 1 },
  };
  graph["7"] = {
    class_type: "KSampler",
    inputs: {
      seed,
      steps: params.steps,
      cfg: params.cfg,
      sampler_name: params.sampler || "euler_ancestral",
      scheduler: params.scheduler || "normal",
      denoise: 1,
      model,
      positive: ["4", 0],
      negative: ["5", 0],
      latent_image: ["6", 0],
    },
  };

  attachUpscale(graph, params, seed, model, vae, ["4", 0], ["5", 0]);
  return graph;
}
