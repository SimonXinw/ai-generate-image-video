# Cyber 与 Pony 提示词差异

同一段词换模型不重写，出图就会偏。本文件只讲**差在哪、怎么改**。
新存档按 [`prompts/README.md`](prompts/README.md)。
Pony 历史仍在 `docs/09-*` / `11-*`（只读）。

存档默认写给 Pony V6 XL。用 CyberRealistic Pony 跑同一段词能出图，
但采样参数和风格词要按下表改。

## 先记三件事

1. **两者同源**：CyberRealistic Pony v18 是 Pony V6 的衍生。
   `score_9` 那套前缀、Booru 短标签、`(词:1.3)` 加权，两边都吃。
2. **差在底模风格**：Pony V6 偏二次元，要靠提示词往写实拉；
   Cyber 已经烘进照片风，再堆写实词会过头。
3. **DreamShaper 8 不同源**：SD1.5，**完全不吃** score 前缀，见最后一节。

## 参数对照（先改这个，再改词）

| 项 | Pony V6 XL | CyberRealistic Pony v18 |
|---|---|---|
| 分辨率 | 768×1152 | 832×1216 |
| Steps | 22 | 30 |
| CFG | 7 | **5** |
| 采样器 | `euler_ancestral` | `dpmpp_2m` |
| 调度 | `normal` | `karras` |
| CLIP Skip | 2 | 2 |
| VAE | 内置 | 内置，**不要**再叠外部 VAE |

页面「模型方案」切换会自动套用这两套值，手动改过就不会自动回退。

**Cyber 最常见的错**：沿用 Pony 的 CFG 7。表现是过曝、油光塑料皮、
颜色发死。掉到 5 就正常。反过来 Pony 用 CFG 5 会发灰、松散。

## 正向：改风格词，不改结构

姿势、构图、身体细节那几段两边通用，直接搬。要动的只有开头的风格词。

Pony V6（必须自己把写实拉起来）：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo,
photorealistic, realistic photo, 1girl, solo, beautiful adult woman
```

CyberRealistic Pony（底模已经是照片风，改说摄影语言）：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo,
1girl, solo, beautiful adult woman, raw photo, film grain,
natural skin texture, subsurface scattering
```

要点：

- `score_9, score_8_up, score_7_up` 两边都留，去掉反而掉质量。
- `photorealistic, realistic photo` 在 Pony 上是刚需；在 Cyber 上可留一个，
  别三四个同义词一起堆，会把皮肤推成杂志修图的假光滑。
- `source_photo` 两边都留；`source_anime` 只在 Pony 想要二次元时用。
- Cyber 上收益最大的是**摄影词**：`raw photo`、`film grain`、
  `shot on 85mm lens`、`shallow depth of field`、`low key lighting`。
  这些在 Pony 上作用弱得多。
- 皮肤别用 `dewy glowing skin` 加权太高。Cyber 本来就出油光，
  想要真实毛孔改用 `natural skin texture, visible pores, subsurface scattering`。

## 负向：Pony 要防二次元，Cyber 要防假

两边共用的部分（解剖、构图、红线）不动：

```text
extra fingers, bad hands, bad anatomy, deformed, extra limbs,
2girls, multiple girls, cloned face, watermark, text, logo,
cropped head, head out of frame, face obscured, no face,
child, loli, shota, underage, teen
```

只有下面这段要按模型换。

Pony V6 专用（防止画成动漫）：

```text
anime, cartoon, illustration, 3d render, cel shading, sketch,
doll-like, plastic skin
```

CyberRealistic 专用（防止画成假人像）：

```text
plastic skin, waxy skin, airbrushed, oversmoothed skin,
overexposed, blown out highlights, hdr, oversaturated,
instagram filter, beauty filter, cgi, 3d render
```

`anime, cartoon` 在 Cyber 上留着无害，但不是主要矛盾。Cyber 真正会崩的方向
是「假、过曝、磨皮」，负向要打这些。

## 为什么 v8 那段不穿衣服

`docs/09-prompt-keywords.md` 的 v8 是**按全裸设计的**，和用哪个模型无关。
两处在同时起作用：

- 正向写了 `completely nude`。
- 负向写了 `clothes, dressed, bikini, bra, panties, swimsuit`。

想让它穿衣服，两处都得改，只删正向没用——负向那串会把衣服直接否掉。
Cyber 存档：全裸 v1、白衬衫 v2 见
[`prompts/2080s/cyberrealistic-pony/explicit.md`](prompts/2080s/cyberrealistic-pony/explicit.md)。

v8 迁到 Cyber 的全文在该文件 v1，不要在本文件再改一版。

1. 参数按上表改，尤其 CFG 7 → 5。
2. 正向删掉多余的 `photorealistic` / `realistic photo` 同义堆叠，只留一个。
3. 正向加摄影词：`raw photo`、`film grain`、光线描述。
4. 负向把 `anime, cartoon` 那组换成「防假」组。
5. 分辨率 768×1152 → 832×1216。
6. 种子会失效：换模型后同一 seed 不会得到同一张图，只是噪声一致。

反向（Cyber → Pony）就是把上面倒过来，并把 CFG 提回 7。

## DreamShaper 8（1660S）另说

SD1.5，和上面两个不同源：

- **不要**写 `score_9` 那套，无效还占 token。
- 用自然语言或短标签：`beautiful adult woman, looking at viewer, detailed face`。
- 分辨率 512×768，Steps 24，CFG 6，`euler_ancestral` + `normal`。
- 加权语法 `(词:1.3)` 仍然可用。
- 训练分辨率是 512，直接套 832×1216 会糊或 OOM。

细节见 `docs/12-dreamshaper-1660s.md`。
已验证存档见 [`prompts/1660s/dreamshaper-8/explicit.md`](prompts/1660s/dreamshaper-8/explicit.md)。

## 红线

三个模型一视同仁：禁止任何未成年人相关内容，负向里的
`child, loli, shota, underage, teen` 不要删。正向命中拦截词会被前端挡下。
