/**
 * 图片来自 ComfyUI 的 8188 端口，和前端的 5173 不同源。
 * 浏览器对跨源链接会忽略 <a download>，直接当导航处理 —— 结果是整页跳到图片，
 * 出图历史和参数全丢。所以必须先 fetch 成 blob（ComfyUI 已开 --enable-cors-header），
 * 再用同源的 blob: URL 触发真正的“另存为”。
 */
export async function downloadImage(
  url: string,
  filename: string,
): Promise<boolean> {
  let objectUrl = "";
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`下载失败 ${res.status}`);
    objectUrl = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  } catch {
    return false;
  } finally {
    // 立刻 revoke 会让 Chrome 拿不到数据，留一手再回收
    if (objectUrl) window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
  }
}