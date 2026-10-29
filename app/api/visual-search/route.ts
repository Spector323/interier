import { NextResponse } from "next/server";
export const runtime = "nodejs";
// Заготовка серверного визуального поиска. Сам поиск выполняет внешний сервис (эмбеддинги изображений + векторный индекс),
// этот маршрут только проверяет файл и проксирует его. Контракт сервиса — docs/visual-search.md.
// Без VISUAL_SEARCH_API_URL отвечает 501, и клиент остаётся в демо-режиме.
const MAX = 15 * 1024 * 1024;
export async function POST(req: Request) {
  const url = process.env.VISUAL_SEARCH_API_URL;
  if (!url) return NextResponse.json({ error: "not_configured" }, { status: 501 });
  let file: FormDataEntryValue | null;
  try { file = (await req.formData()).get("photo"); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  if (!(file instanceof File) || !file.type.startsWith("image/")) return NextResponse.json({ error: "bad_type" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "too_large" }, { status: 413 });
  const fd = new FormData(); fd.set("photo", file); fd.set("limit", "48");
  try {
    const r = await fetch(url, { method: "POST", body: fd, headers: process.env.VISUAL_SEARCH_API_TOKEN ? { Authorization: `Bearer ${process.env.VISUAL_SEARCH_API_TOKEN}` } : {}, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
    const j = (await r.json()) as { results?: { slug: string; score: number }[] };
    return NextResponse.json({ slugs: (j.results ?? []).map((x) => x.slug).filter((s) => typeof s === "string") });
  } catch { return NextResponse.json({ error: "upstream" }, { status: 502 }); }
}
