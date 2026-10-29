import { WATERMARK as W } from "./watermark.config";
// Водяной знак появляется только в скачанном файле: рисуем фото на canvas и дописываем надпись внизу.
export type DownloadError = "not_allowed" | "load" | "canvas" | "encode";
export class WatermarkError extends Error { constructor(public code: DownloadError) { super(code); } }
export const isWatermarkAllowed = (src: string) => {
  try { const u = new URL(src, window.location.origin); return u.origin === window.location.origin && W.allowedPrefixes.some((p) => u.pathname.startsWith(p)); } catch { return false; }
};
export async function renderWatermarked(src: string): Promise<Blob> {
  if (!isWatermarkAllowed(src)) throw new WatermarkError("not_allowed");
  const img = new Image(); img.decoding = "async";
  await new Promise<void>((ok, fail) => { img.onload = () => ok(); img.onerror = () => fail(new WatermarkError("load")); img.src = src; });
  const w = img.naturalWidth, h = img.naturalHeight; if (!w || !h) throw new WatermarkError("load");
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d"); if (!x) throw new WatermarkError("canvas");
  x.drawImage(img, 0, 0);
  const gh = Math.round(h * W.bandRatio), g = x.createLinearGradient(0, h - gh, 0, h);
  g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${W.bandOpacity})`); x.fillStyle = g; x.fillRect(0, h - gh, w, gh);
  let fs = Math.min(W.maxSize, Math.max(W.minSize, Math.round(w * W.sizeRatio)));
  const measure = () => { x.font = `${W.weight} ${fs}px ${W.font}`; const ws = [...W.text].map((ch) => x.measureText(ch).width); return { ws, total: ws.reduce((a, b) => a + b, 0) + fs * W.letterSpacing * (ws.length - 1) }; };
  let m = measure(); while (m.total > w * 0.9 && fs > 6) { fs = Math.floor(fs * 0.85); m = measure(); } // узкие фото — уменьшаем, чтобы текст не обрезался
  x.textBaseline = "middle"; x.textAlign = "left";
  let px = (w - m.total) / 2; const py = h - Math.max(gh * 0.42, fs * 0.7);
  x.shadowColor = W.shadow; x.shadowBlur = fs * 0.2; x.fillStyle = W.color;
  [...W.text].forEach((ch, i) => { x.fillText(ch, px, py); px += m.ws[i] + fs * W.letterSpacing; });
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", W.quality)); if (!blob) throw new WatermarkError("encode");
  return blob;
}
export async function downloadWithWatermark(src: string, filename: string) {
  const blob = await renderWatermarked(src);
  const url = URL.createObjectURL(blob), a = document.createElement("a"); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
}
export const downloadErrorText = (e: unknown) => {
  const code = e instanceof WatermarkError ? e.code : "load";
  return code === "not_allowed" ? "Это фото нельзя скачать." : code === "load" ? "Не удалось загрузить фото. Проверьте соединение." : "Браузер не смог подготовить файл.";
};
export const downloadName = (slug: string, state: "on" | "off") => `${slug}-${state}-${W.fileSuffix}.jpg`;
