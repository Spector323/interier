"use client";
import { useEffect, useRef, useState } from "react";
import { PHONE, PHONE_HREF, TELEGRAM, WHATSAPP } from "@/lib/site";
import type { ManagerContext } from "./OpenManagerButton";
type St = "idle" | "sending" | "ok" | "error" | "invalid" | "unavailable";
const inp = "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-accent sm:text-sm";
const link = "rounded-full border border-graphite/30 px-4 py-2.5 hover:border-accent hover:text-accent";
export default function ManagerWidget() {
  const [open, setOpen] = useState(false); const [st, setSt] = useState<St>("idle"); const [ctx, setCtx] = useState<ManagerContext>({});
  const first = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const o = (e: Event) => { setCtx((e as CustomEvent<ManagerContext>).detail ?? {}); setSt("idle"); setOpen(true); };
    window.addEventListener("open-manager", o); return () => window.removeEventListener("open-manager", o);
  }, []);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);
  useEffect(() => { if (open) first.current?.focus({ preventScroll: true }); }, [open]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const fd = new FormData(form); setSt("sending");
    const body = { ...Object.fromEntries(fd), product: ctx.product?.slug ?? "", topic: ctx.topic ?? "" };
    try {
      const r = await fetch("/api/callback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      // «Доставлено» показываем, только если сервер подтвердил отправку менеджеру
      setSt(r.ok ? "ok" : r.status === 503 ? "unavailable" : r.status === 400 ? "invalid" : "error"); if (r.ok) form.reset();
    } catch { setSt("error"); }
  }
  const wa = WHATSAPP && `https://wa.me/${WHATSAPP}${ctx.product ? `?text=${encodeURIComponent(`Здравствуйте! Интересует: ${ctx.product.name}`)}` : ""}`;
  const hasContacts = Boolean(PHONE || wa || TELEGRAM);
  return (<>
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="manager-panel" className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex min-h-12 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(226,67,31,.4)] transition hover:bg-[#c93816] sm:right-5">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z" /></svg>
      <span className="hidden sm:inline">Помощь менеджера</span><span className="sm:hidden">Менеджер</span></button>
    {open && <div id="manager-panel" role="dialog" aria-label="Помощь менеджера" className="fixed bottom-20 left-4 right-4 z-50 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-black/5 sm:left-auto sm:right-5 sm:w-96">
      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="font-display text-xl">Поможем подобрать свет</h2><p className="mt-1 text-sm text-stone-500">Ответим по товарам, рассрочке и доставке.</p></div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Закрыть" className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center text-2xl leading-none text-stone-400 hover:text-graphite">×</button></div>
      {ctx.product && <p className="mt-3 rounded-xl bg-blush px-3 py-2 text-sm">Товар: <span className="font-medium">{ctx.product.name}</span></p>}
      {ctx.topic && !ctx.product && <p className="mt-3 rounded-xl bg-blush px-3 py-2 text-sm">Тема: <span className="font-medium">{ctx.topic}</span></p>}
      {hasContacts && <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {PHONE && <a href={PHONE_HREF} className={link}>Позвонить: {PHONE}</a>}
        {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className={link}>WhatsApp</a>}
        {TELEGRAM && <a href={`https://t.me/${TELEGRAM}`} target="_blank" rel="noopener noreferrer" className={link}>Telegram</a>}
      </div>}
      <form onSubmit={submit} className="mt-4 space-y-2">
        <p className="text-sm font-medium">Оставьте заявку — менеджер перезвонит</p>
        <input ref={first} name="name" required maxLength={80} autoComplete="name" placeholder="Ваше имя" aria-label="Ваше имя" className={inp} />
        <input name="phone" required type="tel" inputMode="tel" autoComplete="tel" placeholder="Телефон" aria-label="Телефон" className={inp} />
        <input name="comment" maxLength={300} placeholder={ctx.product ? "Вопрос по товару (необязательно)" : "Что подобрать? (необязательно)"} aria-label="Комментарий" className={inp} />
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={st === "sending"} className="min-h-12 w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition hover:bg-[#c93816] disabled:opacity-60">{st === "sending" ? "Отправляем…" : "Перезвоните мне"}</button>
        <p aria-live="polite" className="min-h-5 text-sm">
          {st === "ok" && <span className="text-green-700">Заявка доставлена менеджеру. Скоро с вами свяжутся.</span>}
          {st === "invalid" && <span className="text-accent">Проверьте имя и номер телефона (10–15 цифр).</span>}
          {st === "error" && <span className="text-accent">Заявка не доставлена из-за ошибки связи. Попробуйте ещё раз{PHONE ? " или позвоните нам" : ""}.</span>}
          {st === "unavailable" && <span className="text-stone-600">Онлайн-заявки пока не подключены — заявка не отправлена.{hasContacts ? " Свяжитесь с нами по контактам выше." : " Контакты магазина скоро появятся на сайте."}</span>}</p>
      </form></div>}
  </>);
}
