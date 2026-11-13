import type { MetadataRoute } from "next";
import { listProductsSafe } from "@/lib/products";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProductsSafe();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    ...products.map((p) => ({
      url: `${siteUrl}/products/${p.id}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
