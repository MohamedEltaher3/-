import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addImages, createProduct, listProducts } from "@/lib/products";
import { parseProductForm } from "@/lib/parse";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ products: await listProducts() });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const parsed = await parseProductForm(await req.formData());
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    const id = await createProduct(parsed.data);
    await addImages(id, parsed.files);
    revalidatePath("/", "layout");
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
