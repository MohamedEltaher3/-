import { categories } from "./site";

export const CONDITIONS = [
  { value: "WORKING", label: "شغال" },
  { value: "NEEDS_REPAIR", label: "محتاج صيانة" },
  { value: "SCRAP", label: "خردة / عطلان" },
] as const;

export const conditionLabel = (v: string) => CONDITIONS.find((c) => c.value === v)?.label ?? v;
export const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
export const isCategory = (v: string) => categories.some((c) => c.slug === v);
export const isCondition = (v: string) => CONDITIONS.some((c) => c.value === v);

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  condition: string;
  price: number | null;
  status: "AVAILABLE" | "SOLD";
  createdAt: string;
  imageIds: number[];
};

export type ProductInput = {
  name: string; description: string; category: string; condition: string; price: number | null;
};

export const formatPrice = (p: number | null) => (p == null ? "السعر على واتساب" : `${p.toLocaleString("ar-EG")} جنيه`);
