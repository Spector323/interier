"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { filterProducts } from "@/lib/catalog/filter";
import { decodeImage, photoErrorText, searchByPhoto, validatePhoto, type PhotoResult } from "@/lib/photo-search";
type F = { q: string; category: string; badge: string; sort: string; color: string; material: string; min: string; max: string; discount: string; premium: string };
const EMPTY: F = { q: "", category: "", badge: "", sort: "", color: "", material: "", min: "", max: "", discount: "", premium: "" };
const KEYS = Object.keys(EMPTY) as (keyof F)[];
type Getter = { get(name: string): string | null };
const parse = (sp: Getter): F => { const f = { ...EMPTY }; for (const k of KEYS) f[k] = sp.get(k) ?? ""; return f; };
const toQuery = (f: F) => { const u = new URLSearchParams(); for (const k of KEYS) if (f[k]) u.set(k, f[k]); return u.toString(); };
const PAGE = 24; // сколько карточек показываем сразу; дальше — «Показать ещё» (для внешнего API — серверная пагинация)
const SORTS: Record<string, string> = { asc: "Сначала дешевле", desc: "Сначала дороже" };
// Образцы цвета для кружков в фильтре; неизвестный цвет — нейтральный серый
const SWATCH: Record<string, string> = { "Белый": "#F7F5F0", "Молочный": "#EFE6D6", "Золото": "#C9A15B", "Чёрный": "#1C1C1E", "Графит": "#55555B", "Орех": "#7A5233" };
const swatch = (c: string) => SWATCH[c] ?? "#9A9A9F";
// Стили тёмной панели (стекло поверх фона)
const glass = "border border-white/15 bg-black/35 text-white backdrop-blur-md transition hover:border-white/35";
const ctl = `relative flex h-12 items-center gap-2.5 rounded-xl px-4 text-sm ${glass}`;
const tog = (on: boolean) => `flex h-12 shrink-0 lg:flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm backdrop-blur-md transition ${on ? "border border-accent bg-accent/20 text-white shadow-[0_0_20px_rgba(226,67,31,.35)]" : "border border-white/15 bg-black/35 text-white hover:border-white/35"}`;
const overlay = "absolute inset-0 h-full w-full cursor-pointer opacity-0"; // нативный select поверх кастомной кнопки — работает с клавиатурой и на телефоне
const num = "w-full min-w-0 rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-white outline-none placeholder:text-stone-400 focus:border-accent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";
const chip = (on: boolean) => `min-h-11 rounded-full border px-4 py-2 text-sm transition ${on ? "border-accent bg-accent/10 text-accent" : "border-stone-300 bg-white hover:border-graphite"}`;
const field = "min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-base outline-none focus:border-accent";
const Chevron = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ml-auto shrink-0 opacity-80"><path d="M6 9l6 6 6-6" /></svg>;
const I = ({ d, fill = false, className = "" }: { d: string; fill?: boolean; className?: string }) =>
  <svg width="18" height="18" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`shrink-0 ${className}`}><path d={d} /></svg>;
const ICON = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  fire: "M12 2c1 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.2 1-3.8 2.2-5 .2 1.6 1 2.6 1.8 3C11 8 11 5 12 2z",
  star: "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z",
  pct: "M19 5L5 19M7 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  gem: "M6 3h12l4 6-10 12L2 9zM2 9h20M12 21L8 9l4-6 4 6z",
  sort: "M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  sliders: "M4 6h16M7 12h10M10 18h4",
};
type Photo = { url: string; result: PhotoResult };
type Props = { products: Product[]; categories: { slug: string; name: string }[]; colors: string[]; materials: string[] };
export default function CollectionBrowser({ products, categories, colors, materials }: Props) {
  const sp = useSearchParams();
  const [f, setF] = useState<F>(() => parse(sp));
  const last = useRef(toQuery(parse(sp)));
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<Photo | null>(null); const [photoErr, setPhotoErr] = useState(""); const [photoBusy, setPhotoBusy] = useState(false);
  const [drawer, setDrawer] = useState(false); const [shown, setShown] = useState(PAGE);
  const urlRef = useRef<string | null>(null); const reqId = useRef(0);
  const setPhotoUrl = (u: string | null) => { if (urlRef.current && urlRef.current !== u) URL.revokeObjectURL(urlRef.current); urlRef.current = u; };
  useEffect(() => () => setPhotoUrl(null), []); // освобождаем временный URL при уходе со страницы
  const pickPhoto = async (file?: File) => {
    if (!file) return; const id = ++reqId.current; setPhotoErr("");
    let url: string | null = null;
    try {
      validatePhoto(file); setPhotoBusy(true); url = URL.createObjectURL(file);
      const img = await decodeImage(url);
      const result = await searchByPhoto(file, img, products.map((p) => p.slug));
      if (id !== reqId.current) { URL.revokeObjectURL(url); return; } // пока считали, выбрали другое фото
      setPhotoUrl(url); setPhoto({ url, result });
    } catch (e) { if (url) URL.revokeObjectURL(url); if (id === reqId.current) setPhotoErr(photoErrorText(e)); }
    finally { if (id === reqId.current) setPhotoBusy(false); }
  };
  const clearPhoto = () => { reqId.current++; setPhotoUrl(null); setPhoto(null); setPhotoErr(""); setPhotoBusy(false); };
  const key = sp.toString();
  useEffect(() => { // переход по ссылкам из хедера / плиток категорий
    const next = parse(sp); const nk = toQuery(next);
    if (nk !== last.current) { last.current = nk; setF(next); setShown(PAGE); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => { // выдвижная панель: блокируем прокрутку фона и закрываем по Esc
    if (!drawer) return; const k = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.body.style.overflow = "hidden"; window.addEventListener("keydown", k);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", k); };
  }, [drawer]);
  const update = (patch: Partial<F>) => { // без перезагрузки страницы
    const n = { ...f, ...patch }; setF(n); setShown(PAGE); const qs = toQuery(n); last.current = qs;
    window.history.replaceState(window.history.state, "", window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash);
  };
  const cat = categories.find((c) => c.slug === f.category);
  const catName = (s: string) => categories.find((c) => c.slug === s)?.name ?? "";
  const minV = Number(f.min) || 0, maxV = Number(f.max) || 0;
  let list = filterProducts(products, { q: f.q, category: cat?.slug, badge: f.badge as "new" | "hit" | "", color: f.color, material: f.material, min: minV, max: maxV,
    discount: !!f.discount, premium: !!f.premium, sort: f.sort as "asc" | "desc" | "" }, catName);
  if (photo) { const pos = new Map(photo.result.order.map((s, i) => [s, i])); list = [...list].sort((a, b) => (pos.get(a.slug) ?? 1e9) - (pos.get(b.slug) ?? 1e9)); }
  const needle = f.q.trim();
  const title = photo ? "Похожие на ваше фото" : needle ? `Поиск: ${needle}` : cat ? cat.name : f.badge === "new" ? "Новинки" : f.badge === "hit" ? "Хиты продаж" : f.discount ? "Скидки" : f.premium ? "Премиум" : "Все светильники";
  const active: { k: (keyof F)[]; label: string }[] = [
    cat && { k: ["category"], label: cat.name }, needle && { k: ["q"], label: `«${needle}»` },
    (f.min || f.max) && { k: ["min", "max"], label: `Цена: ${f.min ? `от ${f.min}` : ""}${f.min && f.max ? " " : ""}${f.max ? `до ${f.max}` : ""} ₽` },
    f.color && { k: ["color"], label: f.color }, f.material && { k: ["material"], label: f.material },
    f.badge && { k: ["badge"], label: f.badge === "new" ? "Новинки" : "Хиты" }, f.discount && { k: ["discount"], label: "Скидки" },
    f.premium && { k: ["premium"], label: "Премиум" }, SORTS[f.sort] && { k: ["sort"], label: SORTS[f.sort] },
  ].filter(Boolean) as { k: (keyof F)[]; label: string }[];
  const filterCount = active.filter((a) => a.k[0] !== "q").length;
  const reset = () => update({ ...EMPTY });
  const badPrice = minV > 0 && maxV > 0 && minV > maxV;
  const toggles = [
    { label: "Новинки", icon: ICON.fire, iconCls: "text-[#FF6A2B]", on: f.badge === "new", set: () => update({ badge: f.badge === "new" ? "" : "new" }) },
    { label: "Хиты", icon: ICON.star, iconCls: "text-[#FF8A1F]", on: f.badge === "hit", set: () => update({ badge: f.badge === "hit" ? "" : "hit" }) },
    { label: "Скидки", icon: ICON.pct, iconCls: "text-accent", stroke: true, on: !!f.discount, set: () => update({ discount: f.discount ? "" : "1" }) },
    { label: "Премиум", icon: ICON.gem, iconCls: "text-stone-200", stroke: true, on: !!f.premium, set: () => update({ premium: f.premium ? "" : "1" }) },
  ];
  const toggleBtns = toggles.map((t) => (
    <button key={t.label} type="button" aria-pressed={t.on} onClick={t.set} className={tog(t.on)}>
      <I d={t.icon} fill={!t.stroke} className={t.on && !t.stroke ? "text-accent" : t.iconCls} />{t.label}</button>));
  const price = (
    <div className={`${ctl} cursor-text`}>
      <span className="text-base text-stone-300">₽</span><span className="shrink-0">Цена,</span>
      <input type="number" min="0" inputMode="numeric" value={f.min} onChange={(e) => update({ min: e.target.value })} aria-label="Цена от" placeholder="от" className={num} />
      <span className="text-stone-400">—</span>
      <input type="number" min="0" inputMode="numeric" value={f.max} onChange={(e) => update({ max: e.target.value })} aria-label="Цена до" placeholder="до" className={num} />
    </div>);
  const colorSel = (
    <label className={ctl}>
      <span className="flex shrink-0 -space-x-1.5" aria-hidden="true">
        {(f.color ? [f.color] : colors.slice(0, 4)).map((c) => <span key={c} className="h-5 w-5 rounded-full ring-2 ring-black/60" style={{ background: swatch(c) }} />)}</span>
      <span className="truncate">{f.color || "Любой цвет"}</span><Chevron />
      <select value={f.color} onChange={(e) => update({ color: e.target.value })} aria-label="Цвет" className={overlay}>
        <option value="">Любой цвет</option>{colors.map((c) => <option key={c} value={c}>{c}</option>)}</select>
    </label>);
  const sortSel = (
    <label className={ctl}>
      <I d={ICON.sort} className="text-stone-300" /><span className="truncate">{SORTS[f.sort] ?? "По умолчанию"}</span><Chevron />
      <select value={f.sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Сортировка" className={overlay}>
        <option value="">По умолчанию</option><option value="asc">Сначала дешевле</option><option value="desc">Сначала дороже</option></select>
    </label>);
  return (<>
    <div className="relative overflow-hidden rounded-[1.75rem] bg-[#120c08] p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,.25)] sm:p-6 lg:p-7">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/filter-bg.webp" alt="" aria-hidden="true" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
      <div className="relative">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-x-4 gap-y-1 sm:mb-6">
          <div className="min-w-0"><h2 className="break-words text-2xl font-bold tracking-tight sm:text-[2rem]">{title}</h2>
            <p className="mt-1 text-sm text-stone-300 sm:text-base">Создайте уют с современным освещением</p></div>
          <p aria-live="polite" className="pt-1 text-sm font-medium text-stone-200">Найдено: {list.length} {list.length % 10 === 1 && list.length % 100 !== 11 ? "товар" : [2, 3, 4].includes(list.length % 10) && ![12, 13, 14].includes(list.length % 100) ? "товара" : "товаров"}</p>
        </div>
        <form role="search" onSubmit={(e) => { e.preventDefault(); (document.activeElement as HTMLElement | null)?.blur(); }} className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex h-14 items-center gap-3 rounded-xl bg-accent px-5 font-medium shadow-[0_8px_24px_rgba(226,67,31,.35)] transition hover:bg-[#c93816] md:w-60">
            <I d={ICON.grid} /><span className="truncate">{cat?.name ?? "Все категории"}</span><Chevron />
            <select value={f.category} onChange={(e) => update({ category: e.target.value })} aria-label="Категория" className={overlay}>
              <option value="">Все категории</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
          </label>
          <div className="flex h-14 min-w-0 shrink-0 overflow-hidden rounded-xl md:flex-1 border border-white/15 bg-black/35 backdrop-blur-md transition focus-within:border-white/40">
            <div className="relative min-w-0 flex-1">
              <I d={ICON.search} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300" />
              <input type="search" value={f.q} onChange={(e) => update({ q: e.target.value })} aria-label="Поиск по каталогу" placeholder="Поиск по названию, материалу, цвету…"
                className="h-full w-full min-w-0 bg-transparent pl-11 pr-1 text-base text-white outline-none placeholder:text-stone-400 md:text-sm" />
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={photoBusy} title="Поиск по фото" aria-label="Поиск по фото"
              className="grid w-11 shrink-0 place-items-center text-stone-300 transition hover:text-white disabled:opacity-50">{photoBusy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <I d={ICON.camera} />}</button>
            <button type="submit" aria-label="Найти" className="flex shrink-0 items-center gap-2 bg-accent px-4 font-medium transition hover:bg-[#c93816] sm:px-8"><span className="hidden min-[400px]:inline">Найти</span><I d={ICON.arrow} /></button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-label="Загрузить фото для поиска" onChange={(e) => { pickPhoto(e.target.files?.[0]); e.target.value = ""; }} />
        </form>
        {/* Компьютер: вторая строка фильтров */}
        <div className="mt-3 hidden flex-wrap gap-3 md:flex">
          <div className="w-[15rem] shrink-0">{price}</div>
          <div className="w-48 shrink-0">{colorSel}</div>
          {toggleBtns}
          <div className="w-52 shrink-0 lg:ml-auto">{sortSel}</div>
        </div>
        {/* Телефон: быстрые фильтры + выдвижная панель */}
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 md:hidden">
          <button type="button" onClick={() => setDrawer(true)} aria-haspopup="dialog" aria-expanded={drawer} className={tog(filterCount > 0)}>
            <I d={ICON.sliders} />Фильтры{filterCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs">{filterCount}</span>}</button>
          {toggleBtns}
        </div>
      </div>
    </div>
    {(photo || photoErr) && <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl bg-blush p-3 text-sm">
      {photo && /* eslint-disable-next-line @next/next/no-img-element */ <img src={photo.url} alt="Ваше фото" className="h-14 w-14 shrink-0 rounded-xl object-cover" />}
      <div className="min-w-0 flex-1 basis-48">
        {photoErr ? <p role="alert" className="text-accent">{photoErr}</p>
          : photo?.result.mode === "api" ? <p>Показываем товары, найденные визуальным поиском по вашему фото.</p>
          : <p><span className="font-medium">Демо-режим:</span> товары отсортированы по сходству цвета и композиции кадра, а не по форме светильника.{photo?.result.fellBack ? " Сервис визуального поиска сейчас недоступен." : ""}</p>}
      </div>
      <div className="flex gap-4">
        <button type="button" onClick={() => fileRef.current?.click()} className="min-h-11 underline decoration-accent underline-offset-4">Другое фото</button>
        {photo && <button type="button" onClick={clearPhoto} className="min-h-11 underline decoration-accent underline-offset-4">Убрать</button>}</div>
    </div>}
    <div className="mt-3 hidden items-center justify-end gap-2 text-sm md:flex">
      <span className="text-stone-500">Материал:</span>
      <label className="relative flex min-h-9 items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 transition hover:border-graphite">
        <span>{f.material || "Любой"}</span><Chevron />
        <select value={f.material} onChange={(e) => update({ material: e.target.value })} aria-label="Материал" className={overlay}>
          <option value="">Любой материал</option>{materials.map((m) => <option key={m} value={m}>{m}</option>)}</select></label>
    </div>
    {badPrice && <p className="mt-3 text-sm text-accent">Минимальная цена больше максимальной — проверьте диапазон.</p>}
    {active.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Активные фильтры">
      {active.map((a) => <button key={a.k.join()} type="button" onClick={() => update(Object.fromEntries(a.k.map((k) => [k, ""])))} aria-label={`Убрать фильтр: ${a.label}`}
        className="flex min-h-9 max-w-full items-center gap-1.5 rounded-full bg-graphite px-3 py-1.5 text-xs text-white transition hover:bg-accent"><span className="truncate">{a.label}</span><span aria-hidden="true" className="text-base leading-none">×</span></button>)}
      <button type="button" onClick={reset} className="min-h-9 px-2 text-sm underline decoration-accent underline-offset-4">Сбросить всё</button>
    </div>}
    <div className="mb-8" />
    {list.length ? <>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 lg:grid-cols-4">{list.slice(0, shown).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      {list.length > shown && <div className="mt-10 text-center"><button type="button" onClick={() => setShown(shown + PAGE)} className="min-h-12 rounded-full border border-graphite/30 px-8 py-3 transition hover:border-accent hover:text-accent">Показать ещё ({list.length - shown})</button></div>}
    </> : <p className="py-10 text-center">Ничего не найдено. <button type="button" onClick={reset} className="underline decoration-accent underline-offset-4">Сбросить фильтры</button></p>}
    {drawer && <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Фильтры и сортировка">
      <button type="button" aria-label="Закрыть фильтры" onClick={() => setDrawer(false)} className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-2"><h3 className="font-display text-xl">Фильтры</h3>
          <button type="button" onClick={() => setDrawer(false)} aria-label="Закрыть" className="grid h-11 w-11 place-items-center text-2xl text-stone-500">×</button></div>
        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          <fieldset><legend className="mb-2 text-sm font-medium">Категория</legend><div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={!f.category} onClick={() => update({ category: "" })} className={chip(!f.category)}>Все</button>
            {categories.map((c) => <button key={c.slug} type="button" aria-pressed={f.category === c.slug} onClick={() => update({ category: f.category === c.slug ? "" : c.slug })} className={chip(f.category === c.slug)}>{c.name}</button>)}</div></fieldset>
          <fieldset><legend className="mb-2 text-sm font-medium">Цена, ₽</legend><div className="flex items-center gap-2">
            <input type="number" min="0" inputMode="numeric" value={f.min} onChange={(e) => update({ min: e.target.value })} aria-label="Цена от" placeholder="от" className={field} />
            <span className="text-stone-400">—</span>
            <input type="number" min="0" inputMode="numeric" value={f.max} onChange={(e) => update({ max: e.target.value })} aria-label="Цена до" placeholder="до" className={field} /></div></fieldset>
          <fieldset><legend className="mb-2 text-sm font-medium">Цвет</legend><div className="flex flex-wrap gap-2">
            {colors.map((c) => <button key={c} type="button" aria-pressed={f.color === c} onClick={() => update({ color: f.color === c ? "" : c })} className={`${chip(f.color === c)} flex items-center gap-2`}>
              <span className="h-4 w-4 rounded-full ring-1 ring-black/15" style={{ background: swatch(c) }} />{c}</button>)}</div></fieldset>
          <label className="block"><span className="mb-2 block text-sm font-medium">Материал</span>
            <select value={f.material} onChange={(e) => update({ material: e.target.value })} className={field}><option value="">Любой материал</option>{materials.map((m) => <option key={m} value={m}>{m}</option>)}</select></label>
          <fieldset><legend className="mb-2 text-sm font-medium">Подборки</legend><div className="flex flex-wrap gap-2">
            {toggles.map((t) => <button key={t.label} type="button" aria-pressed={t.on} onClick={t.set} className={chip(t.on)}>{t.label}</button>)}</div></fieldset>
          <label className="block"><span className="mb-2 block text-sm font-medium">Сортировка</span>
            <select value={f.sort} onChange={(e) => update({ sort: e.target.value })} className={field}><option value="">По умолчанию</option><option value="asc">Сначала дешевле</option><option value="desc">Сначала дороже</option></select></label>
        </div>
        <div className="flex gap-3 border-t border-stone-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={reset} disabled={!active.length} className="min-h-12 rounded-full border border-stone-300 px-5 text-sm disabled:opacity-40">Сбросить</button>
          <button type="button" onClick={() => setDrawer(false)} className="min-h-12 flex-1 rounded-full bg-accent px-5 text-sm font-medium text-white">Показать {list.length}</button></div>
      </div></div>}
  </>);
}
