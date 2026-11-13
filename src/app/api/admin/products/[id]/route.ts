import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addImages, countImages, deleteProduct, removeImages, setStatus, updateProduct } from "@/lib/products";
import { MAX_IMAGES, parseProductForm } from "@/lib/parse";

export const dynamic = "force-dynamic";

const idOf = (p: { id: string }) => Number(p.id);

// تعديل كامل (فورم) أو تغيير الحالة فقط (JSON {status})
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = idOf(params);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "id غلط" }, { status: 400 });
  try {
    if ((req.headers.get("content-type") ?? "").includes("application/json")) {
      const { status } = (await req.json()) as { status?: string };
      if (status !== "AVAILABLE" && status !== "SOLD") return NextResponse.json({ error: "حالة غلط" }, { status: 400 });
      await setStatus(id, status);
    } else {
      const parsed = await parseProductForm(await req.formData(), true);
      if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
      await updateProduct(id, parsed.data);
      await removeImages(id, parsed.removeIds);
      const remaining = await countImages(id);
      if (remaining + parsed.files.length > MAX_IMAGES) {
        return NextResponse.json({ error: `أقصى عدد صور ${MAX_IMAGES}` }, { status: 400 });
      }
      await addImages(id, parsed.files);
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = idOf(params);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "id غلط" }, { status: 400 });
  try {
    await deleteProduct(id);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
