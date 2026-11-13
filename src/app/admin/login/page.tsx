"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) window.location.href = "/admin";
      else setError(data.error ?? "حصلت مشكلة");
    } catch {
      setError("مفيش اتصال بالإنترنت");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4">
      <form onSubmit={submit} className="w-full space-y-4 rounded-2xl border border-steel bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black">دخول الأدمن</h1>
        <label className="block font-semibold">
          الباسورد
          <input
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-steel px-3 py-3 text-lg"
          />
        </label>
        {error && <p role="alert" className="font-semibold text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-ink px-4 py-3 font-bold text-white disabled:opacity-60">
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </main>
  );
}
