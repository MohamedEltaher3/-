import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WhatsAppIcon } from "@/components/Icons";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { businessNumber, defaultMessage, waLink } from "@/lib/whatsapp";
import { areasText, siteName, siteUrl } from "@/lib/seo";

const description =
  "بيع تكييفك وغسالتك وسخانك والحديد والخردة بأسعار حلوة وفلوس كاش. اتواصل معانا على واتساب وهنسعرلك ونيجي لحد عندك" +
  (areasText ? ` في ${areasText}.` : ".");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "بيعها بسهولة — شراء تكييفات وغسالات وسخانات وخردة وحديد",
    template: `%s | ${siteName}`,
  },
  description,
  keywords: ["شراء تكييف مستعمل", "شراء غسالة مستعملة", "شراء سخان", "شراء خردة", "شراء حديد خردة", "بيع أجهزة قديمة", "بيعها بسهولة"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName,
    url: "/",
    title: "بيعها بسهولة — بنشتري التكييفات والغسالات والسخانات والخردة",
    description,
    images: [{ url: "/images/scrap-1.jpg", width: 606, height: 404 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14213D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const wa = waLink(businessNumber, defaultMessage);
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800;900&display=swap" rel="stylesheet" />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 text-white backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <a href="#top" className="text-lg font-black sm:text-xl">
              بيعها <span className="text-tag">بسهولة</span>
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2 text-sm font-bold text-white shadow transition-transform active:scale-95 sm:px-5"
            >
              <WhatsAppIcon className="h-4 w-4" /> اتواصل معانا
            </a>
          </div>
        </header>
        {children}
        <FloatingWhatsApp />
        <footer className="bg-ink px-4 py-8 text-center text-sm text-white/70">
          بيعها بسهولة — بنشتري التكييفات والغسالات والسخانات والخردة والأجهزة القديمة{areasText ? ` — ${areasText}` : ""}
        </footer>
      </body>
    </html>
  );
}
