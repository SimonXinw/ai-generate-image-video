# DreamShaper 8

机器 B · 1660S。安装与烟测见 [`../../../12-dreamshaper-1660s.md`](../../../12-dreamshaper-1660s.md)。

- checkpoint：`DreamShaper_8_pruned.safetensors`
- 分辨率：`512×768`（OOM 再降 `512×512`）
- Steps 24，CFG 6，`euler_ancestral` + `normal`，CLIP Skip 2
- 不要叠多个 LoRA，不要高分修复

## 词法

SD1.5，**不吃** Pony 前缀。迁词只删这些，正文不动：

- 正向删：`score_9, score_8_up, score_7_up, rating_explicit, source_photo`
- 负向删：`score_4, score_5, score_6`
- 可留：`(词:1.3)`、`1girl, solo`、自然语言

## 类型

| 文件 | 说明 |
|------|------|
| [explicit.md](explicit.md) | 露骨。v1 已验证；v3 三点半透微内衣（草稿） |
