// Контакты задаются только конфигурацией (.env.local / переменные окружения хостинга), см. .env.example.
// Пока номер не задан, кнопки звонка не показываются — тестовый номер на сайт не попадает.
export const PHONE = (process.env.NEXT_PUBLIC_MANAGER_PHONE ?? "").trim();
export const PHONE_HREF = PHONE ? "tel:" + PHONE.replace(/[^+\d]/g, "") : "";
// Логотип: красный вариант 1 (красный металл) или 2 (красный «огонь»). Переключите на "red-2", чтобы сменить.
// Золотой вариант: "gold" (файлы gold.png и gold-anim.png лежат в public/logo-variants).
const LOGO_NAME = "red-1";
export const LOGO = `/logo-variants/${LOGO_NAME}.png`;
export const LOGO_ANIM = `/logo-variants/${LOGO_NAME}-anim.png`;
// Мессенджеры менеджера. Заполните — и кнопки появятся в окне «Помощь менеджера».
export const WHATSAPP = (process.env.NEXT_PUBLIC_MANAGER_WHATSAPP ?? "").replace(/\D/g, ""); // номер без «+», например 79990001122
export const TELEGRAM = (process.env.NEXT_PUBLIC_MANAGER_TELEGRAM ?? "").replace(/^@/, "").trim(); // имя пользователя без «@»
export const HAS_DIRECT_CONTACT = Boolean(PHONE || WHATSAPP || TELEGRAM);
