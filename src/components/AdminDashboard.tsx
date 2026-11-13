"use client";

import { useRef, useState } from "react";
import { categories } from "@/lib/site";
import { CONDITIONS, Product, categoryName, conditionLabel, formatPrice } from "@/lib/product-types";

const MAX_IMAGES = 6;
const field = "mt-1 w-full rounded-lg border border-steel bg-white px-3 py-3 text-base";

/** بيصغّر الصورة قبل الرفع (عشان الموبايل والسرعة وحد حجم الطلب) */
async function compress(file: File): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("مش قادر أقرا الصورة: " + file.name));
      i.src = url;
    });
    const max = 1100;
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    if (!blob) throw new Error("فشل ضغط الصورة");
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(url);
  }
}

type Draft = { id?: number; name: string; description: string; category: string; condition: string; price: string };
const empty: Draft = { name: "", description: "", category: categories[0].slug, condition: "WORKING", price: "" };

export default function AdminDashboard({ initial, dbError }: { initial: Product[]; dbError: string }) {
  const [products, setProducts] = useState(initial);
  const [draft, setDraft] = useState<Draft>(empty);
  const [existing, setExisting] = useState<number[]>([]);
  const [removed, setRemoved] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(dbError ? { type: "err", text: "مشكلة في قاعدة البيانات: " + dbError } : null);
  const formRef = useRef<HTMLFormElement>(null);

  const editing = draft.id != null;
  const totalImages = existing.length - removed.length + newFiles.length;

  async function refresh() {
    const res = await fetch("/api/admin/products", { cache: "no-store" });
    if (res.status === 401) return (window.location.href = "/admin/login");
    const data = await res.json();
    if (res.ok) setProducts(data.products);
  }

  function reset() {
    newFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    setDraft(empty);
    setExisting([]);
    setRemoved([]);
    setNewFiles([]);
  }

  function startEdit(p: Product) {
    reset();
    setDraft({ id: p.id, name: p.name, description: p.description, category: p.category, condition: p.condition, price: p.price == null ? "" : String(p.price) });
    setExisting(p.imageIds);
    setMsg(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function pickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    const room = MAX_IMAGES - totalImages;
    if (picked.length > room) setMsg({ type: "err", text: `أقصى عدد صور ${MAX_IMAGES}` });
    try {
      const out = await Promise.all(picked.slice(0, Math.max(0, room)).map(compress));
      setNewFiles((cur) => [...cur, ...out.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    } catch (err) {
      setMsg({ type: "err", text: (err as Error).message });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const fd = new FormData();
    fd.set("name", draft.name);
    fd.set("description", draft.description);
    fd.set("category", draft.category);
    fd.set("condition", draft.condition);
    fd.set("price", draft.price);
    if (editing) fd.set("removeImageIds", JSON.stringify(removed));
    newFiles.forEach((f) => fd.append("images", f.file));
    try {
      const res = await fetch(editing ? `/api/admin/products/${draft.id}` : "/api/admin/products", {
        method: editing ? "PATCH" : "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "حصلت مشكلة");
      setMsg({ type: "ok", text: editing ? "اتحفظ التعديل ✔" : "اتضاف المنتج ✔" });
      reset();
      await refresh();
    } catch (err) {
      setMsg({ type: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function toggleSold(p: Product) {
    const status = p.status === "SOLD" ? "AVAILABLE" : "SOLD";
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await refresh();
    else setMsg({ type: "err", text: "ما اتغيرتش الحالة" });
  }

  async function remove(p: Product) {
    if (!confirm(`تحذف "${p.name}" نهائيًا؟`)) return;
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      if (draft.id === p.id) reset();
      await refresh();
    } else setMsg({ type: "err", text: "ما اتحذفش" });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black sm:text-3xl">لوحة التحكم</h1>
        <div className="flex gap-2 text-sm font-bold">
          <a href="/" target="_blank" className="rounded-lg border border-steel bg-white px-4 py-2">عرض الموقع</a>
          <button onClick={logout} className="rounded-lg bg-ink px-4 py-2 text-white">خروج</button>
        </div>
      </div>

      {msg && (
        <p role="status" className={`mt-4 rounded-lg px-4 py-3 font-bold ${msg.type === "ok" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {msg.text}
        </p>
      )}

      <form ref={formRef} onSubmit={submit} className="mt-6 scroll-mt-20 space-y-4 rounded-2xl border border-steel bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">{editing ? `تعديل: ${draft.name || "منتج"}` : "إضافة منتج للبيع"}</h2>

        <label className="block font-semibold">اسم المنتج
          <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="تكييف شارب 1.5 حصان" className={field} />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block font-semibold">القسم
            <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={field}>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </label>
          <label className="block font-semibold">الحالة
            <select value={draft.condition} onChange={(e) => setDraft({ ...draft, condition: e.target.value })} className={field}>
              {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
          <label className="block font-semibold">السعر بالجنيه (اختياري)
            <input type="number" inputMode="numeric" min={0} value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className={field} />
          </label>
        </div>

        <label className="block font-semibold">الوصف (اختياري)
          <textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={field} />
        </label>

        <div>
          <p className="font-semibold">الصور ({totalImages}/{MAX_IMAGES})</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {existing.filter((id) => !removed.includes(id)).map((id) => (
              <div key={id} className="relative h-24 w-24 overflow-hidden rounded-lg border border-steel">
                <img src={`/api/img/${id}`} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setRemoved([...removed, id])} aria-label="شيل الصورة" className="absolute end-1 top-1 h-7 w-7 rounded-full bg-black/70 text-white">×</button>
              </div>
            ))}
            {newFiles.map((f, i) => (
              <div key={f.preview} className="relative h-24 w-24 overflow-hidden rounded-lg border-2 border-tag">
                <img src={f.preview} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => { URL.revokeObjectURL(f.preview); setNewFiles(newFiles.filter((_, j) => j !== i)); }} aria-label="شيل الصورة" className="absolute end-1 top-1 h-7 w-7 rounded-full bg-black/70 text-white">×</button>
              </div>
            ))}
            {totalImages < MAX_IMAGES && (
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-ink/40 text-center text-sm font-bold text-ink/70">
                <span className="text-2xl">＋</span>صورة
                <input type="file" accept="image/*" multiple className="sr-only" onChange={pickFiles} />
              </label>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button disabled={busy} className="rounded-lg bg-wa px-6 py-3 font-bold text-white disabled:opacity-60">
            {busy ? "جاري الحفظ..." : editing ? "حفظ التعديل" : "إضافة"}
          </button>
          {editing && <button type="button" onClick={reset} className="rounded-lg border border-steel px-6 py-3 font-bold">إلغاء</button>}
        </div>
      </form>

      <h2 className="mt-10 text-xl font-black">المنتجات ({products.length})</h2>
      {products.length === 0 && <p className="mt-3 text-ink/70">لسه مفيش منتجات. ضيف أول منتج من الفورم اللي فوق.</p>}
      <ul className="mt-4 space-y-3">
        {products.map((p) => (
          <li key={p.id} className="flex gap-3 rounded-2xl border border-steel bg-white p-3">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-paper">
              {p.imageIds[0] && <img src={`/api/img/${p.imageIds[0]}`} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-black">{p.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.status === "SOLD" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                  {p.status === "SOLD" ? "اتباع" : "متاح"}
                </span>
              </div>
              <p className="text-sm text-ink/70">{categoryName(p.category)} · {conditionLabel(p.condition)} · {formatPrice(p.price)}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-sm font-bold">
                <button onClick={() => startEdit(p)} className="rounded-lg border border-steel px-3 py-1.5">تعديل</button>
                <button onClick={() => toggleSold(p)} className="rounded-lg border border-steel px-3 py-1.5">{p.status === "SOLD" ? "رجّعه متاح" : "علّمه اتباع"}</button>
                <a href={`/products/${p.id}`} target="_blank" className="rounded-lg border border-steel px-3 py-1.5">فتح</a>
                <button onClick={() => remove(p)} className="rounded-lg border border-red-300 px-3 py-1.5 text-red-700">حذف</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
