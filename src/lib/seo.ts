export const siteName = "بيعها بسهولة";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

/** المحافظات/المدن اللي بتخدمها، مفصولة بفاصلة: "أسيوط, سوهاج, المنيا" */
export const areas = (process.env.NEXT_PUBLIC_AREAS ?? "")
  .split(/[,،]/)
  .map((s) => s.trim())
  .filter(Boolean);

export const areasText = areas.join("، ");

/** JSON-LD آمن للحقن في <script> */
export const jsonLd = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");
