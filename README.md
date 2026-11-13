# بيعها بسهولة

Next.js 14 + React + TypeScript + Tailwind + Postgres. التواصل كله على واتساب، ولوحة تحكم `/admin` لإضافة المنتجات.

## تشغيل محلي
```bash
npm install
cp .env.example .env.local   # عدّل القيم (خصوصًا DATABASE_URL و ADMIN_PASSWORD و رقم واتساب)
npm run dev
```
الجداول بتتعمل لوحدها أول مرة. لوحة التحكم: http://localhost:3000/admin

## النشر (Vercel + Neon)
1. اعمل قاعدة مجانية على https://neon.tech وانسخ الـ connection string.
2. ارفع المشروع على GitHub واربطه بـ Vercel.
3. في Vercel → Settings → Environment Variables ضيف القيم اللي في `.env.example`:
   `NEXT_PUBLIC_WHATSAPP_NUMBER`, `DATABASE_URL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_AREAS`.
4. Deploy، وبعدين ادخل `/admin` بالباسورد وضيف منتجاتك.

## ظهور الموقع في جوجل
1. اربط دومينك في Vercel وحط نفس الدومين في `NEXT_PUBLIC_SITE_URL`.
2. افتح https://search.google.com/search-console وضيف الدومين.
3. للتحقق: خد كود الـ HTML tag وحطه في `GOOGLE_SITE_VERIFICATION` (الجزء اللي في content بس) وأعد النشر.
4. من Sitemaps ضيف `sitemap.xml` ومن URL Inspection اطلب Request indexing للصفحة الرئيسية.
5. اعمل Google Business Profile لنشاطك — ده أهم حاجة للبحث المحلي.

## الملفات المهمة
- `src/lib/site.ts` الأقسام والنصوص والأسئلة الشائعة، والصور في `public/images/`.
- `src/components/AdminDashboard.tsx` لوحة التحكم.
- الصور المرفوعة بتتخزن في قاعدة البيانات (بتتصغّر تلقائيًا قبل الرفع).
