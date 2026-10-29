import type { Metadata } from "next";
import Link from "next/link";
import { INSTALLMENT } from "@/data/installment";
import { catalog } from "@/lib/catalog";
import OpenManagerButton from "@/components/OpenManagerButton";
import ProductCard from "@/components/ProductCard";
export const metadata: Metadata = { title: `${INSTALLMENT.title} — ИНТЕРЬЕР`, description: INSTALLMENT.lead, alternates: { canonical: "/installment" } };
// Общие принципы исламского финансирования — без конкретных цифр. Условия магазина выводятся только после подтверждения (data/installment.ts).
const PRINCIPLES = [
  ["Прозрачная сделка", "Стоимость покупки и порядок платежей фиксируются заранее и не меняются по ходу оплаты."],
  ["Реальный товар", "Рассрочка оформляется на конкретный товар, а не на выдачу денег."],
  ["Без ростовщичества", "Принципы исламского финансирования исключают начисление процентов на долг (риба)."],
];
const STEPS = [
  ["Выберите светильник", "Подберите товар в каталоге или попросите менеджера помочь с выбором."],
  ["Оставьте заявку", "Нажмите «Связаться с менеджером» на странице товара или здесь."],
  ["Узнайте условия", "Менеджер расскажет, доступна ли рассрочка, и ответит на вопросы."],
  ["Получите покупку", "После согласования оформим заказ и договоримся о доставке."],
];
const FAQ = [
  ["Когда можно будет оформить рассрочку?", "Условия сейчас согласовываются. Оставьте заявку — менеджер сообщит, как только рассрочка станет доступна."],
  ["Какой первоначальный взнос и срок?", "Финансовые условия мы опубликуем только после их утверждения. До этого не называем цифры, чтобы не вводить вас в заблуждение."],
  ["На какие товары действует рассрочка?", "Список товаров будет указан вместе с условиями. Уточнить по конкретному светильнику можно у менеджера."],
  ["Какие документы понадобятся?", "Перечень документов сообщит менеджер при обращении."],
];
const dot = <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />;
export default async function InstallmentPage() {
  const terms = INSTALLMENT.confirmed ? INSTALLMENT.terms : [];
  const details = INSTALLMENT.confirmed ? INSTALLMENT.details : [];
  const picks = (await catalog.list({ badge: "hit", pageSize: 4 })).items;
  const ask = { topic: "Исламская рассрочка" };
  return (<>
    <section className="bg-gradient-to-b from-milk via-blush/60 to-milk">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:pt-8 lg:pb-20">
        <nav aria-label="Хлебные крошки" className="mb-10 text-sm text-stone-500"><ol className="flex flex-wrap gap-2">
          <li><Link href="/" className="hover:text-accent">Главная</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-graphite">Рассрочка</li></ol></nav>
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-accent">Оплата частями</p>
            <h1 className="font-display text-[2.1rem] leading-[1.1] min-[380px]:text-4xl sm:text-6xl">{INSTALLMENT.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">{INSTALLMENT.lead}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <OpenManagerButton context={ask} className="min-h-12 rounded-full bg-accent px-8 py-3 font-medium text-white transition hover:bg-[#c93816]">Узнать об условиях</OpenManagerButton>
              <Link href="/#collection" className="flex min-h-12 items-center justify-center rounded-full border border-graphite/30 px-8 py-3 transition hover:border-accent hover:text-accent">Выбрать светильник</Link></div>
          </div>
          <div className="rounded-[2rem] bg-graphite p-7 text-white sm:p-10">
            <p className="text-xs uppercase tracking-[0.35em] text-accent">Статус</p>
            {terms.length > 0 ? <dl className="mt-5 divide-y divide-white/10">
              {terms.map((t) => <div key={t.label} className="flex justify-between gap-4 py-3"><dt className="text-stone-400">{t.label}</dt><dd className="text-right font-medium">{t.value}</dd></div>)}</dl>
              : <><h2 className="font-display mt-3 text-2xl sm:text-3xl">Условия уточняются</h2>
                <ul className="mt-6 space-y-4 text-stone-200">{INSTALLMENT.notes.map((n) => <li key={n} className="flex gap-3">{dot}{n}</li>)}</ul>
                <p className="mt-8 border-t border-white/10 pt-5 text-sm text-stone-400">Мы публикуем только утверждённые условия: взнос, срок и стоимость появятся здесь после согласования.</p></>}
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
      <h2 className="font-display text-3xl sm:text-4xl">Как устроена исламская рассрочка</h2>
      <p className="mt-4 max-w-2xl text-stone-600">Общие принципы, на которых строится такая покупка. Конкретные условия магазина сообщит менеджер.</p>
      <div className="mt-10 grid gap-8 sm:grid-cols-3">{PRINCIPLES.map(([t, d]) => (
        <div key={t}><div className="mb-4 h-px w-10 bg-accent" /><h3 className="font-display text-xl">{t}</h3><p className="mt-2 text-sm leading-relaxed text-stone-600">{d}</p></div>))}</div>
    </section>

    <section className="bg-blush py-14 lg:py-20"><div className="mx-auto max-w-7xl px-4">
      <h2 className="font-display text-3xl sm:text-4xl">Как оформить</h2>
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{STEPS.map(([t, d], i) => (
        <li key={t} className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
          <span className="font-display text-4xl text-accent">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-4 text-lg font-medium">{t}</h3><p className="mt-2 text-sm leading-relaxed text-stone-600">{d}</p></li>))}</ol>
    </div></section>

    {details.length > 0 && <section className="mx-auto max-w-3xl px-4 py-14">{details.map((d) => <div key={d.title} className="mt-8 first:mt-0"><h2 className="font-display text-2xl">{d.title}</h2><p className="mt-3 leading-relaxed text-stone-600">{d.text}</p></div>)}</section>}

    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.4fr] lg:py-20">
      <div><h2 className="font-display text-3xl sm:text-4xl">Частые вопросы</h2><p className="mt-4 text-stone-600">Не нашли ответ? Менеджер ответит на любой вопрос о рассрочке.</p>
        <OpenManagerButton context={ask} className="mt-6 min-h-12 rounded-full border border-graphite/30 px-7 py-3 transition hover:border-accent hover:text-accent">Задать вопрос</OpenManagerButton></div>
      <div className="divide-y divide-stone-200 border-y border-stone-200">{FAQ.map(([q, a]) => (
        <details key={q} className="group py-1">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium [&::-webkit-details-marker]:hidden">{q}
            <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-stone-300 text-lg leading-none transition group-open:rotate-45 group-open:border-accent group-open:text-accent">+</span></summary>
          <p className="pb-5 pr-10 leading-relaxed text-stone-600">{a}</p></details>))}</div>
    </section>

    {picks.length > 0 && <section className="mx-auto max-w-7xl px-4 pb-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3"><h2 className="font-display text-3xl">Популярные светильники</h2>
        <Link href="/#collection" className="text-sm underline decoration-accent underline-offset-4">Весь каталог</Link></div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 lg:grid-cols-4">{picks.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </section>}

    <section className="px-4 pb-20"><div className="mx-auto max-w-5xl rounded-[2rem] bg-graphite px-6 py-14 text-center text-white">
      <div className="mx-auto mb-8 h-px w-16 bg-accent" />
      <h2 className="font-display text-3xl sm:text-4xl">Хотите купить в рассрочку?</h2>
      <p className="mx-auto mt-4 max-w-lg text-stone-300">Оставьте заявку — менеджер сообщит актуальную информацию об условиях.</p>
      <OpenManagerButton context={ask} className="mt-8 min-h-12 rounded-full bg-accent px-8 py-3 font-medium text-white transition hover:bg-[#c93816]">Оставить заявку</OpenManagerButton>
    </div></section>
  </>);
}
