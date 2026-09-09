# Pony V6 XL

机器 A · 2080S。新词按 [`../../README.md`](../../README.md) 写进本夹的类型文件。
历史扁平存档（只读，不要再追加）：

- [`../../../09-prompt-keywords.md`](../../../09-prompt-keywords.md) v1–v8
- [`../../../11-prompt-keywords-v9-v11.md`](../../../11-prompt-keywords-v9-v11.md) v9–v11

- checkpoint：`ponyDiffusionV6XL_v6StartWithThisOne.safetensors`
- 分辨率：`768×1152`
- Steps 22，CFG **7**，`euler_ancestral` + `normal`，CLIP Skip 2

## 词法

必须带 `score_9, score_8_up, score_7_up`。写实用 `source_photo` +
`photorealistic`；二次元用 `source_anime`。人物用 Danbooru 短标签。
负向可带 `score_4, score_5, score_6`，并留防二次元组。

迁到 Cyber：CFG 7 → 5，少堆写实同义词，负向改防假。
迁到 DreamShaper：删全部 `score_*` / `rating_*` / `source_*`。
