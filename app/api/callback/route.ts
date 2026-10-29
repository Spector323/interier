import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/catalog";
export const runtime = "nodejs";
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  if (b.website) return NextResponse.json({ ok: true }); // ловушка для ботов
  const name = String(b.name ?? "").trim().slice(0, 80); const phone = String(b.phone ?? "").trim().slice(0, 32); const comment = String(b.comment ?? "").trim().slice(0, 300);
  const topic = String(b.topic ?? "").trim().slice(0, 80);
  const digits = phone.replace(/\D/g, "");
  if (!name || digits.length < 10 || digits.length > 15) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const token = process.env.TELEGRAM_BOT_TOKEN; const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  // Товар ищем в каталоге по slug — в сообщение не попадёт произвольный текст вместо названия
  const product = typeof b.product === "string" && b.product ? await getProductBySlug(b.product.slice(0, 120)).catch(() => null) : null;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  const text = ["Заявка на звонок (ИНТЕРЬЕР)", `Имя: ${name}`, `Телефон: ${phone}`,
    product && `Товар: ${product.name}${site ? ` — ${site}/catalog/${product.slug}` : ""}`, topic && `Тема: ${topic}`, comment && `Комментарий: ${comment}`].filter(Boolean).join("\n");
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chat, text }), signal: AbortSignal.timeout(8000) });
    const j = (await r.json().catch(() => null)) as { ok?: boolean } | null;
    return r.ok && j?.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  } catch { return NextResponse.json({ error: "delivery_failed" }, { status: 502 }); }
}
