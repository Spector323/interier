import type { Product } from "@/types/product";
// Контракт источника товаров. Локальный источник (data/seed.json) и будущий внешний API реализуют одно и то же.
export type ProductQuery = {
  q?: string; category?: string; badge?: "new" | "hit" | ""; color?: string; material?: string;
  min?: number; discount?: boolean; premium?: boolean; max?: number; sort?: "asc" | "desc" | ""; page?: number; pageSize?: number;
};
export type ProductPage = { items: Product[]; total: number; page: number; pageSize: number };
export type Facets = { categories: string[]; colors: string[]; materials: string[]; priceMin: number; priceMax: number };
export interface CatalogSource {
  list(query: ProductQuery): Promise<ProductPage>;
  bySlug(slug: string): Promise<Product | null>;
  slugs(): Promise<string[]>;
  facets(): Promise<Facets>;
}
