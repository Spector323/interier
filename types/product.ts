export type Product = {
  id: string; name: string; slug: string; category: string;
  price: number; oldPrice?: number; image: string; hoverImage?: string; images: string[];
  description: string; shortDescription: string; material: string; color: string; power: string; dimensions: string;
  badge?: "new" | "hit"; stock: number;
  // Фото — временная иллюстрация, а не снимок реального товара
  illustrative?: boolean;
  // Можно ли отдавать фото покупателю на скачивание (с водяным знаком). По умолчанию — да.
  downloadable?: boolean;
};
