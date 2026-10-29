// group — раздел ассортимента. Категория показывается в каталоге, только когда в ней есть реальные товары
// (lib/categories-active.ts); пустые выводятся лишь списком «Скоро в ассортименте», без фиктивных карточек.
export type Category = { slug: string; name: string; group: "light" | "electric" | "decor" };
export const CATEGORIES: Category[] = [
  { slug: "chandeliers", name: "Люстры", group: "light" }, { slug: "pendants", name: "Подвесные светильники", group: "light" },
  { slug: "ceiling", name: "Потолочные светильники", group: "light" }, { slug: "sconces", name: "Бра", group: "light" },
  { slug: "floor", name: "Торшеры", group: "light" }, { slug: "table", name: "Настольные лампы", group: "light" },
  { slug: "led", name: "LED", group: "light" }, { slug: "track", name: "Трековые системы", group: "light" },
  { slug: "outdoor", name: "Уличное освещение", group: "light" },
  { slug: "lamps", name: "Лампы", group: "light" }, { slug: "floodlights", name: "Прожекторы", group: "light" },
  { slug: "outlets", name: "Розетки и выключатели", group: "electric" },
  { slug: "curtain-rods", name: "Карнизы и гардины", group: "decor" }, { slug: "baguettes", name: "Багеты", group: "decor" },
];
