import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog, getProductBySlug } from "@/lib/catalog";
import { CATEGORIES } from "@/data/categories";
import { rub } from "@/lib/format";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import OpenManagerButton from "@/components/OpenManagerButton";
// Один общий шаблон для всех товаров. Новые slug из внешнего API рендерятся по запросу (dynamicParams).
export const dynamicParams = true;
export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { return (await catalog.slugs()).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProductBySlug((await params).slug);
  if (!p) return { title: "Товар не найден — ИНТЕРЬЕР", robots: { index: false } };
  return { title: `${p.name} — ИНТЕРЬЕР`, description: p.shortDescription || p.name, alternates: { canonical: `/catalog/${p.slug}` },
    openGraph: { title: p.name, description: p.shortDescription, images: [p.image], type: "website", locale: "ru_RU" } };
}
export default async function ProductPage({ params }: Props) {
  const p = await getProductBySlug((await params).slug);
  if (!p) notFound();
  const cat = CATEGORIES.find((c) => c.slug === p.category);
  const related = (await catalog.list({ category: p.category, pageSize: 5 })).items.filter((x) => x.slug !== p.slug).slice(0, 4);
  const specs = [["Категория", cat?.name], ["Материал", p.material], ["Цвет", p.color], ["Мощность / ток", p.power], ["Размеры", p.dimensions]]
    .filter((s): s is [string, string] => Boolean(s[1] && s[1] !== "—"));
  const ctx = { product: { name: p.name, slug: p.slug } };
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:pt-8">
      <nav aria-label="Хлебные крошки" className="mb-6 text-sm text-stone-500">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li><Link href="/" className="hover:text-accent">Главная</Link></li><li aria-hidden="true">/</li>
          <li><Link href="/#collection" className="hover:text-accent">Каталог</Link></li>
          {cat && <><li aria-hidden="true">/</li><li><Link href={`/?category=${cat.slug}#collection`} className="hover:text-accent">{cat.name}</Link></li></>}
          <li aria-hidden="true">/</li><li aria-current="page" className="min-w-0 break-words text-graphite">{p.name}</li>
        </ol></nav>
      <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
        <ProductGallery p={p} />
        <div className="min-w-0">
          {cat && <p className="text-xs uppercase tracking-[0.25em] text-stone-500">{cat.name}</p>}
          <h1 className="font-display mt-2 break-words text-3xl leading-tight sm:text-4xl">{p.name}</h1>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-3"><span className="text-2xl font-semibold sm:text-3xl">{rub(p.price)}</span>{p.oldPrice && <s className="text-stone-400">{rub(p.oldPrice)}</s>}</div>
          <p className="mt-2 text-sm text-stone-500">Наличие и сроки доставки уточняйте у менеджера.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <OpenManagerButton context={ctx} className="min-h-12 rounded-full bg-accent px-8 py-3 font-medium text-white transition hover:bg-[#c93816]">Связаться с менеджером</OpenManagerButton>
            <Link href="/installment" className="flex min-h-12 items-center justify-center rounded-full border border-graphite/30 px-8 py-3 transition hover:border-accent hover:text-accent">Рассрочка</Link>
          </div>
          {p.shortDescription && <p className="mt-8 text-lg leading-relaxed">{p.shortDescription}</p>}
          {p.description && <p className="mt-4 leading-relaxed text-stone-600">{p.description}</p>}
          {specs.length > 0 && <section className="mt-8"><h2 className="font-display text-xl">Характеристики</h2>
            <dl className="mt-3 divide-y divide-stone-200 border-y border-stone-200 text-sm">
              {specs.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-3"><dt className="text-stone-500">{k}</dt><dd className="min-w-0 break-words text-right">{v}</dd></div>)}</dl>
            <p className="mt-2 text-xs text-stone-500">Характеристики демонстрационные и будут сверены с данными поставщика.</p></section>}
        </div>
      </div>
      {related.length > 0 && <section className="mt-16"><h2 className="font-display mb-6 text-2xl sm:text-3xl">Ещё в категории «{cat?.name}»</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div></section>}
    </div>);
}
