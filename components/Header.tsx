import Link from "next/link";
import { ACTIVE_CATEGORIES as CATEGORIES } from "@/lib/categories-active";
import { LOGO, PHONE, PHONE_HREF } from "@/lib/site";
import OpenManagerButton from "./OpenManagerButton";
const SHORT: Record<string, string> = { pendants: "Подвесные", ceiling: "Потолочные", outdoor: "Уличное", track: "Трековые" };
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-milk/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5">
        <Link href="/" aria-label="ИНТЕРЬЕР — на главную" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="header-logo" src={LOGO} alt="" className="h-9 w-auto" />
          <span className="font-display text-sm tracking-[0.25em] sm:text-base">ИНТЕРЬЕР</span>
        </Link>
        <div className="flex min-w-0 items-center gap-6">
          {PHONE && <a href={PHONE_HREF} className="whitespace-nowrap py-2 text-sm font-medium text-stone-500 hover:text-graphite sm:text-base">{PHONE}</a>}
          <OpenManagerButton className="hidden border-b border-dashed border-stone-400 text-sm text-stone-600 hover:text-graphite md:block">Обратный звонок</OpenManagerButton>
        </div>
      </div>
      <nav aria-label="Категории" className="border-t border-stone-200/70">
        <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto whitespace-nowrap px-4 py-3 text-sm">
          {CATEGORIES.map((c) => <Link key={c.slug} href={`/?category=${c.slug}#collection`} className="py-1 transition hover:text-accent">{SHORT[c.slug] ?? c.name}</Link>)}
          <Link href="/?badge=new#collection" className="ml-auto shrink-0 rounded-md bg-accent/10 px-3 py-1 font-medium text-accent">✦ Новинки</Link>
        </div>
      </nav>
    </header>
  );
}
