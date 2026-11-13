import { getImage } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return new Response("Not found", { status: 404 });
  try {
    const img = await getImage(id);
    if (!img) return new Response("Not found", { status: 404 });
    return new Response(new Uint8Array(img.data), {
      headers: { "Content-Type": img.mime, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Error", { status: 500 });
  }
}
