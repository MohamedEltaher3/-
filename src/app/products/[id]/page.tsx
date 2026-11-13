import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { categoryName, conditionLabel, formatPrice } from "@/lib/product-types";
import { businessNumber, waLink } from "@/lib/whatsapp";
import { jsonLd, siteName, siteUrl } from "@/lib/seo";
import ProductGallery from "@/components/ProductGallery";
import { WhatsAppIcon } from "@/components/Icons";
import { productMessage } from "@/components/ProductCard";

export const revalidate = 60;

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct(Number(params.id));
  if (!p) return { title: "منتج غير موجود", robots: { index: false } };
  const desc = (p.description || `${p.name} — ${categoryName(p.category)} ${conditionLabel(p.condition)} للبيع. ${formatPrice(p.price)}.`).slice(0, 160);
  const img = p.imageIds[0] ? `${siteUrl}/api/img/${p.imageIds[0]}` : undefined;
  return {
    title: `${p.name} للبيع`,
    description: desc,
    alternates: { canonical: `/products/${p.id}` },
    openGraph: { title: `${p.name} — ${siteName}`, description: desc, url: `/products/${p.id}`, type: "website", images: img ? [img] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const p = await getProduct(Number(params.id));
  if (!p) notFound();
  const sold = p.status === "SOLD";

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description || undefined,
    image: p.imageIds.map((id) => `${siteUrl}/api/img/${id}`),
    category: categoryName(p.category),
    itemCondition: "https://schema.org/UsedCondition",
    ...(p.price != null && {
      offers: {
        "@type": "Offer",
        url: `${siteUrl}/products/${p.id}`,
        price: p.price,
        priceCurrency: "EGP",
        availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      },
    }),
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <nav className="mb-5 text-sm text-ink/70"><Link href="/" className="font-bold underline-offset-4 hover:underline">الرئيسية</Link> › {categoryName(p.category)}</nav>
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery ids={p.imageIds} alt={p.name} />
        <div>
          <p className="text-sm font-bold text-ink/60">{categoryName(p.category)} · {conditionLabel(p.condition)}</p>
          <h1 className="mt-2 text-3xl font-black leading-snug">{p.name}</h1>
          <p className="mt-3 text-2xl font-black text-wa">{formatPrice(p.price)}</p>
          {sold && <p className="mt-3 inline-block rounded-full bg-red-600 px-4 py-1 font-black text-white">اتباع</p>}
          {p.description && <p className="mt-5 whitespace-pre-line leading-8 text-ink/85">{p.description}</p>}
          {!sold && (
            <a href={waLink(businessNumber, productMessage(p))} target="_blank" rel="noopener noreferrer"
               className="btn-shine mt-8 inline-flex items-center gap-3 rounded-full bg-wa px-8 py-4 text-lg font-black text-white shadow-lg transition-transform active:scale-95">
              <WhatsAppIcon className="h-6 w-6" /> اطلبه على واتساب
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
