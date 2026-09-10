# 本机记录（每台电脑填一份）

模型不进 git。每台机自己记：装到哪了、下了什么、上次能不能出图。
换电脑怎么识别 GPU、跑哪条下载脚本：见 [`docs/13-new-machine.md`](13-new-machine.md)。

复制本文件到 `docs/STATUS-1660S.md` / `docs/STATUS-2080S.md` 再填（这两份可以 gitignore，见文末）。也可以只改下面的模板。

## 模板

```text
机器：1660S / 2080S
日期：
nvidia-smi 显存 / 驱动：
Python：
ComfyUI 路径：vendor/ComfyUI（v0.35.0 / 8188）
venv 能否 torch.cuda：True/False
磁盘剩余：

checkpoints（文件名 + 约体积 + 类型 SD1.5/Pony/SDXL）：
- 

loras：
- 

上次出图：成功 / OOM / 超时
分辨率：
用的 checkpoint：
备注：
```

## 双机怎么共用模型

不要把权重拷进 git。任选：

1. 移动硬盘：两台都指到同一目录（仓库根目录 `extra_model_paths.yaml.example`）。
2. 局域网共享文件夹（机械盘即可，首次加载会慢）。
3. 各下一份：1660S 只留 SD1.5；2080S 再留 Pony。

改完 yaml 必须重启 ComfyUI。

## 建议 gitignore 的本机记录

若不想把「我下了哪些 NSFW 文件名」推进远程，把 `docs/STATUS-*.md` 加入 `.gitignore`。仓库里只保留本模板。
