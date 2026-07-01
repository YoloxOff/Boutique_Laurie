"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SimpleCarousel({
  images,
  className,
}: {
  images: { src: string; alt: string }[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <div className="relative h-[280px] sm:h-[340px] lg:h-[400px]">
        <Image
          src={images[index].src}
          alt={images[index].alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority={index === 0}
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Précédent"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/70 bg-white/70 p-1.5 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/90 sm:left-4 sm:p-2"
          >
            <ChevronLeft className="size-4 text-stone-700 sm:size-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Suivant"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/70 bg-white/70 p-1.5 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/90 sm:right-4 sm:p-2"
          >
            <ChevronRight className="size-4 text-stone-700 sm:size-5" />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                aria-label={`Aller à l'image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  i === index ? "w-4 bg-[#c39c51]" : "bg-white/70"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
