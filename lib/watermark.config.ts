// Параметры водяного знака для скачиваемых фото. Оригиналы в public/ и originals/ не изменяются —
// знак рисуется только в копии, которую получает покупатель.
export const WATERMARK = {
  text: "Лампарди",            // требование заказчика
  font: 'Georgia, "Times New Roman", serif',
  weight: 600,
  sizeRatio: 0.055,           // высота шрифта относительно ширины фото
  minSize: 14, maxSize: 160,  // ограничения шрифта в пикселях — для маленьких и очень больших фото
  letterSpacing: 0.35,        // в долях высоты шрифта
  color: "rgba(255,255,255,.92)",
  shadow: "rgba(0,0,0,.6)",
  bandRatio: 0.16,            // высота затемнённой полосы внизу
  bandOpacity: 0.55,
  quality: 0.92,              // JPEG
  fileSuffix: "lampardi",
  // Разрешённые источники: только собственные фото каталога. Чужие картинки не обрабатываем.
  allowedPrefixes: ["/images/products/"],
} as const;
