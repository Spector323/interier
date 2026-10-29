import { CATEGORIES } from "@/data/categories";
import { products } from "@/data/products";
// Показываем только категории, в которых есть товары
export const ACTIVE_CATEGORIES = CATEGORIES.filter((c) => products.some((p) => p.category === c.slug));
// Заведены, но ещё не наполнены — показываем только как анонс, без карточек
export const PLANNED_CATEGORIES = CATEGORIES.filter((c) => !ACTIVE_CATEGORIES.includes(c));
