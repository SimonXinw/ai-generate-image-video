# 提示词存档规范

同一段词换机型或换模型，格式和参数都会错。新词只写进本目录，
不要再往 `docs/09-*` / `11-*` / `15-*` / `17-*` 追加。

## 路径

```text
docs/prompts/{机型}/{模型}/{类型}.md
```

| 层 | 是什么 | 不是什么 |
|----|--------|----------|
| 机型 | GPU、默认分辨率、启动脚本 | 不是模型名 |
| 模型 | 一个 checkpoint 一个文件夹 | 不要把 Pony 和 Cyber 塞同一夹 |
| 类型 | 内容档位（露骨 / 肖像 / 着衣） | 不是版本号；版本写在文件里面 |

## 机型

| 文件夹 | 页面选项 | GPU | 默认分辨率 | 启动脚本 |
|--------|----------|-----|------------|----------|
| `1660s` | 机器 B · 1660 Super | GTX 1660S 6GB | 512×768 | `start-comfyui-1660s.ps1` |
| `2080s` | 机器 A · 2080 Super | RTX 2080S 8GB | 见该模型 README | `start-comfyui-2080s.ps1` |

新机型：先加文件夹，再写进本表。文件夹名用显卡简称，不要 `machine-a`。

## 模型文件夹

小写 kebab，跟口语名，不跟完整权重文件名。
每个模型夹必须有 `README.md`：checkpoint、默认采样、这种模型能吃 / 不能吃的词法。

| 路径 | checkpoint |
|------|------------|
| `1660s/dreamshaper-8` | `DreamShaper_8_pruned.safetensors` |
| `2080s/cyberrealistic-pony` | `CyberRealisticPony_V18.0_F16.safetensors` |
| `2080s/pony-v6` | `ponyDiffusionV6XL_v6StartWithThisOne.safetensors` |

新模型：新建文件夹 + README。禁止把词写进别的模型夹「先凑合」。

## 类型（一类一个 md）

姿势变化 = 同一文件里追加 `v2`、`v3`，不要新开类型文件。

| 文件 | 收什么 |
|------|--------|
| `explicit.md` | 露骨：全裸、半裸露点、下体可见、开腿特写 |
| `portrait.md` | 成人肖像：脸 / 半身，不写性器官 |
| `clothed.md` | 着衣：衣服盖住下体 |

没有内容就不要建空文件。单文件超过 199 行：同目录拆成
`explicit-v1-v6.md`，并在本页索引写清范围。

## 一条词怎么写

标题：`## vN · 短标题（YYYY-MM-DD）状态`

状态只允许 **`已验证`** / **`草稿`**。用户测过说可以，才改成已验证。

每条必须有：正向、负向、种子。参数与该模型 README 默认值不同时才重写。
不覆盖旧 `v`。换模型迁词：在目标模型的**同类型**文件追加新 `v`，
只改词法，并写「来源」。种子可复用，但换模型不会得到同一张图。

## 词法（摘要）

细节写在各模型 README。迁词时只动格式，不改姿势和身体描述。

| 模型 | 必须留 | 必须删 |
|------|--------|--------|
| DreamShaper 8 | 自然语言或短标签，`(词:1.3)` | `score_*`、`rating_*`、`source_*` |
| Pony V6 / Cyber | `score_9` 那套 + Booru 短标签 | 不要改成纯中文长句 |

负向红线三模型都留：`child, loli, shota, underage, teen`。
正向命中拦截词会被前端挡下。禁止未成年相关内容。

## 旧扁平文件

| 文件 | 状态 |
|------|------|
| `docs/09-prompt-keywords.md` | 只读。Pony v1–v8 |
| `docs/11-prompt-keywords-v9-v11.md` | 只读。Pony v9–v11 |
| `docs/15-cyber-prompt-keywords.md` | 已迁到 `2080s/cyberrealistic-pony/` |
| `docs/17-dreamshaper-prompt-keywords.md` | 已迁到 `1660s/dreamshaper-8/` |

差异说明仍在 [`../14-cyber-vs-pony-prompts.md`](../14-cyber-vs-pony-prompts.md)。

## 现行索引

| 文件 | 类型 | 最新 |
|------|------|------|
| [1660s/dreamshaper-8/explicit.md](1660s/dreamshaper-8/explicit.md) | 露骨 | v6 已验证 |
| [2080s/cyberrealistic-pony/explicit.md](2080s/cyberrealistic-pony/explicit.md) | 露骨 | v2 |
| [2080s/pony-v6/](2080s/pony-v6/README.md) | （新词再写） | 历史在 09 / 11 |
