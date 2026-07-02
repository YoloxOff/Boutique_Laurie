import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShieldCheck, ShoppingBag, User } from "lucide-react";
import { BoutonRdv } from "./bouton-rdv";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { getCartItemCount } from "@/lib/cart";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/admin/permissions";

const NAV_LINKS = [
  { href: "/#home", label: "Accueil" },
  { href: "/#pricing", label: "Tarifs" },
  { href: "/#marriage", label: "Mariage" },
  { href: "/#products", label: "Réalisations" },
  { href: "/boutique", label: "Boutique" },
  { href: "/#contact", label: "Contact" },
];

export async function Header() {
  const cartCount = await getCartItemCount();
  const session = await auth();
  const isAdmin = isAdminRole(session?.user?.role);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 lg:hidden">
          <MobileNav links={NAV_LINKS} />
        </div>

        <Link href="/" className="flex items-center" aria-label="Laurie Coiffure — Accueil">
          <Image src="/laurie/logo.png" alt="Laurie Coiffure" width={395} height={351} priority className="h-16 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-[#c39c51]"
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
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              render={<Link href="/admin" aria-label="Super admin" />}
            >
              <ShieldCheck className="size-5 text-[#c39c51]" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            render={<Link href="/panier" aria-label="Panier" />}
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#c39c51] text-[10px] font-semibold text-white">
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
