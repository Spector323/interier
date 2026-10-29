"use client";
import { useState } from "react";
import type { Product } from "@/types/product";
import DownloadMenu from "./DownloadMenu";
// Галерея страницы товара: основное фото + миниатюры. Подписи «выключен / включён» для пары фото каталога.
const label = (p: Product, src: string, i: number) => src === p.image ? "Выключен" : src === p.hoverImage ? "Включён" : `Фото ${i + 1}`;
export default function ProductGallery({ p }: { p: Product }) {
  const imgs = p.images.length ? p.images : [p.image];
  const [i, setI] = useState(0); const [broken, setBroken] = useState<Record<string, boolean>>({});
  const src = imgs[i];
  return (
    <div className="min-w-0">
      <div className="relative aspect-[4/5] select-none overflow-hidden rounded-3xl bg-sand [-webkit-touch-callout:none]" onContextMenu={(e) => e.preventDefault()}>
        {broken[src] ? <p className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-stone-500">Фото временно недоступно</p>
          : /* eslint-disable-next-line @next/next/no-img-element */
          <img key={src} src={src} alt={`${p.name}: ${label(p, src, i).toLowerCase()}`} draggable={false} decoding="async" fetchPriority="high" onError={() => setBroken((b) => ({ ...b, [src]: true }))} className="absolute inset-0 h-full w-full object-cover" />}
        {p.badge && <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium uppercase tracking-wider text-white">{p.badge === "new" ? "Новинка" : "Хит"}</span>}
        <DownloadMenu p={p} className="absolute bottom-4 right-4" />
      </div>
      {imgs.length > 1 && <div role="tablist" aria-label="Фотографии товара" className="mt-3 flex gap-3">
        {imgs.map((s, k) => (
          <button key={s} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)}
            className={`flex min-w-0 flex-col items-center gap-1.5 text-xs ${k === i ? "text-accent" : "text-stone-500 hover:text-graphite"}`}>
            <span className={`relative block h-20 w-16 overflow-hidden rounded-2xl bg-sand ring-2 transition sm:h-24 sm:w-20 ${k === i ? "ring-accent" : "ring-transparent"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s} alt="" loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-cover" /></span>
            {label(p, s, k)}</button>))}
      </div>}
      {p.illustrative && <p className="mt-3 text-xs text-stone-500">Изображение — иллюстрация. Внешний вид реального товара может отличаться; уточните у менеджера.</p>}
    </div>);
}
