"use client";
import { useEffect, useRef, useState } from "react";
import { LOGO_ANIM } from "@/lib/site";
const WORD = "ИНТЕРЬЕР";
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export default function Splash() {
  const [phase, setPhase] = useState<"show" | "fly" | "gone">("show");
  const [n, setN] = useState(0);
  const [fly, setFly] = useState<{ x: number; y: number; s: number } | null>(null);
  const logo = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // Заставка играет один раз за визит: при переходах и перезагрузках внутри сессии не повторяется
    let seen = false; try { seen = sessionStorage.getItem("splash-seen") === "1"; sessionStorage.setItem("splash-seen", "1"); } catch {}
    if (seen) { setPhase("gone"); return; }
    let dead = false;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 0.15 : 1;
    try { history.scrollRestoration = "manual"; } catch {}
    window.scrollTo(0, 0);
    root.dataset.splash = "on"; document.body.style.overflow = "hidden";
    (async () => {
      await sleep(1300 * k);                                 // играет анимация логотипа
      for (let i = 1; i <= WORD.length; i++) { if (dead) return; setN(i); await sleep(90 * k); }   // печать
      await sleep(500 * k);                                   // пауза
      for (let i = WORD.length - 1; i >= 0; i--) { if (dead) return; setN(i); await sleep(45 * k); } // стирание
      await sleep(150 * k);
      if (dead) return;
      const a = logo.current?.getBoundingClientRect(); const b = document.getElementById("header-logo")?.getBoundingClientRect();
      if (a && b && !reduce) setFly({ x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), s: b.width / a.width });
      setPhase("fly");
      await sleep(800 * k);
      if (!dead) setPhase("gone");
    })();
    return () => { dead = true; delete root.dataset.splash; document.body.style.overflow = ""; };
  }, []);
  useEffect(() => { if (phase === "gone") { delete document.documentElement.dataset.splash; document.body.style.overflow = ""; } }, [phase]);
  if (phase === "gone") return null;
  const flying = phase === "fly";
  return (
    <div id="splash" aria-hidden="true" className={`fixed inset-0 z-[100] ${flying ? "pointer-events-none" : ""}`}>
      <div className={`absolute inset-0 bg-[#121214] transition-opacity duration-700 ${flying ? "opacity-0" : ""}`} />
      <div className="relative flex h-full flex-col items-center justify-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={logo} src={LOGO_ANIM} alt="" className="logo-glow h-36 w-auto sm:h-44"
          style={fly ? { transform: `translate(${fly.x}px, ${fly.y}px) scale(${fly.s})`, transition: "transform 800ms cubic-bezier(.65,0,.35,1)" } : undefined} />
        <p className={`font-display h-10 text-2xl tracking-[0.3em] text-stone-200 transition-opacity duration-300 sm:text-4xl ${flying ? "opacity-0" : ""}`}>
          {WORD.slice(0, n)}<span className="opacity-0">{WORD.slice(n)}</span></p>
      </div>
    </div>
  );
}
