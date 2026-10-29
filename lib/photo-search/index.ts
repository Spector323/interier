import { rankDemo, sigOf } from "./demo";
// Поиск по фото на клиенте. Два режима:
//  • "api"  — фото уходит на /api/visual-search, сервер ищет по индексу эмбеддингов (нужен внешний сервис, docs/visual-search.md);
//  • "demo" — локальное сравнение цвета и композиции (lib/photo-search/demo.ts).
// Режим api включается NEXT_PUBLIC_VISUAL_SEARCH=api; при ошибке сервиса откатываемся на demo и честно сообщаем об этом.
export type PhotoResult = { mode: "api" | "demo"; order: string[]; missing: string[]; fellBack?: boolean };
export type PhotoError = "type" | "size" | "decode" | "signatures";
export class PhotoSearchError extends Error { constructor(public code: PhotoError) { super(code); } }
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
export function validatePhoto(file: File) {
  if (!file.type.startsWith("image/")) throw new PhotoSearchError("type");
  if (file.size > MAX_PHOTO_BYTES) throw new PhotoSearchError("size");
}
export const decodeImage = (url: string) => new Promise<HTMLImageElement>((ok, fail) => {
  const img = new Image(); img.decoding = "async"; img.onload = () => (img.naturalWidth ? ok(img) : fail(new PhotoSearchError("decode"))); img.onerror = () => fail(new PhotoSearchError("decode")); img.src = url;
});
async function viaApi(file: File): Promise<PhotoResult> {
  const fd = new FormData(); fd.set("photo", file);
  const r = await fetch("/api/visual-search", { method: "POST", body: fd });
  if (!r.ok) throw new Error(`visual-search ${r.status}`);
  const j = (await r.json()) as { slugs?: string[] };
  return { mode: "api", order: Array.isArray(j.slugs) ? j.slugs : [], missing: [] };
}
export async function searchByPhoto(file: File, img: HTMLImageElement, slugs: string[]): Promise<PhotoResult> {
  if (process.env.NEXT_PUBLIC_VISUAL_SEARCH === "api") { try { return await viaApi(file); } catch { /* сервис недоступен — демо-режим */ } }
  let sig; try { sig = sigOf(img); } catch { throw new PhotoSearchError("decode"); }
  try { return { mode: "demo", ...(await rankDemo(sig, slugs)), fellBack: process.env.NEXT_PUBLIC_VISUAL_SEARCH === "api" }; }
  catch { throw new PhotoSearchError("signatures"); }
}
export const photoErrorText = (e: unknown) => {
  const c = e instanceof PhotoSearchError ? e.code : "decode";
  return c === "type" ? "Это не изображение. Выберите фото в формате JPG, PNG или WEBP." : c === "size" ? "Файл больше 15 МБ. Выберите фото поменьше."
    : c === "signatures" ? "Не удалось загрузить данные для сравнения. Попробуйте ещё раз." : "Не удалось открыть изображение. Попробуйте другое фото.";
};
