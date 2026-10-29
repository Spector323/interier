import type { Product } from "@/types/product";
import type { CatalogSource, ProductQuery, ProductPage, Facets } from "./types";
// Внешний API каталога (будущая БД, которую наполняет парсер). Включается переменными CATALOG_SOURCE=api и CATALOG_API_URL.
// Ожидаемый контракт (см. docs/catalog-api.md):
//   GET /products?q=&category=&badge=&color=&material=&min=&max=&sort=&page=&pageSize=  → ProductPage
//   GET /products/:slug → Product | 404
//   GET /products/slugs → string[]          GET /facets → Facets
// Фото хранятся в файловом/объектном хранилище (S3 и т.п.); API отдаёт только ссылки и метаданные.
const base = () => (process.env.CATALOG_API_URL ?? "").replace(/\/$/, "");
async function get<T>(path: string): Promise<T | null> {
  const r = await fetch(base() + path, { headers: process.env.CATALOG_API_TOKEN ? { Authorization: `Bearer ${process.env.CATALOG_API_TOKEN}` } : {}, next: { revalidate: 300 } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`catalog api ${r.status} ${path}`);
  return r.json() as Promise<T>;
}
const qs = (q: ProductQuery) => { const u = new URLSearchParams(); for (const [k, v] of Object.entries(q)) if (v !== undefined && v !== "" && v !== 0) u.set(k, String(v)); return u.toString(); };
export const remoteSource: CatalogSource = {
  async list(q) { return (await get<ProductPage>(`/products?${qs(q)}`)) ?? { items: [], total: 0, page: 1, pageSize: q.pageSize ?? 24 }; },
  async bySlug(slug) { return get<Product>(`/products/${encodeURIComponent(slug)}`); },
  async slugs() { return (await get<string[]>("/products/slugs")) ?? []; },
  async facets() { return (await get<Facets>("/facets")) ?? { categories: [], colors: [], materials: [], priceMin: 0, priceMax: 0 }; },
};
