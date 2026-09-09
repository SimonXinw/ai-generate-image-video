# CyberRealistic Pony v18

机器 A · 2080S。安装见 [`../../../10-cyberrealistic-pony.md`](../../../10-cyberrealistic-pony.md)。
和 Pony / DreamShaper 的差异见 [`../../../14-cyber-vs-pony-prompts.md`](../../../14-cyber-vs-pony-prompts.md)。

- checkpoint：`CyberRealisticPony_V18.0_F16.safetensors`
- 分辨率：`832×1216`
- Steps 30，CFG **5**，`dpmpp_2m` + `karras`，CLIP Skip 2
- 不要再叠外部 VAE。不要沿用 Pony 的 CFG 7。

## 词法

和 Pony 同源，**要留** `score_9, score_8_up, score_7_up`。
风格用摄影词（`raw photo, film grain`），少堆 `photorealistic`。
负向主打防假（磨皮、过曝、滤镜），不是防二次元。

迁到 DreamShaper 时只删 `score_*` / `rating_*` / `source_*`，正文不动。

## 类型

| 文件 | 说明 |
|------|------|
| [explicit.md](explicit.md) | 露骨。v11 脸红 + 半眯，v12 冰蓝 bralette，v13 宝蓝半杯蕾丝，v14 深紫三角片露乳沟，v15 天蓝三角片，v16 黑发 + 酒红挤胸，v17 堵插入，v18 三角片下移露上乳，v19 酒红浅 V 领，v20 V 形蕾丝滚边，v21 V 尖抬到上胸（会走光）|
| [explicit-v1-v6.md](explicit-v1-v6.md) | 历史 v1–v6 |
