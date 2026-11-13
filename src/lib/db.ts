import { Pool, QueryResultRow } from "pg";

const g = globalThis as unknown as { __pool?: Pool; __schema?: Promise<void> };

function pool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!g.__pool) g.__pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  return g.__pool;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL,
  condition   TEXT NOT NULL DEFAULT 'WORKING',
  price       INTEGER,
  status      TEXT NOT NULL DEFAULT 'AVAILABLE',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS product_images (
  id         SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  mime       TEXT NOT NULL,
  data       BYTEA NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS product_images_product_idx ON product_images(product_id, position);
`;

/** بينشئ الجداول أول مرة لوحده — مفيش migrations يدوية */
export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const p = pool();
  if (!g.__schema) {
    g.__schema = p.query(SCHEMA).then(() => undefined);
    g.__schema.catch(() => { g.__schema = undefined; });
  }
  await g.__schema;
  return p.query<T>(text, params);
}
