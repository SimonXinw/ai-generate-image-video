# 提示词与模型类型

前端目前 **只有一套工作流**：Checkpoint + 可选 LoRA + CLIP skip + KSampler。  
换模型类型时，**改提示词和分辨率**，不要指望代码自动识别。

Cyber / Pony / DreamShaper 三者的逐项差异与迁移清单见
[`14-cyber-vs-pony-prompts.md`](14-cyber-vs-pony-prompts.md)。

## Pony V6 XL（机器 A 主推）

- CLIP skip：**2**（页面默认）
- 分辨率：768×1152（8G）；6G 不要用 Pony，用 DreamShaper 512×768
- 正向建议带：`score_9, score_8_up, score_7_up, source_anime`
- 人物用 Danbooru 风标签：`1girl, long hair, ...`
- 负向可带：`score_4, score_5, score_6, extra fingers`
- 负向里的 `child, loli` 是排除项；拦截 **只看正向**，不要删负向里这些词除非你改了代码

### 已验证：写实、抬头可见脸、从下往上（2026-09-09）

本机 2080S + Pony V6 XL，竖图 768×1152。不要用 `extreme close-up` / `strong perspective foreshortening`，否则脸容易出画。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, photorealistic, realistic photo, beautiful adult woman, looking at viewer, head tilted back, face clearly visible, full view from vulva to face, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, bare breasts, pink nipples, D-cup breasts, dimples, natural skin texture, natural lighting, soft daylight, legs spread 45 degrees toward both bottom corners, thighs open, vagina facing the viewer, slightly enlarged vaginal opening, camera between the thighs looking up toward the face, abalone-shaped clitoris, detailed labia, detailed vulva, vertical navel, natural body lines
```

负向：

```text
score_4, score_5, score_6, blurry, lowres, jpeg artifacts, overexposed, underexposed, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, fused fingers, bad hands, bad anatomy, deformed, asymmetric eyes, watermark, text, logo, clothes, clothing, dressed, bikini, bra, panties, swimsuit, cropped head, head out of frame, face obscured, no face, child, loli, shota, underage, teen
```

README 里也有同一份，方便复制。

## SD 1.5（机器 B 主推）

- 训练分辨率约 **512**。优先 512×768 / 640×640，不要一上来 768×1152
- CLIP skip：二次元常 2，写实常 **1**（页面默认仍是 2，写实请自行当缺口，以后可加开关）
- 提示词用自然语言或短标签均可，**不要硬套** `score_9`（那是 Pony 的）
- 页面切到 1660S 后会换成自然语言默认句，并匹配 DreamShaper 8 方案；不要再写 `score_9`

## SDXL（Juggernaut 等）

- 分辨率接近 1024，8G 用 832 方图或 768 竖图；6G 不优先
- CLIP skip 多为 1
- 提示词偏自然语言，不是 Pony 标签

## 不要混

| 错误 | 结果 |
|------|------|
| 1.5 模型 + 768×1152 | 易 OOM 或糊 |
| Pony 模型 + 纯中文长句、无 score | 能出但风格不稳 |
| SDXL LoRA 套在 1.5 检查点上 | 直接坏图或报错 |
| Flux 权重丢进 checkpoints 用当前工作流 | 节点不对，会失败 |

当前代码 **不能** 跑 Flux / 视频 / ControlNet。那是以后加节点的事，见 `docs/07-known-gaps.md`。
