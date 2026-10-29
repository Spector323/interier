import { products } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import type { CatalogSource } from "./types";
import { filterProducts, materialsOf } from "./filter";
// Демонстрационный источник: 12 товаров из data/seed.json. Остаётся, пока парсер и внешняя БД не готовы.
const catName = (s: string) => CATEGORIES.find((c) => c.slug === s)?.name ?? "";
export const localSource: CatalogSource = {
  async list(q) {
    const all = filterProducts(products, q, catName); const pageSize = Math.min(Math.max(q.pageSize ?? 24, 1), 100); const page = Math.max(q.page ?? 1, 1);
    return { items: all.slice((page - 1) * pageSize, page * pageSize), total: all.length, page, pageSize };
  },
  async bySlug(slug) { return products.find((p) => p.slug === slug) ?? null; },
  async slugs() { return products.map((p) => p.slug); },
  async facets() {
    const prices = products.map((p) => p.price);
    return { categories: [...new Set(products.map((p) => p.category))], colors: [...new Set(products.map((p) => p.color))].sort(),
      materials: [...new Set(products.flatMap(materialsOf))].sort(), priceMin: Math.min(...prices), priceMax: Math.max(...prices) };
  },
};
