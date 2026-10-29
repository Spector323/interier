import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";
const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await catalog.slugs();
  return [{ url: base }, { url: `${base}/installment` }, ...slugs.map((s) => ({ url: `${base}/catalog/${s}` }))];
}
