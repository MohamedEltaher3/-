import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verifyToken } from "@/lib/auth";
import { listProducts } from "@/lib/products";
import type { Product } from "@/lib/product-types";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "لوحة التحكم", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await verifyToken(cookies().get(COOKIE)?.value))) redirect("/admin/login");

  let products: Product[] = [];
  let dbError = "";
  try {
    products = await listProducts();
  } catch (e) {
    dbError = (e as Error).message;
  }
  return <AdminDashboard initial={products} dbError={dbError} />;
}
