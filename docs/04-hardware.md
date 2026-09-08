# 硬件与升级

## 机器 A

- CPU：R5 5600 · GPU：RTX 2080 Super **8GB** · 内存 32GB
- 适合：Pony XL / SDXL + LoRA，默认 768 竖图
- 不适合当默认：全精度 Flux、本地视频
- 启动：`scripts/start-comfyui-2080s.ps1`（无 `--lowvram`）
- 页面档：`rtx2080s`

## 机器 B（文档撰写时用户坐的这台）

- CPU：R5 9600X · GPU：GTX 1660 Super **6GB** · 内存 64GB
- 适合：SD1.5 最稳；Pony/SDXL 仅 640 + `--lowvram`，会慢
- 不适合：Flux、视频
- 启动：`scripts/start-comfyui-1660s.ps1`（必须 `--lowvram`）
- 页面档：`gtx1660s`
- 64GB 内存只能让权重往内存卸，**救不了 6GB 显存 OOM**

## 代码里的默认值

见 `src/hardware.ts`。切换机子会改宽高、步数、CFG。

## 不够时买什么（用户问再强调）

| 目标 | 显存 | 例子 |
|------|------|------|
| 本地 Pony/SDXL 更舒服 | 8GB 已勉强，12GB 更好 | 3060 12G、4070 |
| Flux / CHROMA 常用 | **12–16GB** | 4060 Ti 16G、3080 12G |
| 本地图生视频 | **24GB** | 3090、4090 |

优先换 **1660S 那张卡**。9600X 和 64G 内存够用，先别为出图升级 CPU。

二手 12G/24G 注意电源和机箱。不要为 6GB 卡去堆「更大 Flux」。
