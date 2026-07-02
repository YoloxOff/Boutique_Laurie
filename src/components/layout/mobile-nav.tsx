"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BoutonRdv } from "./bouton-rdv";

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Ouvrir le menu" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle
            render={
              <Link href="/#home" onClick={() => setOpen(false)} className="self-start" aria-label="Laurie Coiffure — Accueil">
                <Image src="/laurie/logo.png" alt="Laurie Coiffure" width={395} height={351} className="h-14 w-auto" />
              </Link>
            }
          />
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 px-4">
          <BoutonRdv className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
