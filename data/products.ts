import seed from "./seed.json";
import type { Product } from "@/types/product";
import { DESCRIPTIONS } from "./descriptions";
// Фото лежат в public/images/products/<slug>-off.jpg и <slug>-on.jpg
const IMG_EXT = "jpg";
// Категории, где фото — временные иллюстрации, а не снимки реального товара (сейчас таких нет)
const ILLUSTRATIVE = new Set<string>();
const DIM: Record<string, string> = { chandelier: "Ø 70 × 90 см", pendant: "Ø 35 × 120 см", ceiling: "Ø 45 × 8 см", wall: "12 × 25 × 18 см", floor: "Ø 40 × 160 см", table: "Ø 25 × 45 см", switch: "86 × 86 × 10 мм", socket: "86 × 86 × 40 мм" };
export const products: Product[] = (seed as (string | number)[][]).map((s, i) => ({
  id: String(i + 1), slug: s[0] as string, name: s[1] as string, category: s[2] as string,
  price: s[4] as number, oldPrice: s[5] ? (s[5] as number) : undefined,
  image: `/images/products/${s[0]}-off.${IMG_EXT}`, hoverImage: `/images/products/${s[0]}-on.${IMG_EXT}`,
  images: [`/images/products/${s[0]}-off.${IMG_EXT}`, `/images/products/${s[0]}-on.${IMG_EXT}`],
  description: DESCRIPTIONS[s[0] as string]?.full ?? "", shortDescription: DESCRIPTIONS[s[0] as string]?.short ?? "",
  material: s[6] as string, color: s[7] as string, power: s[8] as string, dimensions: DIM[s[3] as string] ?? "—",
  badge: (s[9] as "new" | "hit") || undefined, stock: 3 + ((i * 7) % 12),
  illustrative: ILLUSTRATIVE.has(s[2] as string), downloadable: true,
}));
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
