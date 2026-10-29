# Внешний источник каталога

Сейчас товары берутся из `data/seed.json` → `data/products.ts` через `lib/catalog/local.ts`.
Все страницы получают данные только через `lib/catalog` (`catalog.list / bySlug / slugs / facets`), поэтому
переход на БД — это реализация контракта на стороне API и `CATALOG_SOURCE=api`, `CATALOG_API_URL=...`.

## Контракт (`lib/catalog/remote.ts`)
| Запрос | Ответ |
|---|---|
| `GET /products?q&category&badge&color&material&min&max&sort&page&pageSize` | `{ items: Product[], total, page, pageSize }` |
| `GET /products/:slug` | `Product` или 404 |
| `GET /products/slugs` | `string[]` |
| `GET /facets` | `{ categories, colors, materials, priceMin, priceMax }` |

Семантика фильтров — как в `lib/catalog/filter.ts`: все условия через «И», `sort=asc|desc` по цене, поиск по названию, описанию, материалу, цвету.
Пагинация и фильтрация — на сервере; `pageSize` не больше 100.

## Фото
Файлы хранятся в файловом или объектном хранилище (S3-совместимое, CDN). В БД — только ссылки и метаданные
(`url`, ширина, высота, состояние `off|on`, право на скачивание `downloadable`, признак иллюстрации).
Если фото отдаются с другого домена, добавьте его в `lib/watermark.config.ts → allowedPrefixes` (полный URL) и
настройте CORS (`Access-Control-Allow-Origin`), иначе canvas не сможет наложить водяной знак; в `next.config.mjs` — `images.remotePatterns`.

## Что ещё не сделано
- Сама БД и API не созданы — их наполняет будущий парсер (в этом проекте парсер не пишется).
- Массовый импорт не реализован намеренно.
- `CollectionBrowser` на главной сейчас фильтрует переданные 12 демо-товаров в браузере. При подключении API
  нужно передавать ему первую страницу и подгружать следующие запросом к серверному маршруту с теми же параметрами URL.
