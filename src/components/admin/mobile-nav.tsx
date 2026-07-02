"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type NavItem = { href: string; label: string };

export function AdminMobileNav({
  mainNav,
  secondaryNav,
  signOutAction,
}: {
  mainNav: NavItem[];
  secondaryNav: NavItem[];
  signOutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const linkClassName = "rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Ouvrir le menu admin" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-xl">
            Laurie <span className="italic">Admin</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={linkClassName}>
              {item.label}
            </Link>
          ))}
          {secondaryNav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={linkClassName}>
              {item.label}
            </Link>
          ))}
          <Link href="/" onClick={() => setOpen(false)} className={`mt-4 ${linkClassName}`}>
            Retour au site
          </Link>
          <form action={signOutAction}>
            <button type="submit" className={`w-full text-left ${linkClassName}`}>
              Se déconnecter
            </button>
          </form>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
