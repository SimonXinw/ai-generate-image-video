# 提示词存档（v1–v8）

只存已跑过、想留的正向/负向。不覆盖旧版。v9 以后见
[`11-prompt-keywords-v9-v11.md`](11-prompt-keywords-v9-v11.md)。
机器 A、checkpoint `ponyDiffusionV6XL_v6StartWithThisOne.safetensors`、竖图
**768×1152**，除非某条另写。

换成 CyberRealistic Pony 跑这些词时，参数和风格词要改，见
[`14-cyber-vs-pony-prompts.md`](14-cyber-vs-pony-prompts.md)。

不要用 `extreme close-up` / `strong perspective foreshortening`，脸容易出画。

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

## v3 · 阴道居中正面、腿脚出画、头完整贴上沿（2026-09-09）

在 v2 上：阴道口水平居中、正面全露；双腿对称抬起，腿脚被左右画框切掉；头必须完整入画。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, photorealistic, realistic photo, beautiful adult woman, lying on her back, upper body propped up with both hands on the floor, body angled diagonally upward toward the camera, entire head inside the frame, top of the head just below the top edge of the frame, whole face visible from chin to forehead, looking straight at the camera, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, bare breasts, pink nipples, D-cup breasts, dimples, natural skin texture, natural lighting, soft daylight, both legs raised symmetrically, legs and feet cropped by the left and right frame edges, vulva at the horizontal center of the frame, front view of the vulva, fully exposed vulva, vagina close to the camera, vagina facing the viewer, slightly enlarged vaginal opening, camera near the vulva angled upward along the body toward the face, abalone-shaped clitoris, detailed labia, detailed vulva, vertical navel, natural body lines, full view from vulva to face
```

负向：

```text
score_4, score_5, score_6, blurry, lowres, jpeg artifacts, overexposed, underexposed, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, fused fingers, bad hands, bad anatomy, deformed, asymmetric eyes, watermark, text, logo, clothes, clothing, dressed, bikini, bra, panties, swimsuit, cropped head, head out of frame, cropped face, top of head cut off, forehead out of frame, chin out of frame, headless, face obscured, no face, looking away, head turned away, back of head, standing, sitting upright, child, loli, shota, underage, teen
```

## v4 · 躺姿抱腿掰开、精简加权（2026-09-09）

本机验证满意。姿势用 Danbooru 短标签并加权；头入画、外阴居中正面。复现种子 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, perky round breasts, firm breasts, tender pink nipples, small pale pink areola, natural skin texture, soft daylight, (fully exposed vulva:1.3), vulva at the center of the frame, front view of the vulva, puffy vulva, plump outer labia, small neat inner labia, neat vertical slit, visible clitoral hood, small pink clitoris, glistening moist labia, slightly enlarged vaginal opening, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, clothes, dressed, bikini, bra, panties, swimsuit, sagging breasts, large dark areola, brown nipples, deformed vulva, uneven labia, hairy vulva, hands covering the vulva, hands between the legs, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

## v5 · 平坦小腹、竖向凹陷肚脐（2026-09-09）

在 v4 上只改腹部：平坦无赘肉、竖向凹进肚脐。种子 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, perky round breasts, firm breasts, tender pink nipples, small pale pink areola, (flat toned stomach:1.2), slim waist, no belly fat, (vertical navel:1.2), narrow innie navel, natural skin texture, soft daylight, (fully exposed vulva:1.3), vulva at the center of the frame, front view of the vulva, puffy vulva, plump outer labia, small neat inner labia, neat vertical slit, visible clitoral hood, small pink clitoris, glistening moist labia, slightly enlarged vaginal opening, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, clothes, dressed, bikini, bra, panties, swimsuit, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, bloated stomach, belly rolls, love handles, outie navel, deformed vulva, uneven labia, hairy vulva, hands covering the vulva, hands between the legs, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

## v6 · 韩式亚洲脸、魅惑神态（2026-09-09）

在 v5 上只加韩裔东亚五官、半睁魅惑眼神、水光肌。种子 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (korean woman:1.3), east asian features, (seductive expression:1.2), sultry gaze, half-lidded eyes, glossy lips, slight smirk, high cheekbones, slim V-shaped jawline, small straight nose, dewy glowing skin, k-pop idol makeup, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, perky round breasts, firm breasts, tender pink nipples, small pale pink areola, (flat toned stomach:1.2), slim waist, (vertical navel:1.2), narrow innie navel, natural skin texture, soft daylight, (fully exposed vulva:1.3), vulva at the center of the frame, front view of the vulva, puffy vulva, plump outer labia, small neat inner labia, neat vertical slit, visible clitoral hood, small pink clitoris, glistening moist labia, slightly enlarged vaginal opening, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, caucasian, western facial features, deep set eyes, heavy jawline, freckles, clothes, dressed, bikini, bra, panties, swimsuit, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, bloated stomach, belly rolls, love handles, outie navel, deformed vulva, uneven labia, hairy vulva, hands covering the vulva, hands between the legs, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

## v7 · 白皙、白里透红肤色（2026-09-09）

在 v6 上加白皙底色与粉红血色。种子 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (korean woman:1.3), east asian features, (seductive expression:1.2), sultry gaze, half-lidded eyes, glossy lips, slight smirk, high cheekbones, slim V-shaped jawline, small straight nose, (fair skin:1.3), pale skin, rosy undertone, flushed cheeks, light pink complexion, dewy glowing skin, k-pop idol makeup, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, perky round breasts, firm breasts, tender pink nipples, small pale pink areola, (flat toned stomach:1.2), slim waist, (vertical navel:1.2), narrow innie navel, natural skin texture, soft daylight, (fully exposed vulva:1.3), vulva at the center of the frame, front view of the vulva, puffy vulva, plump outer labia, small neat inner labia, neat vertical slit, visible clitoral hood, small pink clitoris, glistening moist labia, slightly enlarged vaginal opening, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, caucasian, western facial features, deep set eyes, heavy jawline, freckles, tan, tanned skin, dark skin, olive skin, suntan, sunburn, muddy skin, yellowish skin, clothes, dressed, bikini, bra, panties, swimsuit, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, bloated stomach, belly rolls, love handles, outie navel, deformed vulva, uneven labia, hairy vulva, hands covering the vulva, hands between the legs, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`

## v8 · 肉色白皙、脸身同色（2026-09-09）

在 v7 上去掉惨白，改成自然肉色并要求脸身同色。种子 **1083946597**。

正向：

```text
score_9, score_8_up, score_7_up, rating_explicit, source_photo, 1girl, solo, photorealistic, realistic photo, beautiful adult woman, (korean woman:1.3), east asian features, (seductive expression:1.2), sultry gaze, half-lidded eyes, glossy lips, slight smirk, high cheekbones, slim V-shaped jawline, small straight nose, (natural fair skin:1.2), healthy skin, warm rosy undertone, light natural flush, even skin tone, matching face and body skin color, dewy glowing skin, k-pop idol makeup, (lying on back:1.4), (legs up:1.3), (spread legs:1.3), (holding own legs:1.4), arms under her knees, knees pulled back toward her chest, thighs wide apart, presenting, feet out of frame, (looking at viewer:1.3), (whole head inside the frame:1.3), face clearly visible, long wavy blue hair, deep phoenix-like eyes, detailed face, completely nude, perky round breasts, firm breasts, tender pink nipples, small pale pink areola, (flat toned stomach:1.2), slim waist, (vertical navel:1.2), narrow innie navel, natural skin texture, soft daylight, (fully exposed vulva:1.3), vulva at the center of the frame, front view of the vulva, puffy vulva, plump outer labia, small neat inner labia, neat vertical slit, visible clitoral hood, small pink clitoris, glistening moist labia, slightly enlarged vaginal opening, view from between the legs toward the face
```

负向：

```text
score_4, score_5, score_6, 2girls, multiple girls, duplicate, twins, cloned face, extra person, extra arms, extra legs, extra limbs, blurry, lowres, plastic skin, doll-like, anime, cartoon, illustration, 3d render, extra fingers, bad hands, bad anatomy, deformed, watermark, text, logo, caucasian, western facial features, deep set eyes, heavy jawline, freckles, pale face, ghostly white skin, porcelain skin, overexposed face, white makeup, powdery face, mismatched skin tone, tan, tanned skin, dark skin, olive skin, suntan, sunburn, muddy skin, yellowish skin, clothes, dressed, bikini, bra, panties, swimsuit, sagging breasts, large dark areola, brown nipples, belly fat, chubby belly, protruding belly, bloated stomach, belly rolls, love handles, outie navel, deformed vulva, uneven labia, hairy vulva, hands covering the vulva, hands between the legs, hands on the floor, propped up on hands, cropped head, head out of frame, top of head cut off, face obscured, no face, looking away, standing, sitting, kneeling, on stomach, legs closed, child, loli, shota, underage, teen
```

种子：`1083946597`
