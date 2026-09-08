# 提示词存档

只存已跑过、想留的正向/负向。不覆盖旧版，往后加 `v3`、`v4`。  
机器 A、checkpoint `ponyDiffusionV6XL_v6StartWithThisOne.safetensors`、竖图 **768×1152**，除非某条另写。

不要用 `extreme close-up` / `strong perspective foreshortening`，脸容易出画。

---

## v1 · 写实、抬头可见脸、从大腿之间往上看（2026-09-09）

要点：抬头、脸必须入画；从大腿之间往上看脸；去衣。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, photorealistic, realistic photo, beautiful adult woman, looking at viewer, head tilted back, face clearly visible, full view from vulva to face, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, bare breasts, pink nipples, D-cup breasts, dimples, natural skin texture, natural lighting, soft daylight, legs spread 45 degrees toward both bottom corners, thighs open, vagina facing the viewer, slightly enlarged vaginal opening, camera between the thighs looking up toward the face, abalone-shaped clitoris, detailed labia, detailed vulva, vertical navel, natural body lines
```

负向：

```text
score_4, score_5, score_6, blurry, lowres, jpeg artifacts, overexposed, underexposed, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, fused fingers, bad hands, bad anatomy, deformed, asymmetric eyes, watermark, text, logo, clothes, clothing, dressed, bikini, bra, panties, swimsuit, cropped head, head out of frame, face obscured, no face, child, loli, shota, underage, teen
```

---

## v2 · 躺姿撑地、阴道更近、镜头仰向脸（2026-09-09）

构图：人躺着、双手撑地、身体斜向上；镜头贴近阴道再往上仰；头面向镜头，脸在画面上方。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, photorealistic, realistic photo, beautiful adult woman, lying on her back, upper body propped up with both hands on the floor, body angled diagonally upward toward the camera, looking at viewer, face clearly visible at the top of the frame, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, bare breasts, pink nipples, D-cup breasts, dimples, natural skin texture, natural lighting, soft daylight, legs spread 45 degrees toward both bottom corners, thighs open, vagina close to the camera, vagina facing the viewer, slightly enlarged vaginal opening, camera near the vulva angled upward along the body toward the face, abalone-shaped clitoris, detailed labia, detailed vulva, vertical navel, natural body lines, full view from vulva to face
```

负向：

```text
score_4, score_5, score_6, blurry, lowres, jpeg artifacts, overexposed, underexposed, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, fused fingers, bad hands, bad anatomy, deformed, asymmetric eyes, watermark, text, logo, clothes, clothing, dressed, bikini, bra, panties, swimsuit, cropped head, head out of frame, face obscured, no face, standing, sitting upright, child, loli, shota, underage, teen
```

---

## v3 · 阴道居中正面、腿脚出画、头完整贴上沿（2026-09-09）

在 v2 躺姿撑地、镜头仰向脸上：阴道口在画面水平中央、正面全露；双腿对称抬起，腿脚被左右画框切掉；头必须完整入画，头顶在上边缘下方一点。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, photorealistic, realistic photo, beautiful adult woman, lying on her back, upper body propped up with both hands on the floor, body angled diagonally upward toward the camera, entire head inside the frame, top of the head just below the top edge of the frame, whole face visible from chin to forehead, looking straight at the camera, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, bare breasts, pink nipples, D-cup breasts, dimples, natural skin texture, natural lighting, soft daylight, both legs raised symmetrically, legs and feet cropped by the left and right frame edges, vulva at the horizontal center of the frame, front view of the vulva, fully exposed vulva, vagina close to the camera, vagina facing the viewer, slightly enlarged vaginal opening, camera near the vulva angled upward along the body toward the face, abalone-shaped clitoris, detailed labia, detailed vulva, vertical navel, natural body lines, full view from vulva to face
```

负向：

```text
score_4, score_5, score_6, blurry, lowres, jpeg artifacts, overexposed, underexposed, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, fused fingers, bad hands, bad anatomy, deformed, asymmetric eyes, watermark, text, logo, clothes, clothing, dressed, bikini, bra, panties, swimsuit, cropped head, head out of frame, cropped face, top of head cut off, forehead out of frame, chin out of frame, headless, face obscured, no face, looking away, head turned away, back of head, standing, sitting upright, child, loli, shota, underage, teen
```

---

## v4 · 躺姿抱腿掰开、精简加权（2026-09-09）

本机验证满意。姿势用 Danbooru 短标签并加权：`lying on back` / `legs up` / `spread legs` / `holding own legs` / `presenting`；头入画、外阴居中正面。复现时种子填 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, perky round breasts, firm breasts, tender pink nipples, small pale pink areola, natural skin texture, soft daylight, (fully exposed vulva:1.3), vulva at the center of the frame, front view of the vulva, puffy vulva, plump outer labia, small neat inner labia, neat vertical slit, visible clitoral hood, small pink clitoris, glistening moist labia, slightly enlarged vaginal opening, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, clothes, dressed, bikini, bra, panties, swimsuit, sagging breasts, large dark areola, brown nipples, deformed vulva, uneven labia, hairy vulva, hands covering the vulva, hands between the legs, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

---

## v5 · 平坦小腹、竖向凹陷肚脐（2026-09-09）

在 v4 姿势上只改腹部：平坦无赘肉、竖向凹进肚脐。正向加权 `flat toned stomach` / `vertical navel`；负向堵 `belly fat` 等。复现时种子填 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, perky round breasts, firm breasts, tender pink nipples, small pale pink areola, (flat toned stomach:1.2), slim waist, no belly fat, (vertical navel:1.2), narrow innie navel, natural skin texture, soft daylight, (fully exposed vulva:1.3), vulva at the center of the frame, front view of the vulva, puffy vulva, plump outer labia, small neat inner labia, neat vertical slit, visible clitoral hood, small pink clitoris, glistening moist labia, slightly enlarged vaginal opening, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, clothes, dressed, bikini, bra, panties, swimsuit, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, bloated stomach, belly rolls, love handles, outie navel, deformed vulva, uneven labia, hairy vulva, hands covering the vulva, hands between the legs, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

---

## v6 · 韩式亚洲脸、魅惑神态（2026-09-09）

在 v5 上只加脸：韩裔东亚五官、半睁魅惑眼神、水光肌。种子复用 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (korean woman:1.3), east asian features, (seductive expression:1.2), sultry gaze, half-lidded eyes, glossy lips, slight smirk, high cheekbones, slim V-shaped jawline, small straight nose, dewy glowing skin, k-pop idol makeup, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, perky round breasts, firm breasts, tender pink nipples, small pale pink areola, (flat toned stomach:1.2), slim waist, (vertical navel:1.2), narrow innie navel, natural skin texture, soft daylight, (fully exposed vulva:1.3), vulva at the center of the frame, front view of the vulva, puffy vulva, plump outer labia, small neat inner labia, neat vertical slit, visible clitoral hood, small pink clitoris, glistening moist labia, slightly enlarged vaginal opening, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, caucasian, western facial features, deep set eyes, heavy jawline, freckles, clothes, dressed, bikini, bra, panties, swimsuit, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, bloated stomach, belly rolls, love handles, outie navel, deformed vulva, uneven labia, hairy vulva, hands covering the vulva, hands between the legs, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

---

## v7 · 白皙、白里透红肤色（2026-09-09）

在 v6 上只加肤色：`(fair skin:1.3)` + `rosy undertone, flushed cheeks`；负向堵晒黑/橄榄皮/发黄。种子复用 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (korean woman:1.3), east asian features, (seductive expression:1.2), sultry gaze, half-lidded eyes, glossy lips, slight smirk, high cheekbones, slim V-shaped jawline, small straight nose, (fair skin:1.3), pale skin, rosy undertone, flushed cheeks, light pink complexion, dewy glowing skin, k-pop idol makeup, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, perky round breasts, firm breasts, tender pink nipples, small pale pink areola, (flat toned stomach:1.2), slim waist, (vertical navel:1.2), narrow innie navel, natural skin texture, soft daylight, (fully exposed vulva:1.3), vulva at the center of the frame, front view of the vulva, puffy vulva, plump outer labia, small neat inner labia, neat vertical slit, visible clitoral hood, small pink clitoris, glistening moist labia, slightly enlarged vaginal opening, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, caucasian, western facial features, deep set eyes, heavy jawline, freckles, tan, tanned skin, dark skin, olive skin, suntan, sunburn, muddy skin, yellowish skin, clothes, dressed, bikini, bra, panties, swimsuit, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, bloated stomach, belly rolls, love handles, outie navel, deformed vulva, uneven labia, hairy vulva, hands covering the vulva, hands between the legs, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

---

## v8 · 肉色白皙、脸身同色（2026-09-09）

在 v7 上把惨白改成自然肉色：去掉 `pale skin`，改 `(natural fair skin:1.2)` + 脸身同色。种子复用 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (korean woman:1.3), east asian features, (seductive expression:1.2), sultry gaze, half-lidded eyes, glossy lips, slight smirk, high cheekbones, slim V-shaped jawline, small straight nose, (natural fair skin:1.2), healthy skin, warm rosy undertone, light natural flush, even skin tone, matching face and body skin color, dewy glowing skin, k-pop idol makeup, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, perky round breasts, firm breasts, tender pink nipples, small pale pink areola, (flat toned stomach:1.2), slim waist, (vertical navel:1.2), narrow innie navel, natural skin texture, soft daylight, (fully exposed vulva:1.3), vulva at the center of the frame, front view of the vulva, puffy vulva, plump outer labia, small neat inner labia, neat vertical slit, visible clitoral hood, small pink clitoris, glistening moist labia, slightly enlarged vaginal opening, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, caucasian, western facial features, deep set eyes, heavy jawline, freckles, pale face, ghostly white skin, porcelain skin, overexposed face, white makeup, powdery face, mismatched skin tone, tan, tanned skin, dark skin, olive skin, suntan, sunburn, muddy skin, yellowish skin, clothes, dressed, bikini, bra, panties, swimsuit, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, bloated stomach, belly rolls, love handles, outie navel, deformed vulva, uneven labia, hairy vulva, hands covering the vulva, hands between the legs, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

---

## v9 · 外阴掰开可见内部、裸体前置加权（2026-09-09）

在 v8 上重做外阴与裸体两处。外阴改成「张开」信号：`(spread pussy:1.4)` / `(open pussy:1.3)`，逐个点名内瓣、阴道口、蒂头并各自加权；删掉所有闭合词（`innie pussy` / `closed outer lips` / `neat vertical slit`）并移进负向。裸体词提到第一段并加权，负向补全衣物类别（`lingerie` / `dress` / `stockings` / `towel` 等），否则韩系写实先验会自动把衣服补回来。部位统一叫 `pussy`，不要和 `vulva` 混用。种子复用 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, (completely nude:1.4), (nude:1.3), naked, no clothes, bare skin, photorealistic, realistic photo, beautiful adult woman, (korean woman:1.3), east asian features, (seductive expression:1.2), sultry gaze, half-lidded eyes, glossy lips, slight smirk, slim V-shaped jawline, (natural fair skin:1.2), warm rosy undertone, even skin tone, dewy glowing skin, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, perky round breasts, bare breasts, tender pink nipples, small pale pink areola, (flat toned stomach:1.2), slim waist, (vertical navel:1.2), natural skin texture, soft daylight, (uncensored:1.3), (spread pussy:1.4), (open pussy:1.3), parted labia, outer labia spread apart, (visible vaginal opening:1.3), pink vaginal entrance, (visible inner labia:1.2), small light pink inner labia, (clitoral glans exposed from the hood:1.2), tiny pink clitoris, pussy juice, glistening wet labia, shaved pussy, (detailed pussy:1.3), pussy in the foreground, straight-on view of the pussy, pussy at the center of the frame, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, (clothes:1.3), clothing, dressed, partially clothed, lingerie, underwear, bra, panties, thong, bikini, swimsuit, dress, shirt, t-shirt, crop top, tank top, skirt, shorts, stockings, thighhighs, socks, garter belt, robe, towel, jewelry, necklace, choker, covered nipples, pasties, censored, mosaic censoring, bar censor, convenient censoring, closed pussy, closed labia, innie pussy, hidden clitoris, hidden vaginal opening, smooth featureless crotch, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, caucasian, western facial features, deep set eyes, heavy jawline, freckles, pale face, ghostly white skin, porcelain skin, overexposed face, white makeup, mismatched skin tone, tan, tanned skin, dark skin, olive skin, yellowish skin, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, belly rolls, love handles, outie navel, dark purple labia, brown labia, torn labia, hairy vulva, pubic hair, hands covering the vulva, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

### 外阴固定词块（可整段复用）

按部位分层，改哪层动哪层。要闭合形态就把张开词换回 `innie pussy, gently closed outer lips, neat vertical slit`。

```text
uncensored, spread pussy, open pussy, parted labia, outer labia spread apart, visible vaginal opening, pink vaginal entrance, visible inner labia, small light pink inner labia, clitoral glans exposed from the hood, tiny pink clitoris, pussy juice, glistening wet labia, shaved pussy, detailed pussy
```

| 层 | 词 | 管什么 |
|---|---|---|
| 张开 | `spread pussy` / `open pussy` / `parted labia` | 掰开，不写就只剩两片大阴唇 |
| 外瓣 | `outer labia spread apart` | 大阴唇分开 |
| 内瓣 | `visible inner labia` / `small light pink inner labia` | 小阴唇可见、浅粉、不外翻 |
| 阴道口 | `visible vaginal opening` / `pink vaginal entrance` | 口部微张、有纵深 |
| 阴蒂 | `clitoral glans exposed from the hood` / `tiny pink clitoris` | 蒂头从包皮下露出 |
| 质感 | `pussy juice` / `glistening wet labia` | 湿润光泽 |
| 清洁 | `shaved pussy` | 无毛 |
| 防审查 | `uncensored` / `detailed pussy` | 不加会被糊成一条线或打码 |

### 踩过的坑

- 正向超过约 150 token 后 CLIP 分三段，中段权重最弱。裸体、姿势这种「必须成立」的词要放第一段。
- 闭合词和张开词不能同时写；负向的 `protruding inner labia` / `gaping` 会把内部结构压回去。
- 768×1152 下外阴像素本就不多，细节有物理上限。想更清晰要局部重绘或放大，当前前端只有单条 txt2img 工作流，做不到。

---

## v10 · 亮粉透视内衣 + 黑丝（2026-09-09）

分区穿衣：上身亮粉半透明只遮乳头，腿部黑色透视长袜到大腿根，下体仍完全裸露。**必须同时改负向**——v9 负向里那串 `clothes / lingerie / stockings / thighhighs / covered nipples` 会直接否掉内衣和丝袜，正向再怎么写都不会穿；正向的 `completely nude` 一组也要删掉。种子复用 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (sheer hot pink lingerie:1.3), see-through bright pink babydoll, vivid fresh pink fabric, translucent fabric covering only the nipples, (nipples visible through sheer fabric:1.2), (black sheer thighhighs:1.3), see-through black stockings, stocking tops at the base of her thighs, bare skin above the stockings, (no panties:1.3), bare crotch, (korean woman:1.3), east asian features, (seductive expression:1.2), sultry gaze, half-lidded eyes, glossy lips, slight smirk, slim V-shaped jawline, (natural fair skin:1.2), warm rosy undertone, dewy glowing skin, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, perky round breasts, small pale pink areola, (flat toned stomach:1.2), slim waist, (vertical navel:1.2), natural skin texture, soft daylight, (uncensored:1.3), (spread pussy:1.4), (open pussy:1.3), parted labia, (visible vaginal opening:1.3), pink vaginal entrance, (visible inner labia:1.2), small light pink inner labia, (clitoral glans exposed from the hood:1.2), tiny pink clitoris, pussy juice, glistening wet labia, shaved pussy, (detailed pussy:1.3), pussy at the center of the frame, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, pastel pink lingerie, faded pink, washed out colors, opaque fabric, opaque lingerie, opaque stockings, thick stockings, pantyhose, fishnet, bra, camisole, panties, thong, bikini, swimsuit, dress, shirt, t-shirt, crop top, tank top, skirt, shorts, robe, towel, jewelry, necklace, choker, fully clothed, covered pussy, crotch covered, censored, mosaic censoring, bar censor, convenient censoring, closed pussy, closed labia, innie pussy, hidden clitoris, hidden vaginal opening, smooth featureless crotch, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, caucasian, western facial features, deep set eyes, heavy jawline, freckles, pale face, ghostly white skin, porcelain skin, overexposed face, white makeup, mismatched skin tone, tan, tanned skin, dark skin, olive skin, yellowish skin, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, belly rolls, love handles, outie navel, dark purple labia, brown labia, torn labia, hairy vulva, pubic hair, hands covering the vulva, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

### 分区穿衣要点

| 区 | 词 | 说明 |
|---|---|---|
| 上身 | `sheer hot pink lingerie` / `translucent fabric covering only the nipples` / `nipples visible through sheer fabric` | 最后一句是「若隐若现」的关键，不写会画成不透明 |
| 腿部 | `black sheer thighhighs` / `stocking tops at the base of her thighs` / `bare skin above the stockings` | 最后一句定袜口以上露肤，不写会变连裤袜 |
| 下体 | `no panties` / `bare crotch` | 配负向 `panties / covered pussy / crotch covered` |

负向要针对「错误穿法」而不是「衣服」本身：`opaque fabric`（不透明）、`pantyhose`（连裤袜）、`fishnet`（渔网）、`bra / camisole`（实心胸罩会遮住乳头）。

---

## v11 · 酒红蕾丝 + 黑长发 + 暖调低键光（2026-09-09）

配色重做。v10 的问题是亮粉和皮肤同色相会「融」掉，缺明度对比；蓝发配亮粉又是高饱和撞色，把写实往二次元拉。改成暗色包裹：黑发 + 黑丝在两端，皮肤成为画面里唯一亮部，酒红提供情欲色又和黑色协调。光线是收益最大的一项——`soft daylight` 平光最不性感，换成暖调低键加轮廓光。种子复用 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (sheer wine red lingerie:1.3), see-through burgundy babydoll, deep red translucent lace, translucent fabric covering only the nipples, (nipples visible through sheer fabric:1.2), (black sheer thighhighs:1.3), see-through black stockings, stocking tops at the base of her thighs, bare skin above the stockings, (no panties:1.3), bare crotch, (korean woman:1.3), east asian features, (seductive expression:1.2), sultry gaze, half-lidded eyes, glossy red lips, slight smirk, slim V-shaped jawline, (natural fair skin:1.2), warm rosy undertone, dewy glowing skin, (long wavy jet black hair:1.2), glossy black hair, deep phoenix-like eyes, detailed face, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, perky round breasts, small pale pink areola, (flat toned stomach:1.2), slim waist, (vertical navel:1.2), natural skin texture, (low key lighting:1.2), warm bedside lamp light, soft rim light on her skin, shallow depth of field, (uncensored:1.3), (spread pussy:1.4), (open pussy:1.3), parted labia, (visible vaginal opening:1.3), pink vaginal entrance, (visible inner labia:1.2), small light pink inner labia, (clitoral glans exposed from the hood:1.2), tiny pink clitoris, pussy juice, glistening wet labia, shaved pussy, (detailed pussy:1.3), pussy at the center of the frame, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, flat lighting, harsh flash, overhead fluorescent light, washed out colors, faded fabric, opaque fabric, opaque lingerie, opaque stockings, thick stockings, pantyhose, fishnet, bra, camisole, panties, thong, bikini, swimsuit, dress, shirt, t-shirt, crop top, tank top, skirt, shorts, robe, towel, jewelry, necklace, choker, fully clothed, covered pussy, crotch covered, censored, mosaic censoring, bar censor, convenient censoring, closed pussy, closed labia, innie pussy, hidden clitoris, hidden vaginal opening, smooth featureless crotch, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, caucasian, western facial features, deep set eyes, heavy jawline, freckles, pale face, ghostly white skin, porcelain skin, overexposed face, white makeup, mismatched skin tone, tan, tanned skin, dark skin, olive skin, yellowish skin, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, belly rolls, love handles, outie navel, dark purple labia, brown labia, torn labia, hairy vulva, pubic hair, hands covering the vulva, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

### 配色备选（只换内衣和头发两处）

| 方向 | 内衣 | 头发 |
|---|---|---|
| 纯黑蕾丝（极简高级） | `(sheer black lace lingerie:1.3), see-through black babydoll, delicate black lace` | 保持乌黑 |
| 裸色香槟（柔和纯欲） | `(sheer champagne lace lingerie:1.3), see-through nude babydoll, delicate ivory lace` | `long wavy dark chestnut brown hair` |
| 保留蓝发 | 建议改用纯黑蕾丝 | `(long wavy blue black hair:1.2)`，低饱和蓝黑在暗光下泛蓝，比纯蓝发写实 |

### 配色思路

- 性感来自**明度对比**，不是饱和度。和皮肤同色相的颜色贴在身上会融掉。
- 暗色放两端（头发、丝袜），皮肤夹在中间成为唯一亮部，是摄影里最经典的处理。
- 光线优先级高于颜色：`low key lighting` + `warm bedside lamp light` + `soft rim light` 收益最大，`soft daylight` 是平光，最不性感。



score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (sheer black lace nipple covers:1.4), tiny translucent black triangles covering only the nipples, delicate black lace, (nipples visible through sheer lace:1.3), (bare stomach:1.2), bare shoulders, nothing else covering her torso, (black sheer thighhighs:1.3), see-through black stockings, stocking tops at the base of her thighs, bare skin above the stockings, (no panties:1.3), bare crotch, (korean woman:1.3), east asian features, (seductive expression:1.2), sultry gaze, half-lidded eyes, glossy red lips, slight smirk, slim V-shaped jawline, (natural fair skin:1.2), warm rosy undertone, dewy glowing skin, (long wavy jet black hair:1.2), glossy black hair, deep phoenix-like eyes, detailed face, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs with both hands:1.4), (two arms:1.2), (two hands:1.2), arms under her knees, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, perky round breasts, small pale pink areola, (flat toned stomach:1.2), slim waist, (vertical navel:1.2), natural skin texture, perfect anatomy, (low key lighting:1.2), warm bedside lamp light, soft rim light on her skin, (uncensored:1.3), (spread pussy:1.4), (open pussy:1.3), parted labia, (visible vaginal opening:1.3), pink vaginal entrance, (visible inner labia:1.2), small light pink inner labia, (clitoral glans exposed from the hood:1.2), tiny pink clitoris, pussy juice, glistening wet labia, shaved pussy, (detailed pussy:1.3), pussy at the center of the frame, view from between the legs toward the face


score_4, score_5, score_6, (extra arms:1.5), (extra hands:1.5), (three arms:1.5), (three hands:1.5), (four arms:1.4), (multiple arms:1.4), (multiple hands:1.4), too many hands, extra pair of arms, spare hand, third arm, third hand, disembodied hand, floating hand, detached arm, arm growing from her body, extra limbs, mutated limbs, malformed limbs, poorly drawn hands, fused arms, duplicated limbs, babydoll, chemise, teddy, bodysuit, corset, nightgown, opaque bra, full coverage bra, opaque pasties, covered torso, covered stomach, covered navel, flat lighting, harsh flash, overhead fluorescent light, washed out colors, opaque fabric, opaque lingerie, opaque stockings, thick stockings, pantyhose, fishnet, camisole, panties, thong, bikini, swimsuit, dress, shirt, t-shirt, crop top, tank top, skirt, shorts, robe, towel, jewelry, necklace, choker, fully clothed, covered pussy, crotch covered, censored, mosaic censoring, bar censor, convenient censoring, closed pussy, closed labia, innie pussy, hidden clitoris, hidden vaginal opening, smooth featureless crotch, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra legs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, caucasian, western facial features, deep set eyes, heavy jawline, freckles, pale face, ghostly white skin, porcelain skin, overexposed face, white makeup, mismatched skin tone, tan, tanned skin, dark skin, olive skin, yellowish skin, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, belly rolls, love handles, outie navel, dark purple labia, brown labia, torn labia, hairy vulva, pubic hair, hands covering the vulva, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen

1083946597