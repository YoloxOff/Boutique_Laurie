"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { MockGalleryItem } from "@/lib/mock/content";

const CATEGORIES = ["Mariage", "Quotidien"] as const;

export function RealisationsTabsClient({ gallery }: { gallery: MockGalleryItem[] }) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("Mariage");
  const [selected, setSelected] = useState<MockGalleryItem | null>(null);
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

      <div className="relative">
        <AnimatePresence mode="popLayout" custom={direction.current} initial={false}>
          <motion.div
            key={active}
            custom={direction.current}
            initial={{ x: direction.current >= 0 ? 48 : -48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction.current >= 0 ? -48 : 48, opacity: 0, position: "absolute", top: 0, left: 0, right: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item)}
                  aria-label={`Agrandir : ${item.title}`}
                  className="relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#e6d5a3] transition-transform hover:scale-[1.02]"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent showCloseButton className="max-w-[95vw] sm:max-w-3xl">
          <DialogTitle className="sr-only">{selected?.title ?? "Réalisation"}</DialogTitle>
          {selected && (
            <div className="relative h-[70vh] w-full overflow-hidden rounded-xl bg-stone-100">
              <Image src={selected.image} alt={selected.title} fill sizes="95vw" className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
