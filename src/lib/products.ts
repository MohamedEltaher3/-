import { query } from "./db";
import type { Product, ProductInput } from "./product-types";

type Row = {
  id: number; name: string; description: string; category: string; condition: string;
  price: number | null; status: string; created_at: Date; image_ids: number[] | null;
};

const SELECT = `
  SELECT p.id, p.name, p.description, p.category, p.condition, p.price, p.status, p.created_at,
         ARRAY(SELECT i.id FROM product_images i WHERE i.product_id = p.id ORDER BY i.position, i.id) AS image_ids
  FROM products p`;

const map = (r: Row): Product => ({
  id: r.id,
  name: r.name,
  description: r.description,
  category: r.category,
  condition: r.condition,
  price: r.price,
  status: r.status === "SOLD" ? "SOLD" : "AVAILABLE",
  createdAt: r.created_at.toISOString(),
  imageIds: r.image_ids ?? [],
});

/** للموقع العام: لو الداتا مش متوصلة بيرجع فاضي بدل ما الصفحة تقع */
export async function listProductsSafe(): Promise<Product[]> {
  try {
    return await listProducts();
  } catch (e) {
    console.error("listProducts failed:", (e as Error).message);
    return [];
  }
}

export async function listProducts(): Promise<Product[]> {
  const { rows } = await query<Row>(`${SELECT} ORDER BY (p.status = 'SOLD'), p.created_at DESC, p.id DESC`);
  return rows.map(map);
}

export async function getProduct(id: number): Promise<Product | null> {
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    const { rows } = await query<Row>(`${SELECT} WHERE p.id = $1`, [id]);
    return rows[0] ? map(rows[0]) : null;
  } catch (e) {
    console.error("getProduct failed:", (e as Error).message);
    return null;
  }
}

export async function createProduct(d: ProductInput): Promise<number> {
  const { rows } = await query<{ id: number }>(
    `INSERT INTO products (name, description, category, condition, price) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [d.name, d.description, d.category, d.condition, d.price],
  );
  return rows[0].id;
}

export async function updateProduct(id: number, d: ProductInput) {
  await query(`UPDATE products SET name=$2, description=$3, category=$4, condition=$5, price=$6 WHERE id=$1`, [
    id, d.name, d.description, d.category, d.condition, d.price,
  ]);
}

export async function setStatus(id: number, status: "AVAILABLE" | "SOLD") {
  await query(`UPDATE products SET status=$2 WHERE id=$1`, [id, status]);
}

export async function deleteProduct(id: number) {
  await query(`DELETE FROM products WHERE id=$1`, [id]);
}

export async function addImages(productId: number, files: { mime: string; data: Buffer }[]) {
  const { rows } = await query<{ n: number }>(
    `SELECT COALESCE(MAX(position), -1) + 1 AS n FROM product_images WHERE product_id=$1`, [productId],
  );
  let pos = rows[0].n;
  for (const f of files) {
    await query(`INSERT INTO product_images (product_id, mime, data, position) VALUES ($1,$2,$3,$4)`, [
      productId, f.mime, f.data, pos++,
    ]);
  }
}

export async function removeImages(productId: number, ids: number[]) {
  if (!ids.length) return;
  await query(`DELETE FROM product_images WHERE product_id=$1 AND id = ANY($2::int[])`, [productId, ids]);
}

export async function countImages(productId: number): Promise<number> {
  const { rows } = await query<{ n: string }>(`SELECT COUNT(*) AS n FROM product_images WHERE product_id=$1`, [productId]);
  return Number(rows[0].n);
}

export async function getImage(id: number) {
  const { rows } = await query<{ mime: string; data: Buffer }>(`SELECT mime, data FROM product_images WHERE id=$1`, [id]);
  return rows[0] ?? null;
}

