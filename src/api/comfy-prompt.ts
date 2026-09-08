import type { GenerateParams } from "../types";
import { randomSeed } from "../lib/safety";

type Node = {
  class_type: string;
  inputs: Record<string, unknown>;
};

export function buildTxt2ImgPrompt(params: GenerateParams): Record<string, Node> {
  const seed = params.seed < 0 ? randomSeed() : params.seed;
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
      sampler_name: "euler_ancestral",
      scheduler: "normal",
      denoise: 1,
      model,
      positive: ["4", 0],
      negative: ["5", 0],
      latent_image: ["6", 0],
    },
  };
  graph["8"] = {
    class_type: "VAEDecode",
    inputs: { samples: ["7", 0], vae },
  };
  graph["9"] = {
    class_type: "SaveImage",
    inputs: { filename_prefix: "local_gen", images: ["8", 0] },
  };
  return graph;
}
