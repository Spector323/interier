// ДЕМО-режим поиска по фото: сравнение цветовой «подписи» кадра (сетка 6×6 + гистограмма цветов) с заранее
// посчитанными подписями фото каталога (data/signatures.json). Это НЕ распознавание формы светильника:
// похожими окажутся товары с близкой палитрой и композицией кадра.
// Подписи грузятся отдельным чанком только при первом поиске — в основной бандл они не попадают.
// Для большого каталога этот режим не годится: см. docs/visual-search.md.
export type Sig = { g: number[]; h: number[] };
export const sigOf = (img: HTMLImageElement): Sig => {
  const s = Math.min(img.naturalWidth, img.naturalHeight), sx = (img.naturalWidth - s) / 2, sy = (img.naturalHeight - s) / 2;
  const draw = (n: number) => { const c = document.createElement("canvas"); c.width = c.height = n; const x = c.getContext("2d"); if (!x) throw new Error("canvas"); x.imageSmoothingQuality = "high"; x.drawImage(img, sx, sy, s, s, 0, 0, n, n); return x.getImageData(0, 0, n, n).data; };
  const gd = draw(6), g: number[] = []; for (let i = 0; i < gd.length; i += 4) g.push(gd[i] / 255, gd[i + 1] / 255, gd[i + 2] / 255);
  const hd = draw(32), h = new Array<number>(64).fill(0); for (let i = 0; i < hd.length; i += 4) h[(hd[i] >> 6) * 16 + (hd[i + 1] >> 6) * 4 + (hd[i + 2] >> 6)] += 1 / 1024;
  return { g, h };
};
const valid = (x: unknown): x is Sig => !!x && Array.isArray((x as Sig).g) && (x as Sig).g.length === 108 && Array.isArray((x as Sig).h) && (x as Sig).h.length === 64;
export const dist = (a: Sig, b: Sig) => { let e = 0; for (let i = 0; i < a.g.length; i++) e += (a.g[i] - b.g[i]) ** 2; let m = 0; for (let i = 0; i < 64; i++) m += Math.min(a.h[i], b.h[i]); return Math.sqrt(e / a.g.length) + (1 - m); };
let cache: Promise<Record<string, Sig[]>> | null = null;
export const loadSignatures = () => (cache ??= import("@/data/signatures.json").then((m) => m.default as unknown as Record<string, Sig[]>).catch((e) => { cache = null; throw e; }));
// Возвращает slug в порядке похожести; товары без подписей — в конце (missing), чтобы не ломать сортировку.
export async function rankDemo(sig: Sig, slugs: string[]) {
  const all = await loadSignatures(); const score = new Map<string, number>(); const missing: string[] = [];
  for (const s of slugs) { const list = (all[s] ?? []).filter(valid); if (list.length) score.set(s, Math.min(...list.map((x) => dist(sig, x)))); else missing.push(s); }
  return { order: [...score.keys()].sort((a, b) => score.get(a)! - score.get(b)!), missing };
}
