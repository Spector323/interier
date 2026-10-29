import Link from "next/link";
import { products, getProduct } from "@/data/products";
import { PHONE, PHONE_HREF } from "@/lib/site";
import ProductCard from "@/components/ProductCard";
import CategoryStrip from "@/components/CategoryStrip";
import { Suspense } from "react";
import OpenManagerButton from "@/components/OpenManagerButton";
import { INSTALLMENT } from "@/data/installment";
import { BRANDS } from "@/data/brands";
import CollectionBrowser from "@/components/CollectionBrowser";
import { ACTIVE_CATEGORIES, PLANNED_CATEGORIES } from "@/lib/categories-active";
import { materialsOf } from "@/lib/catalog/filter";
const ROOMS = [["Гостиная", "arco", "Тёплый свет для вечеров с близкими"], ["Спальня", "vela", "Мягкое освещение для спокойного отдыха"], ["Столовая", "aurora", "Свет, в котором приятно собираться"]] as const;
const PERKS = [["Подбор под ваш интерьер", "Поможем выбрать свет по фото комнаты"], ["Гарантия качества", "На всё освещение — официальная гарантия"], ["Доставка", "Аккуратно привезём и поможем с установкой"], ["Консультация", "Ответим на вопросы по телефону"]];
export default function Home() {
  const colors = [...new Set(products.map((p) => p.color))].sort();
  const materials = [...new Set(products.flatMap(materialsOf))].sort();
  return (<>
    <section className="bg-gradient-to-b from-milk via-blush/60 to-milk">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.35em] text-accent">Магазин освещения</p>
          <h1 className="font-display text-[2.1rem] font-normal leading-[1.1] min-[380px]:text-4xl sm:text-6xl">Свет, который создаёт атмосферу</h1>
          <p className="mt-6 max-w-md text-lg text-stone-600">Современное освещение для красивых и уютных интерьеров</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="#collection" className="rounded-full bg-accent px-7 py-3 font-medium text-white transition hover:bg-[#c93816]">Смотреть каталог</Link>
            <Link href="#consult" className="rounded-full border border-graphite/30 px-7 py-3 transition hover:border-accent hover:text-accent">Подобрать освещение</Link></div></div>
        <div className="mx-auto w-full max-w-md lg:max-w-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-orbit.webp" alt="Кольцевая люстра с красным и белым дисками" className="float w-full drop-shadow-[0_30px_35px_rgba(0,0,0,.18)]" /></div>
      </div></section>
    <section id="categories" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14"><h2 className="font-display mb-8 text-3xl">Категории освещения</h2><CategoryStrip />
      {PLANNED_CATEGORIES.length > 0 && <p className="mt-6 text-sm text-stone-500">Скоро в ассортименте: {PLANNED_CATEGORIES.map((c) => c.name).join(", ")}.</p>}</section>
    <section id="collection" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-10">
      <Suspense fallback={<div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>}>
        <CollectionBrowser products={products} categories={ACTIVE_CATEGORIES} colors={colors} materials={materials} /></Suspense></section>
    <section className="mx-auto max-w-7xl px-4 py-16"><h2 className="font-display mb-8 text-3xl">Свет для каждой комнаты</h2>
      <div className="grid gap-4 md:grid-cols-3">{ROOMS.map(([name, slug, text]) => { const p = getProduct(slug); return (
        <div key={name} className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-graphite md:aspect-[3/4]">
          {p && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.hoverImage ?? p.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20 text-white"><h3 className="font-display text-2xl">{name}</h3><p className="mt-1 text-sm text-stone-200">{text}</p></div></div>); })}</div></section>
    <section className="bg-graphite py-20 text-center text-white"><div className="mx-auto max-w-3xl px-4"><div className="mx-auto mb-8 h-px w-16 bg-accent" />
      <p className="font-display text-2xl leading-snug sm:text-4xl">Мы создаём пространство, в котором свет становится частью интерьера.</p></div></section>
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">{PERKS.map(([t, d]) => (
      <div key={t}><div className="mb-4 h-px w-10 bg-accent" /><h3 className="font-display text-xl">{t}</h3><p className="mt-2 text-sm text-stone-600">{d}</p></div>))}</section>
    <section className="mx-auto max-w-7xl px-4 pb-14 text-center"><p className="text-xs uppercase tracking-[0.35em] text-stone-500">Бренды и поставщики</p>
      <ul className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-4 font-display text-xl text-stone-400 sm:text-2xl">{BRANDS.map((b) => <li key={b}>{b}</li>)}</ul></section>
    <section id="installment" className="mx-auto max-w-7xl px-4 pb-16"><div className="grid gap-8 rounded-[2rem] bg-graphite p-8 text-white md:grid-cols-2 md:p-12">
      <div><p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">Рассрочка</p><h2 className="font-display text-3xl sm:text-4xl">{INSTALLMENT.title}</h2><p className="mt-4 max-w-md text-stone-300">{INSTALLMENT.lead}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/installment" className="flex min-h-12 items-center justify-center rounded-full bg-accent px-8 py-3 font-medium text-white transition hover:bg-[#c93816]">Подробнее</Link>
        <OpenManagerButton context={{ topic: "Исламская рассрочка" }} className="min-h-12 rounded-full border border-white/30 px-8 py-3 transition hover:border-accent">Спросить менеджера</OpenManagerButton></div></div>
      <ul className="space-y-4 self-center text-stone-200">
        {INSTALLMENT.confirmed && INSTALLMENT.terms.map((t) => <li key={t.label} className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-stone-400">{t.label}</span><span className="font-medium">{t.value}</span></li>)}
        {INSTALLMENT.notes.map((n) => <li key={n} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{n}</li>)}</ul></div></section>
    <section id="consult" className="scroll-mt-28 px-4 pb-20"><div className="mx-auto max-w-5xl rounded-[2rem] bg-blush px-6 py-14 text-center">
      <h2 className="font-display text-3xl sm:text-4xl">Подберём свет для вашего интерьера</h2>
      <p className="mx-auto mt-4 max-w-lg text-stone-600">Напишите или позвоните нам — поможем выбрать светильники под вашу комнату и стиль.</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">{PHONE && <a href={PHONE_HREF} className="inline-flex min-h-12 items-center rounded-full bg-accent px-8 py-3 font-medium text-white transition hover:bg-[#c93816]">{PHONE}</a>}
        <OpenManagerButton className={`min-h-12 rounded-full px-8 py-3 font-medium transition ${PHONE ? "border border-graphite/30 hover:border-accent hover:text-accent" : "bg-accent text-white hover:bg-[#c93816]"}`}>Оставить заявку</OpenManagerButton></div></div></section>
  </>);
}
