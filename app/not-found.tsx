import Link from "next/link";
import OpenManagerButton from "@/components/OpenManagerButton";
export default function NotFound() {
  return (<div className="bg-gradient-to-b from-milk via-blush/60 to-milk"><div className="mx-auto max-w-xl px-4 py-24 text-center sm:py-32">
    <p className="font-display text-7xl text-accent sm:text-8xl">404</p>
    <h1 className="font-display mt-4 text-3xl sm:text-4xl">Страница не найдена</h1>
    <p className="mt-4 text-stone-600">Возможно, ссылка устарела или страница была перемещена.</p>
    <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
      <Link href="/#collection" className="flex min-h-12 items-center justify-center rounded-full bg-accent px-7 py-3 font-medium text-white transition hover:bg-[#c93816]">Перейти в каталог</Link>
      <OpenManagerButton className="min-h-12 rounded-full border border-graphite/30 px-7 py-3 transition hover:border-accent hover:text-accent">Спросить менеджера</OpenManagerButton></div>
  </div></div>);
}
