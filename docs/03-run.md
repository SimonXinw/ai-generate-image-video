# 启动与出图

前置：`docs/01-setup.md` 完成。有模型才能出图（`docs/02-models.md`）。

## 1. 启动 ComfyUI（先开这个）

在仓库根目录。用 **已激活的 ComfyUI venv** 的 `python`。

若脚本里的 `python` 不是 venv，先：

```powershell
cd vendor\ComfyUI
.\venv\Scripts\Activate.ps1
cd ..\..
```

机器 A（2080S）：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-comfyui-2080s.ps1
```

机器 B（1660S）：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-comfyui-1660s.ps1
```

成功标志：终端出现 `To see the GUI go to: http://127.0.0.1:8188`。  
脚本会优先用 `vendor/ComfyUI/venv\Scripts\python.exe`。  
本仓库前端才是主界面；8188 是 API + 原生 Comfy。

同一 WiFi 用手机打开 5173 **还不够**：见 `docs/07-known-gaps.md` 第 10 条。

保持该窗口开着。

## 2. 启动本仓库前端

另开终端，仓库根目录：

```powershell
npm install
npm run dev
```

打开 `http://127.0.0.1:5173`。

## 3. 页面操作

1. 满 18 岁确认。
2. 顶部切到当前机子（2080 Super 或 1660 Super），分辨率会跟着变，不要混用。
3. 选 checkpoint（及可选 LoRA）。
4. 写提示词 → 开始生成。图显示在下方，可下载。

Comfy 未开时页面会提示先跑 start 脚本。

## 4. 自检

- 浏览器打开 `http://127.0.0.1:8188` 能进 Comfy。
- 前端状态行是绿色「已连接」。
- checkpoint 下拉非空。
- 出一张小图：1660S 用竖图默认即可，OOM 则再降分辨率。

## 5. 故障

| 现象 | 处理 |
|------|------|
| 连接失败 | Comfy 没开、端口不是 8188、防火墙 |
| 跨域 / CORS | 确认 start 脚本带 `--enable-cors-header` |
| CUDA OOM | 用 1660S 脚本；降分辨率；去掉 LoRA；换 SD1.5 |
| 排队失败 / 无图 | checkpoint 文件损坏或不是 SD1.5/SDXL 图 |
| 生成超时 | 1660S + Pony 可能超过 3 分钟，可加大 `waitForImage` 超时 |

## 环境变量

复制 `.env.example` 为 `.env`（可选）。默认 `VITE_COMFY_URL=http://127.0.0.1:8188`。
