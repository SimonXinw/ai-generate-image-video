# 高分修复 / 分块放大（2K·4K 文件）

在**现有显卡**上拿到约 2K/4K 文件：先按底模原生尺寸出图，再二段处理。  
**不要**把底图宽高直接填成 2K/4K（容易双头或 OOM）。

## 四种模式（前端「放大 / 高分修复」）

| 模式 | 做什么 | 1660S · 512×768 约等于 | 说明 |
|------|--------|------------------------|------|
| 关闭 | 只出底图 | 512×768 | 默认，最稳最快 |
| 高分 1.5× | `LatentUpscaleBy` + 第二段低 denoise 采样 + `VAEDecodeTiled` | **768×1152** | 不需额外权重 |
| ESRGAN | 解码后 `ImageUpscaleWithModel`（节点内部分块） | **2048×3072**（约 2K+） | 需放大模型 |
| 高分+ESRGAN | 先高分再 ESRGAN | **3072×4608**（约 4K 级） | 最慢，细节最好 |

2026-09-09 在 **GTX 1660 Super 6GB** + DreamShaper 8 烟测通过：

```text
hires        → 768×1152   ~60s
esrgan       → 2048×3072  （底图 20 步后放大）
hires_esrgan → 3072×4608  ~54s（缓存热启动）
```

## 安装放大模型（两台机通用，可选）

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\download-upscale-model.ps1
```

放到 `vendor/ComfyUI/models/upscale_models/RealESRGAN_x4plus.pth`（约 64MB）。  
装完**重启 ComfyUI**，前端下拉才会出现。

只用「高分 1.5×」可以不下这个文件。

## 推荐用法（不换卡）

1. 底图用机型默认：1660S `512×768`；2080S `768×1152` / `832×1216`。
2. **先关放大**出小图，定构图与种子。
3. 结果区点 **「同种子 · 高分 / ESRGAN / 高分+ESRGAN」**，或在「放大」区选手动再生成。
4. 锁脸、多 LoRA 时先关放大试一张；切机器会重置放大为关闭。
5. 高分参数默认：denoise `0.4`、步数 `12`、scale `1.5`。denoise 太高会改姿势。

UI 会提示：底图→最终尺寸、缺放大模型、底图过大+高分风险、锁脸+高分+ESRGAN 风险。
提交按钮在关闭时显示「开始生成（小图）」，开放大时显示目标像素。

## 烟测

ComfyUI 已在 `8188` 监听时：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-upscale.ps1 -Mode hires
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-upscale.ps1 -Mode esrgan
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-upscale.ps1 -Mode hires_esrgan
```

## 实现要点（给 AI）

- 工作流：`src/api/comfy-prompt.ts` + `src/api/comfy-prompt-upscale.ts`
- UI：`src/components/UpscalePanel.tsx`；默认 `upscaleMode: off`
- 只保留一个 `SaveImage`（节点 9），避免取到中间图
- 放大路径超时放宽到 10 分钟
- **不是** Ultimate SD Upscale；未装额外 custom node
- 放大只拉分辨率/补细节，**不能**把 SD1.5 纹理变成 Flux 级写实

## 和换卡的关系

本管线解决的是「现有配置出大文件」。皮肤/器官真实度仍受底模限制；要更高写实再换 12G+ 与 SDXL/Flux，见 `docs/04-hardware.md`。
