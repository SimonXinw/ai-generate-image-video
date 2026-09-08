# 已知缺口（实现前先读这里）

文档写「能跑」= SD1.5 / Pony / SDXL 文生图。仓库名带 video，**视频管线未做**。

## 会踩坑（已修一部分）

| 项 | 状态 |
|----|------|
| 负向提示词含 child/loli 导致永远拦截 | 已改为只扫正向；短英文按词边界 |
| start 脚本调用系统 `python` 而不是 venv | 已优先 `vendor/ComfyUI/venv\Scripts\python.exe` |
| 报错指向不存在的 `start-comfyui.ps1` | 已改文案 |
| `npm run build` 用了 `tsc -b` 但无工程引用 | 已改为 `tsc --noEmit` |

## 仍未做（按需再开）

1. **页面档 ≠ 真 GPU**：选 2080S 不会检查你是不是插着 1660S。选错只会分辨率过大然后 OOM。
2. **无进度条 / WebSocket**：只轮询 history，1660S 慢会像卡住，3 分钟超时。
3. **无种子显示**：seed=-1 随机，出了好图无法一键复现（应回显实际 seed）。
4. **CLIP skip / 采样器写死**：euler_a + skip 2，写实 SD1.5 不理想。
5. **默认正向是 Pony 句**：1660S 用 1.5 时用户容易忘改。
6. **无 extra_model_paths 自动安装**：只有 example 文件。
7. **setup-comfyui.ps1 不建 venv、不装 torch**：仍要按 `01-setup.md` 手做。可以后合成一键脚本。
8. **无模型完整性记录**：没有哈希/文件名清单进 git（有意的）。用 `05-inventory.md`。
9. **Flux / CHROMA / 视频**：需要别的 loader 节点，当前 `buildTxt2ImgPrompt` 不支持。
10. **手机访问**：Vite `host: 0.0.0.0`，但 Comfy 只听 `127.0.0.1`。**同一局域网用手机打开 5173，出图仍会失败**（图片 URL 指向电脑的 127.0.0.1）。要对手机：Comfy 改 `--listen 0.0.0.0`，且 `VITE_COMFY_URL` 改成电脑局域网 IP。这是常见坑，尚未做成开关。
11. **电源与散热**：1660S + 长时间 SDXL lowvram 会把权重打到 64G 内存，注意虚拟内存盘符空间。
12. **安全词过粗**：无法替代人工；只是挡明显词。

## 建议的实现顺序（以后）

1. 一键 setup（venv + torch + 检测 GPU 选 start 脚本）。
2. 手机访问：listen 地址 + 可配置 Comfy URL。
3. 回显 seed、进度、超时随机档变化。
4. 按 checkpoint 名称猜测 SD1.5 vs Pony，切换默认提示词。
5. 真要 Flux 再加 GGUF 节点，且只给 12G+ 机器。
6. 视频放到换 24G 显卡之后，不要在 6G/8G 上投入。
