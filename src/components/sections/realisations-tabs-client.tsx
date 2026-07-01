"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MockGalleryItem } from "@/lib/mock/content";

const CATEGORIES = ["Mariage", "Quotidien"] as const;

export function RealisationsTabsClient({ gallery }: { gallery: MockGalleryItem[] }) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("Mariage");
  const direction = useRef(0);

  const activeIndex = CATEGORIES.indexOf(active);
  const select = (cat: (typeof CATEGORIES)[number]) => {
    const nextIndex = CATEGORIES.indexOf(cat);
    direction.current = nextIndex > activeIndex ? 1 : -1;
    setActive(cat);
  };

  const items = gallery.filter((item) => item.category === active);

  return (
    <div>
      <div className="mb-8 flex w-fit gap-1 rounded-xl bg-stone-200 p-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => select(cat)}
            aria-pressed={active === cat}
            className={cn(
              "rounded-lg px-6 py-2 text-sm font-semibold transition-colors",
              active === cat ? "bg-white text-[#c39c51]" : "text-stone-600 hover:text-stone-900"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction.current} initial={false}>
          <motion.div
            key={active}
            custom={direction.current}
            initial={{ x: direction.current >= 0 ? 48 : -48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction.current >= 0 ? -48 : 48, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
              {items.map((item) => (
                <div key={item.id} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#e6d5a3]">
                  <div className="relative w-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={600}
                      height={800}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
