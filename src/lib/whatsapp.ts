export function waLink(number: string, text: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

// حط رقمك بصيغة دولية من غير + في .env.local  (مثال: 201001234567)
export const businessNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "20XXXXXXXXXX";

export const defaultMessage = "مرحباً، عندي حاجة قديمة عاوز أبيعها.";
