import type { Product } from "@/types/product";
import type { ProductQuery } from "./types";
// Общая логика фильтрации: её использует локальный источник на сервере и CollectionBrowser в браузере.
// Внешний API должен повторять эту семантику (все фильтры работают одновременно, через «И»).
// «Премиум» — товары от этой цены. Порог можно поменять или заменить полем из БД.
export const PREMIUM_FROM = 20000;
export const materialsOf = (p: Product) => p.material.split(/,\s*/).filter((m) => m && !/^IP\d+/.test(m));
export function filterProducts(list: Product[], q: ProductQuery, categoryName: (slug: string) => string = () => "") {
  const needle = (q.q ?? "").trim().toLowerCase(); const mat = (q.material ?? "").toLowerCase();
  const min = q.min || 0, max = q.max || Infinity;
  let r = list.filter((p) => (!q.category || p.category === q.category) && (!q.badge || p.badge === q.badge) && (!q.color || p.color === q.color) &&
    (!mat || p.material.toLowerCase().includes(mat)) && p.price >= min && p.price <= max && (!q.discount || !!p.oldPrice) && (!q.premium || p.price >= PREMIUM_FROM) &&
    (!needle || [p.name, p.description, p.material, p.color, categoryName(p.category)].join(" ").toLowerCase().includes(needle)));
  if (q.sort === "asc") r = [...r].sort((a, b) => a.price - b.price);
  if (q.sort === "desc") r = [...r].sort((a, b) => b.price - a.price);
  return r;
}
