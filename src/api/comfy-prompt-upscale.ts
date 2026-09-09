import type { GenerateParams } from "../types";
import { hiresTarget, needsHires, needsUpscaleModel } from "../upscale-presets";

type Node = {
  class_type: string;
  inputs: Record<string, unknown>;
};

type Ref = [string, number];

type Ctx = {
  graph: Record<string, Node>;
  params: GenerateParams;
  vae: Ref;
  lowVram: boolean;
};

/**
 * 分块解码会混合相邻块，画面发软还可能留下接缝，所以只在 6GB 放大路径上用；
 * 底图那次解码尺寸和小图一样，一律走完整解码。
 */
function decode(ctx: Ctx, id: string, samples: Ref, tiled: boolean): Ref {
  ctx.graph[id] = tiled
    ? {
        class_type: "VAEDecodeTiled",
        inputs: {
          samples,
          vae: ctx.vae,
          tile_size: 320,
          overlap: 64,
          temporal_size: 64,
          temporal_overlap: 8,
        },
      }
    : { class_type: "VAEDecode", inputs: { samples, vae: ctx.vae } };
  return [id, 0];
}

/** ESRGAN 权重只加载一次，高分内部和最后一段共用同一个节点 */
function upscaleModel(ctx: Ctx): Ref | null {
  const name = ctx.params.upscaleModel.trim();
  if (!name) return null;
  if (!ctx.graph["16"]) {
    ctx.graph["16"] = {
      class_type: "UpscaleModelLoader",
      inputs: { model_name: name },
    };
  }
  return ["16", 0];
}

/**
 * 高分修复走像素空间：解码 → 放大真实像素 → 重新编码 → 低 denoise 二次采样。
 * 早先的做法是 LatentUpscaleBy(bislerp) 直接插值 latent，等于编造 VAE 从没产出过
 * 的中间潜变量，解码后必然发虚，一条边缘被摊到两个 latent 格子里就成了重影。
 */
function attachHires(
  ctx: Ctx,
  seed: number,
  model: Ref,
  positive: Ref,
  negative: Ref,
): Ref {
  const { params, graph } = ctx;
  const target = hiresTarget(params.width, params.height, params.upscaleScale);
  const base = decode(ctx, "13", ["7", 0], false);

  // 有 ESRGAN 就先用模型重建边缘再缩到目标尺寸，比纯插值锐得多
  const esrgan = upscaleModel(ctx);
  let pixels: Ref = base;
  if (esrgan) {
    graph["21"] = {
      class_type: "ImageUpscaleWithModel",
      inputs: { upscale_model: esrgan, image: base },
    };
    pixels = ["21", 0];
  }
  graph["22"] = {
    class_type: "ImageScale",
    inputs: {
      image: pixels,
      upscale_method: "lanczos",
      width: target.width,
      height: target.height,
      crop: "disabled",
    },
  };
  graph["19"] = {
    class_type: "VAEEncode",
    inputs: { pixels: ["22", 0], vae: ctx.vae },
  };
  graph["14"] = {
    class_type: "KSampler",
    inputs: {
      // 与底图同种子：换种子会让第二段重画的边缘和原边缘错开，低 denoise 下两条都留着
      seed,
      steps: Math.max(8, Math.min(24, params.hiresSteps || 12)),
      cfg: params.cfg,
      sampler_name: params.sampler || "dpmpp_2m",
      scheduler: params.scheduler || "karras",
      denoise: Math.min(0.65, Math.max(0.25, params.hiresDenoise || 0.4)),
      model,
      positive,
      negative,
      latent_image: ["19", 0],
    },
  };
  return ["14", 0];
}

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
  lowVram = false,
): void {
  const ctx: Ctx = { graph, params, vae, lowVram };
  const mode = params.upscaleMode;
  const save = (images: Ref) => {
    graph["9"] = {
      class_type: "SaveImage",
      inputs: { filename_prefix: "local_gen", images },
    };
  };

  if (mode === "off") {
    save(decode(ctx, "8", ["7", 0], false));
    return;
  }

  const hires = needsHires(mode);
  const latent = hires
    ? attachHires(ctx, seed, model, positive, negative)
    : (["7", 0] as Ref);
  let images = decode(ctx, "8", latent, lowVram && hires);

  if (needsUpscaleModel(mode)) {
    const esrgan = upscaleModel(ctx);
    if (!esrgan) {
      throw new Error("已选 ESRGAN，但没有可用的放大模型，请先运行 download-upscale-model.ps1");
    }
    graph["17"] = {
      class_type: "ImageUpscaleWithModel",
      inputs: { upscale_model: esrgan, image: images },
    };
    images = ["17", 0];
  }

  save(images);
}
