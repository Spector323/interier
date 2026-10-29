import Link from "next/link";
import { ACTIVE_CATEGORIES as CATEGORIES } from "@/lib/categories-active";
const B = (x: number, y: number) => `M${x - 3} ${y}a3 3 0 1 0 6 0a3 3 0 1 0-6 0`;
const ICONS: Record<string, string> = {
  chandeliers: `M32 4v12M14 24c6 10 30 10 36 0M14 24h36M20 26v8M32 28v10M44 26v8${B(20, 38)}${B(32, 42)}${B(44, 38)}`,
  pendants: "M32 4v18M14 46c0-14 8-24 18-24s18 10 18 24zM24 54h16",
  ceiling: "M8 10h48M14 10v6h36v-6M18 16c0 12 6 20 14 20s14-8 14-20M22 46l-4 6M32 46v8M42 46l4 6",
  sconces: "M12 12v40M12 32h14M28 32a12 12 0 1 0 24 0a12 12 0 1 0-24 0",
  floor: "M22 6h20l6 18H16zM32 24v30M22 56h20",
  table: "M22 12h20l6 16H16zM32 28v22M22 54h20",
  led: "M32 6a14 14 0 0 0-7 26v8h14v-8A14 14 0 0 0 32 6zM26 46h12M28 52h8",
  track: "M6 10h52M18 10v10M32 10v10M46 10v10M13 20h10l-3 12h-4zM27 20h10l-3 12h-4zM41 20h10l-3 12h-4z",
  outlets: "M12 12h40v40H12zM32 32m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0M27 30v4M37 30v4",
  lamps: "M32 6a14 14 0 0 0-7 26v8h14v-8A14 14 0 0 0 32 6zM26 46h12M28 52h8",
  floodlights: "M10 20h44v24H10zM18 28h28M18 36h28M32 44v10M24 54h16",
  outdoor: "M32 4v6M24 10h16l4 6H20zM24 16v28h16V16M20 44h24M32 44v8M26 54h12",
};
const PHOTOS = new Set(["chandeliers", "pendants", "sconces", "floor", "table", "track", "outdoor", "outlets"]);
export default function CategoryStrip() {
  return (
    <ul className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 lg:mx-0 lg:justify-between lg:overflow-visible lg:px-0">
      {CATEGORIES.map((c) => (
        <li key={c.slug} className="w-28 shrink-0 snap-start sm:w-32">
          <Link href={`/?category=${c.slug}#collection`} className="group flex flex-col items-center gap-3 text-center text-sm">
            {PHOTOS.has(c.slug) ? (
              <span className="relative block h-24 w-24 overflow-hidden rounded-3xl bg-sand shadow-sm ring-1 ring-black/5 transition duration-500 group-hover:scale-105 group-hover:shadow-[0_10px_30px_rgba(226,67,31,.45)] sm:h-28 sm:w-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/categories/${c.slug}.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/categories/${c.slug}-on.jpg`} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100" />
              </span>
            ) : (
              <span className="grid h-24 w-24 place-items-center rounded-3xl bg-blush text-graphite transition group-hover:text-accent sm:h-28 sm:w-28">
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS[c.slug]} /></svg>
              </span>
            )}
            <span className="leading-tight transition group-hover:text-accent">{c.name}</span>
          </Link>
        </li>))}
    </ul>
  );
}
