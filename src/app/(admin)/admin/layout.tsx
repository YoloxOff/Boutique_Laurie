import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-signout-action";
import { isDatabaseConfigured } from "@/db";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/codes-promo", label: "Codes promo" },
  { href: "/admin/avis", label: "Avis" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense en profondeur : le middleware protege deja /admin, on revérifie ici
  // (et dans chaque Server Action/route admin) pour ne jamais dependre uniquement du middleware.
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/connexion?callbackUrl=/admin");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl">
      <aside className="w-64 shrink-0 border-r border-border p-6">
        <Link href="/admin" className="font-heading text-xl">
          Laurie <span className="italic">Admin</span>
        </Link>
        {!isDatabaseConfigured && (
          <p className="mt-3 rounded-md bg-secondary p-2 text-xs text-muted-foreground">
            Mode démo — Neon non configuré. Les données affichées sont des exemples en lecture
            seule.
          </p>
        )}
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/" className="mt-4 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground">
            Retour au site
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
            >
              Se déconnecter
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
