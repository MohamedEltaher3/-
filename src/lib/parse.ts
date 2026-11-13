import { isCategory, isCondition, ProductInput } from "./product-types";

export const MAX_IMAGES = 6;
const MAX_TOTAL_BYTES = 4_000_000; // حد Vercel للطلب 4.5MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export type Parsed =
  | { ok: true; data: ProductInput; files: { mime: string; data: Buffer }[]; removeIds: number[] }
  | { ok: false; error: string };

export async function parseProductForm(f: FormData, partial = false): Promise<Parsed> {
  const name = String(f.get("name") ?? "").trim();
  const description = String(f.get("description") ?? "").trim();
  const category = String(f.get("category") ?? "");
  const condition = String(f.get("condition") ?? "WORKING");
  const priceRaw = String(f.get("price") ?? "").trim();

  if (name.length < 2 || name.length > 120) return { ok: false, error: "اكتب اسم المنتج (من 2 لـ 120 حرف)" };
  if (description.length > 2000) return { ok: false, error: "الوصف طويل جدًا" };
  if (!isCategory(category)) return { ok: false, error: "اختار القسم" };
  if (!isCondition(condition)) return { ok: false, error: "الحالة غير صحيحة" };

  let price: number | null = null;
  if (priceRaw !== "") {
    price = Number(priceRaw);
    if (!Number.isInteger(price) || price < 0 || price > 100_000_000) return { ok: false, error: "السعر لازم يكون رقم صحيح" };
  }

  const files: { mime: string; data: Buffer }[] = [];
  let total = 0;
  for (const v of f.getAll("images")) {
    if (typeof v === "string" || v.size === 0) continue;
    if (!ALLOWED.includes(v.type)) return { ok: false, error: "الصور لازم تكون JPG أو PNG أو WebP" };
    total += v.size;
    files.push({ mime: v.type, data: Buffer.from(await v.arrayBuffer()) });
  }
  if (total > MAX_TOTAL_BYTES) return { ok: false, error: "حجم الصور كبير، قلل عددها" };
  if (files.length > MAX_IMAGES) return { ok: false, error: `أقصى عدد صور ${MAX_IMAGES}` };

  let removeIds: number[] = [];
  try {
    removeIds = JSON.parse(String(f.get("removeImageIds") ?? "[]")).filter((n: unknown) => Number.isInteger(n));
  } catch {
    /* ignore */
  }
  void partial;
  return { ok: true, data: { name, description, category, condition, price }, files, removeIds };
}
