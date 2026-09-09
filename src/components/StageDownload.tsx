import { useState } from "react";
import { downloadImage } from "../lib/download";
import { imageFileName, sourceFileName } from "../lib/file-name";
import type { MouseEvent } from "react";
import type { StageDownloadProps } from "../ui-types";

export function StageDownload({ imageUrl, meta }: StageDownloadProps) {
  const [state, setState] = useState<"idle" | "busy" | "fail">("idle");
  const fileName = meta
    ? imageFileName(meta, imageUrl)
    : sourceFileName(imageUrl);

  const onClick = async (ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    if (state === "busy") return;
    setState("busy");
    const ok = await downloadImage(imageUrl, fileName);
    setState(ok ? "idle" : "fail");
    if (!ok) {
      // 兜底：新标签打开，右键另存为；绝不在当前标签跳走
      window.open(imageUrl, "_blank", "noopener");
      window.setTimeout(() => setState("idle"), 2000);
    }
  };

  return (
    <a
      className="stage-dl"
      href={imageUrl}
      download={fileName}
      target="_blank"
      rel="noopener"
      title={`下载到本地：${fileName}`}
      onClick={(ev) => void onClick(ev)}
    >
      {state === "busy" ? "下载中…" : state === "fail" ? "已新开标签" : "下载"}
    </a>
  );
}
