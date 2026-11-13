"use client";

import { useState } from "react";

export default function ProductGallery({ ids, alt }: { ids: number[]; alt: string }) {
  const [i, setI] = useState(0);
  if (!ids.length) return <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-ink/5 text-6xl">📦</div>;
  return (
    <div>
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5">
        <img src={`/api/img/${ids[i]}`} alt={alt} className="h-full w-full object-contain" />
      </div>
      {ids.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {ids.map((id, idx) => (
            <button key={id} onClick={() => setI(idx)} aria-label={`صورة ${idx + 1}`}
              className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${idx === i ? "border-tag" : "border-transparent opacity-70"}`}>
              <img src={`/api/img/${id}`} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
