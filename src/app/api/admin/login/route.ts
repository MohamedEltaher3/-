import { NextResponse } from "next/server";
import { checkPassword, COOKIE, cookieOptions, makeToken } from "@/lib/auth";

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ADMIN_PASSWORD مش متظبط على السيرفر" }, { status: 500 });
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 800)); // تبطيء المحاولات الغلط
    return NextResponse.json({ error: "الباسورد غلط" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await makeToken(), cookieOptions);
  return res;
}
