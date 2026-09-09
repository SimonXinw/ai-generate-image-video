# 参考脸锁定（IP-Adapter FaceID）

这不是现场训练 LoRA，而是每次生成时从一张参考图提取成年人脸特征。
项目使用 `ComfyUI_IPAdapter_plus`，参考图与推理均只在本机处理。

## 双机方案

| 机器 | 基础模型 | 脸锁定方案 | 默认值 |
|------|----------|------------|--------|
| GTX 1660S 6GB | DreamShaper 8 / SD1.5 | FaceID SD1.5 | 强度 0.75，结束 0.90 |
| RTX 2080S 8GB | Pony / CyberRealistic Pony / SDXL | FaceID Plus V2 SDXL | 强度 0.80，结束 0.90 |

1660S 使用基础 FaceID，减少额外权重和计算压力。2080S 使用 Plus V2，
同时利用人脸 ID 与 CLIP 图像特征。Pony 是 SDXL 微调，节点和权重架构兼容，
但 FaceID Plus V2 SDXL 本身是实验模型，写实一致性通常优于二次元。

未选择参考图时仍走原来的纯文生图工作流，不增加显存占用。

## 安装

仓库根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-face-lock.ps1 -Hardware all
```

也可以每台机器只安装对应文件：

```powershell
# 1660S
powershell -ExecutionPolicy Bypass -File .\scripts\setup-face-lock.ps1 -Hardware 1660s

# 2080S
powershell -ExecutionPolicy Bypass -File .\scripts\setup-face-lock.ps1 -Hardware 2080s
```

脚本会安装并钉死以下内容：

- `ComfyUI_IPAdapter_plus` commit
  `a0f451a5113cf9becb0847b92884cb10cbdec0ef`
- InsightFace 0.7.3、ONNX Runtime 1.20.1、`buffalo_l`
- CLIP ViT-H 图像编码器（两套共用）
- 1660S：`ip-adapter-faceid_sd15.bin` 与配套 LoRA
- 2080S：`ip-adapter-faceid-plusv2_sdxl.bin` 与配套 LoRA

模型会进行体积和 SHA-256 校验。安装完成后必须重启 ComfyUI。

## 页面使用

1. 页面顶部选择真实机器。
2. 选择与机器匹配的 checkpoint。
3. 在“参考脸锁定”中选一张清晰、单人、正脸、无遮挡图片。
4. 打开“启用参考脸锁定”后生成。
5. 不够像时逐步增加身份强度；脸部僵硬或提示词失效时降低强度或结束比例。

参考图只允许使用本人或已取得明确授权的成年人照片。浏览器会把图片上传到
`vendor/ComfyUI/input/`，不会发送到在线平台；不需要时可手动删除。

## 烟测

先准备一张成年人参考脸图，再启动对应 ComfyUI：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-face-lock.ps1 `
  -Hardware 1660s -ReferenceImage C:\path\adult-face.jpg
```

2080S 上：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-face-lock.ps1 `
  -Hardware 2080s -ReferenceImage C:\path\adult-face.jpg
```

烟测会复制参考图到本机 ComfyUI 输入目录，并生成一张安全成人肖像。

2026-09-09 在 **GTX 1660 Super** 上已验证：`FACEID` + DreamShaper 8，512×768，
`--lowvram`，InsightFace `CPU`，约 26 秒出图，无 OOM。
本机没有 2080S 显卡，**FaceID Plus V2 SDXL 只校验了文件体积/哈希和节点注册**，
真正出图要在 8GB 那台机用 `start-comfyui-2080s.ps1` 再跑上面的 2080s 烟测。

InsightFace 安装后会改掉 `insightface/app/__init__.py`，不再导入会触发
NumPy ABI 报错的 `mask_renderer`；FaceID 只用 `FaceAnalysis`。

## 为什么暂不选其他方案

- InstantID：只面向 SDXL，额外 ControlNet 与 InsightFace；1660S 不合适，
  2080S 叠加 Pony 时也更容易 OOM。
- PuLID：主要面向 SDXL/Flux，显存与版本要求更高。
- ReActor：适合生成后精确换脸，但不是生成阶段身份条件；以后可作为二次精修。
- 角色 LoRA：需要收集和标注多张授权图片并单独训练，不属于“一张图锁脸”。
