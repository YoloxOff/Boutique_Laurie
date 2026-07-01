import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { BoutonRdv } from "./bouton-rdv";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { getCartItemCount } from "@/lib/cart";

const NAV_LINKS = [
  { href: "/le-salon", label: "Le Salon" },
  { href: "/prestations", label: "Prestations" },
  { href: "/boutique", label: "Boutique" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const cartCount = await getCartItemCount();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 lg:hidden">
          <MobileNav links={NAV_LINKS} />
        </div>

        <Link href="/" className="font-heading text-2xl tracking-wide">
          Laurie <span className="italic text-accent-foreground/80">Coiffure</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            render={<Link href="/boutique?recherche=" aria-label="Rechercher" />}
          >
            <Search className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            render={<Link href="/compte/favoris" aria-label="Favoris" />}
          >
            <Heart className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" render={<Link href="/compte" aria-label="Mon compte" />}>
            <User className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            render={<Link href="/panier" aria-label="Panier" />}
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {cartCount}
              </span>
            )}
          </Button>
          <BoutonRdv className="ml-2 hidden md:inline-flex" />
        </div>
      </div>
    </header>
  );
}

export function HeaderMenuIcon() {
  return <Menu className="size-5" />;
}
