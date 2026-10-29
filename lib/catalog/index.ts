import { localSource } from "./local";
import { remoteSource } from "./remote";
import type { CatalogSource } from "./types";
export type { ProductQuery, ProductPage, Facets } from "./types";
// Единая точка получения товаров на сервере. Страницы не обращаются к data/* напрямую.
// CATALOG_SOURCE=api переключает на внешний API (без CATALOG_API_URL остаётся локальный источник).
export const catalog: CatalogSource = process.env.CATALOG_SOURCE === "api" && process.env.CATALOG_API_URL ? remoteSource : localSource;
export const getProductBySlug = (slug: string) => catalog.bySlug(slug);
