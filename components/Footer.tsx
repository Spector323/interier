import Link from "next/link";
import { ACTIVE_CATEGORIES } from "@/lib/categories-active";
import { LOGO, PHONE, PHONE_HREF, TELEGRAM, WHATSAPP } from "@/lib/site";
import OpenManagerButton from "./OpenManagerButton";
const h = "mb-4 text-xs uppercase tracking-[0.3em] text-stone-500";
const a = "inline-block py-1 transition hover:text-accent";
export default function Footer() {
  return (
    <footer className="bg-graphite text-sm text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2" aria-label="ИНТЕРЬЕР — на главную">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="" loading="lazy" className="h-9 w-auto" />
            <span className="font-display text-lg tracking-[0.25em] text-white">ИНТЕРЬЕР</span></Link>
          <p className="mt-4 max-w-xs leading-relaxed text-stone-400">Современное освещение для красивых и уютных интерьеров.</p>
        </div>
        <nav aria-label="Каталог"><p className={h}>Каталог</p>
          <ul className="space-y-1">{ACTIVE_CATEGORIES.map((c) => <li key={c.slug}><Link href={`/?category=${c.slug}#collection`} className={a}>{c.name}</Link></li>)}</ul></nav>
        <nav aria-label="Покупателям"><p className={h}>Покупателям</p>
          <ul className="space-y-1">
            <li><Link href="/installment" className={a}>Исламская рассрочка</Link></li>
            <li><Link href="/?badge=new#collection" className={a}>Новинки</Link></li>
            <li><Link href="/?badge=hit#collection" className={a}>Хиты продаж</Link></li>
            <li><Link href="/#consult" className={a}>Подбор освещения</Link></li></ul></nav>
        <div><p className={h}>Связь</p>
          <ul className="space-y-1">
            {PHONE && <li><a href={PHONE_HREF} className={`${a} text-base text-white`}>{PHONE}</a></li>}
            {WHATSAPP && <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className={a}>WhatsApp</a></li>}
            {TELEGRAM && <li><a href={`https://t.me/${TELEGRAM}`} target="_blank" rel="noopener noreferrer" className={a}>Telegram</a></li>}
          </ul>
          <OpenManagerButton className="mt-3 min-h-11 rounded-full border border-white/25 px-5 py-2.5 text-white transition hover:border-accent hover:text-accent">Написать менеджеру</OpenManagerButton>
        </div>
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 pb-24 text-xs text-stone-500 sm:flex-row sm:justify-between sm:pb-6">
        <span>© 2026 ИНТЕРЬЕР. Все права защищены.</span><span>Фото товаров на сайте — собственность магазина.</span></div></div>
    </footer>);
}
