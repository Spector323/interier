"use client";
import Link from "next/link";
import type { Product } from "@/types/product";
import { CATEGORIES } from "@/data/categories";
import { rub } from "@/lib/format";
import DownloadMenu from "./DownloadMenu";
export default function ProductCard({ p }: { p: Product }) {
  const cat = CATEGORIES.find((c) => c.slug === p.category)?.name; const href = `/catalog/${p.slug}`;
  return (
    <article className="group min-w-0">
      <div className="relative select-none [-webkit-touch-callout:none]">
        <Link href={href} aria-label={p.name} onContextMenu={(e) => e.preventDefault()} className="relative block aspect-[4/5] overflow-hidden rounded-3xl bg-sand transition duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_14px_50px_rgba(226,67,31,.4)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={`${p.name}, выключен`} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
          {p.hoverImage && /* eslint-disable-next-line @next/next/no-img-element */
            <img src={p.hoverImage} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100" />}
          {p.badge && <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-white">{p.badge === "new" ? "Новинка" : "Хит"}</span>}
        </Link>
        <DownloadMenu p={p} className="absolute bottom-3 right-3 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100" />
      </div>
      <p className="mt-4 truncate text-[11px] uppercase tracking-[0.2em] text-stone-500">{cat}</p>
      <h3 className="mt-1 break-words text-sm font-medium leading-snug sm:text-base"><Link href={href} className="hover:text-accent">{p.name}</Link></h3>
      {p.shortDescription && <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-stone-500 sm:text-sm">{p.shortDescription}</p>}
      <div className="mt-2 flex flex-wrap items-baseline gap-x-2"><span className="font-semibold">{rub(p.price)}</span>{p.oldPrice && <s className="text-xs text-stone-400">{rub(p.oldPrice)}</s>}</div>
    </article>
  );
}
