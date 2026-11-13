import Link from "next/link";
import { WhatsAppIcon } from "./Icons";
import { categoryName, conditionLabel, formatPrice } from "@/lib/product-types";
import type { Product } from "@/lib/product-types";
import { businessNumber, waLink } from "@/lib/whatsapp";
import { siteUrl } from "@/lib/seo";

export const productMessage = (p: Product) => `مرحباً، مهتم بـ "${p.name}" ${siteUrl}/products/${p.id}`;

export default function ProductCard({ p }: { p: Product }) {
  const sold = p.status === "SOLD";
  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-steel bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${sold ? "opacity-70" : ""}`}>
      <Link href={`/products/${p.id}`} className="relative block aspect-[4/3] overflow-hidden bg-ink/5">
        {p.imageIds[0] ? (
          <img src={`/api/img/${p.imageIds[0]}`} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">📦</div>
        )}
        {sold && <span className="absolute start-3 top-3 rounded-full bg-red-600 px-3 py-1 text-sm font-black text-white">اتباع</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold text-ink/60">{categoryName(p.category)} · {conditionLabel(p.condition)}</p>
        <h3 className="mt-1 text-lg font-black"><Link href={`/products/${p.id}`}>{p.name}</Link></h3>
        <p className="mt-1 font-black text-wa">{formatPrice(p.price)}</p>
        {!sold && (
          <a href={waLink(businessNumber, productMessage(p))} target="_blank" rel="noopener noreferrer"
             className="btn-shine mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-wa px-4 py-2.5 font-bold text-white transition-transform active:scale-95">
            <WhatsAppIcon className="h-5 w-5" /> اطلبه على واتساب
          </a>
        )}
      </div>
    </article>
  );
}
