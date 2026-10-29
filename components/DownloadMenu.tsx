"use client";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types/product";
import { downloadErrorText, downloadName, downloadWithWatermark } from "@/lib/download";
// Кнопка «Скачать фото» с выбором: выключен / включён. В файл добавляется водяной знак (lib/watermark.config.ts).
export default function DownloadMenu({ p, className = "" }: { p: Product; className?: string }) {
  const [menu, setMenu] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menu && !err) return;
    const out = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) { setMenu(false); setErr(""); } };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); setErr(""); } };
    document.addEventListener("pointerdown", out); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", out); document.removeEventListener("keydown", esc); };
  }, [menu, err]);
  if (p.downloadable === false) return null;
  const dl = async (src: string, st: "on" | "off") => { setBusy(true); setErr(""); try { await downloadWithWatermark(src, downloadName(p.slug, st)); setMenu(false); } catch (e) { setErr(downloadErrorText(e)); } finally { setBusy(false); } };
  const item = "block w-full rounded-xl px-3 py-2.5 text-left hover:bg-blush disabled:opacity-60";
  return (
    <div ref={box} className={className}>
      <button type="button" onClick={() => { setMenu(!menu); setErr(""); }} aria-expanded={menu} aria-label={`Скачать фото: ${p.name}`} title="Скачать фото"
        className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-graphite shadow transition hover:text-accent">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg></button>
      {(menu || err) && <div role="menu" className="absolute bottom-14 right-0 z-10 w-48 rounded-2xl bg-white p-1 text-sm shadow-xl ring-1 ring-black/5">
        {menu && <button type="button" role="menuitem" disabled={busy} onClick={() => dl(p.image, "off")} className={item}>{busy ? "Готовим файл…" : "Скачать: выключен"}</button>}
        {menu && p.hoverImage && <button type="button" role="menuitem" disabled={busy} onClick={() => dl(p.hoverImage as string, "on")} className={item}>Скачать: включён</button>}
        {err && <p role="alert" className="px-3 py-2 text-accent">{err}</p>}</div>}
    </div>);
}
