import Link from "next/link";
import { LogOut } from "lucide-react";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-signout-action";

const NAV = [
  { href: "/compte", label: "Tableau de bord" },
  { href: "/compte/commandes", label: "Mes commandes" },
  { href: "/compte/adresses", label: "Mes adresses" },
  { href: "/compte/favoris", label: "Mes favoris" },
  { href: "/compte/parametres", label: "Paramètres" },
];

export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <p className="font-heading text-lg">Bonjour {session?.user?.name ?? ""}</p>
          <nav className="mt-6 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            {session?.user?.role === "admin" && (
              <Link href="/admin" className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground">
                Back-office
              </Link>
            )}
            <form action={signOutAction}>
              <button
                type="submit"
                className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="size-4" /> Se déconnecter
              </button>
            </form>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
