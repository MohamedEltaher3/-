// بيشتغل في الـ middleware (Edge) وفي الـ routes (Node) — Web Crypto بس.
export const COOKIE = "admin_session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const enc = new TextEncoder();

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

async function sign(msg: string, key: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function checkPassword(input: string): Promise<boolean> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  // مقارنة على الـ hash عشان نخفي الطول والتوقيت
  const [a, b] = await Promise.all([sign(input, "pw-check"), sign(pw, "pw-check")]);
  return safeEqual(a, b);
}

export async function makeToken(): Promise<string> {
  const s = secret();
  if (!s) throw new Error("ADMIN_PASSWORD is not set");
  const exp = String(Date.now() + MAX_AGE_MS);
  return `${exp}.${await sign(exp, s)}`;
}

export async function verifyToken(token: string | undefined | null): Promise<boolean> {
  const s = secret();
  if (!s || !token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await sign(exp, s));
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_MS / 1000,
};
