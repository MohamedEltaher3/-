"use client";

import { useEffect, useState } from "react";

type Img = { src: string; alt: string };

/** سلايدر صور بتتبدل لوحدها مع تكبير بطيء (Ken Burns) */
export default function ImageSlider({ images, interval = 3600 }: { images: Img[]; interval?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0">
      {images.map((img, idx) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          loading={idx === 0 ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className={`kenburns absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-3 start-3 flex gap-1.5" aria-hidden="true">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full bg-white transition-all duration-500 ${idx === i ? "w-5 opacity-100" : "w-1.5 opacity-50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
