import Reveal from "@/components/Reveal";
import ImageSlider from "@/components/ImageSlider";
import { CategoryIcon, WhatsAppIcon } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";
import { categories, faq, perks, steps, ticker, wallImages } from "@/lib/site";
import { listProductsSafe } from "@/lib/products";
import { areas, areasText, jsonLd, siteName, siteUrl } from "@/lib/seo";
import { businessNumber, defaultMessage, waLink } from "@/lib/whatsapp";

/** عمود صور بيتحرك لفوق أو لتحت (مكرر مرتين عشان اللف يبقى سلس) */
function WallColumn({ offset, dir, className = "" }: { offset: number; dir: "up" | "down"; className?: string }) {
  const list = [...wallImages.slice(offset), ...wallImages.slice(0, offset)];
  const doubled = [...list, ...list];
  return (
    <div className={`w-28 shrink-0 sm:w-40 lg:w-52 ${className}`}>
      <div className={`flex flex-col gap-3 sm:gap-4 ${dir === "up" ? "wall-up" : "wall-down wall-slow"}`}>
        {doubled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="aspect-[3/4] w-full rounded-xl object-cover"
          />
        ))}
      </div>
    </div>
  );
}

export const revalidate = 60;

export default async function Home() {
  const wa = waLink(businessNumber, defaultMessage);
  const products = await listProductsSafe();
  const digits = businessNumber.replace(/\D/g, "");
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: siteName,
      url: siteUrl,
      image: `${siteUrl}/images/scrap-1.jpg`,
      description: "بنشتري التكييفات والغسالات والسخانات والحديد والخردة والأجهزة القديمة، أسعار حلوة وفلوس كاش ونستلم لحد عندك.",
      ...(digits && !digits.includes("X") && { telephone: `+${digits}` }),
      areaServed: areas.length ? areas : "مصر",
      paymentAccepted: "Cash",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <main id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 -z-20 flex items-center justify-center" aria-hidden="true">
          <div className="flex h-[160%] w-[140%] -rotate-[8deg] justify-center gap-3 opacity-40 sm:gap-4">
            <WallColumn offset={0} dir="up" />
            <WallColumn offset={3} dir="down" />
            <WallColumn offset={6} dir="up" />
            <WallColumn offset={2} dir="down" className="hidden sm:block" />
            <WallColumn offset={5} dir="up" className="hidden lg:block" />
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-ink/70 to-ink" aria-hidden="true" />

        {/* ديكور متحرك */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden text-tag/25" aria-hidden="true">
          <CategoryIcon kind="gear" className="spin-slow absolute -start-10 top-24 h-40 w-40 sm:h-64 sm:w-64" />
          <CategoryIcon kind="gear" className="spin-rev absolute -end-8 bottom-10 h-32 w-32 sm:h-52 sm:w-52" />
          <span className="float absolute end-[12%] top-24 hidden rounded-full bg-tag px-4 py-2 text-sm font-black text-ink shadow-lg sm:block" style={{ ["--r" as string]: "-8deg" }}>
            كاش 💵
          </span>
          <span className="float absolute start-[28%] top-20 hidden rounded-full bg-white px-4 py-2 text-sm font-black text-ink shadow-lg sm:block" style={{ ["--r" as string]: "6deg", animationDelay: "1.2s" }}>
            لحد عندك 🚚
          </span>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 lg:py-36">
          <p className="rise-1 inline-block rounded-full border border-tag/60 px-4 py-1 text-sm font-bold text-tag">
            بنشتري من بيتك — وبندفع كاش
          </p>
          <h1 className="rise-2 mt-5 max-w-3xl text-4xl font-black leading-[1.25] sm:text-5xl lg:text-6xl">
            عندك <span className="text-tag">تكييف</span> أو <span className="text-tag">غسالة</span> أو{" "}
            <span className="text-tag">سخان</span> أو <span className="text-tag">خردة</span>؟ بيعها بسهولة.
          </h1>
          <p className="rise-3 mt-6 max-w-xl text-lg leading-8 text-white/85">
            اتواصل معانا على واتساب وهنسعرلك. أسعار حلوة، فلوس كاش في إيدك، ونيجي نستلم لحد عندك.
            {areasText && <span className="mt-2 block font-bold text-tag">بنخدم: {areasText}</span>}
          </p>
          <div className="rise-4 mt-9 flex flex-wrap items-center gap-4">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine pulse-ring inline-flex items-center gap-3 rounded-full bg-wa px-8 py-4 text-lg font-black text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              <WhatsAppIcon className="h-6 w-6" /> اتواصل معانا
            </a>
            <a href="#categories" className="font-bold text-white/90 underline-offset-4 hover:underline">
              شوف بنشتري إيه ↓
            </a>
          </div>
        </div>
      </section>

      {/* ---------- شريط متحرك ---------- */}
      <div className="overflow-hidden bg-tag py-3 text-ink" dir="ltr" aria-hidden="true">
        <div className="marquee flex w-max whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center" dir="rtl">
              {ticker.map((t) => (
                <span key={t + k} className="mx-5 text-lg font-black">
                  {t} <span className="mx-3 opacity-50">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- الأقسام ---------- */}
      <section id="categories" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:py-20">
        <Reveal>
          <h2 className="text-3xl font-black sm:text-4xl">بنشتري إيه؟</h2>
          <p className="mt-2 text-lg text-ink/70">شغال أو عطلان، جديد أو قديم — ابعتلنا صورة وهنسعرلك.</p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 100}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-steel bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                  <ImageSlider images={c.images} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <div className="absolute end-3 top-3 rounded-full bg-tag p-2 text-ink shadow-lg">
                    <CategoryIcon kind={c.icon} className="h-8 w-8" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-black">{c.name}</h3>
                  <p className="mt-2 flex-1 leading-7 text-ink/75">{c.tagline}</p>
                  <a
                    href={waLink(businessNumber, c.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shine mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-wa px-5 py-3 font-bold text-white transition-transform active:scale-95"
                  >
                    <WhatsAppIcon className="h-5 w-5" /> اتواصل معانا
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- المعروض للبيع ---------- */}
      {products.length > 0 && (
        <section id="products" className="mx-auto max-w-6xl scroll-mt-16 px-4 pb-16 sm:pb-20">
          <Reveal>
            <h2 className="text-3xl font-black sm:text-4xl">المعروض للبيع</h2>
            <p className="mt-2 text-lg text-ink/70">أجهزة جاهزة — اطلبها على واتساب.</p>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 100}><ProductCard p={p} /></Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------- ليه إحنا ---------- */}
      <section className="bg-ink px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-3xl font-black sm:text-4xl">ليه تبيع لينا؟</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 120}>
                <div className="h-full rounded-2xl border border-white/15 bg-white/5 p-6 transition-colors hover:bg-white/10">
                  <div className="float text-5xl" style={{ animationDelay: `${i * 0.6}s` }}>{p.icon}</div>
                  <h3 className="mt-4 text-xl font-black text-tag">{p.title}</h3>
                  <p className="mt-2 leading-7 text-white/80">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- الخطوات ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <Reveal>
          <h2 className="text-3xl font-black sm:text-4xl">الموضوع بسيط</h2>
        </Reveal>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 130}>
              <li className="relative h-full list-none rounded-2xl border-2 border-dashed border-ink/40 bg-white p-6">
                <span className="absolute -top-5 start-6 flex h-10 w-10 items-center justify-center rounded-full bg-tag text-xl font-black text-ink shadow">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-xl font-black">{s.title}</h3>
                <p className="mt-2 leading-7 text-ink/75">{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------- أسئلة شائعة ---------- */}
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:pb-20">
        <Reveal><h2 className="text-3xl font-black sm:text-4xl">أسئلة شائعة</h2></Reveal>
        <div className="mt-8 space-y-3">
          {faq.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="group rounded-xl border border-steel bg-white p-4 open:shadow-md">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-black">
                  {f.q}<span className="text-xl transition-transform group-open:rotate-45" aria-hidden="true">＋</span>
                </summary>
                <p className="mt-3 leading-7 text-ink/80">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="relative isolate overflow-hidden bg-tag px-4 py-16 text-center text-ink sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 text-ink/10" aria-hidden="true">
          <CategoryIcon kind="gear" className="spin-slow absolute -start-12 -top-12 h-56 w-56" />
          <CategoryIcon kind="fan" className="spin-med absolute -end-10 -bottom-10 h-52 w-52" />
        </div>
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-3xl font-black leading-snug sm:text-4xl">
            جاهز تبيع؟ ابعتلنا صورة وهنسعرلك.
          </h2>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine pulse-ring mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-9 py-4 text-lg font-black text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            <WhatsAppIcon className="h-6 w-6 text-wa" /> اتواصل معانا
          </a>
        </Reveal>
      </section>
    </main>
  );
}
