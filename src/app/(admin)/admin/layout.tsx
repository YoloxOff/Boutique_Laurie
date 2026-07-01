import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-signout-action";
import { isDatabaseConfigured } from "@/db";
import { LoginForm } from "@/components/forms/login-form";
import { can, isAdminRole, type PermissionKey } from "@/lib/admin/permissions";

const NAV: { href: string; label: string; permission?: PermissionKey }[] = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/produits", label: "Produits", permission: "products" },
  { href: "/admin/commandes", label: "Commandes", permission: "orders" },
  { href: "/admin/clients", label: "Clients", permission: "customers" },
  { href: "/admin/codes-promo", label: "Codes promo", permission: "promotions" },
  { href: "/admin/avis", label: "Avis", permission: "reviews" },
  { href: "/admin/newsletter", label: "Newsletter", permission: "newsletter" },
  { href: "/admin/messages", label: "Messages", permission: "messages" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // L'espace admin gère sa propre connexion, entièrement séparée de /connexion (comptes clients) :
  // pas de redirection, on affiche le formulaire directement ici quand la session n'est pas admin.
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl">Espace administrateur</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Connectez-vous pour accéder au back-office de Laurie Coiffure.
        </p>
        <div className="mt-8">
          <LoginForm callbackUrl="/admin" />
        </div>
      </div>
    );
  }

  if (!isAdminRole(session.user.role)) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl">Accès refusé</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ce compte ({session.user.email}) n&apos;a pas les droits administrateur.
        </p>
        <form action={signOutAction} className="mt-8">
          <button
            type="submit"
            className="w-full rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    );
  }

  const isSuperAdmin = session.user.role === "super_admin";
  const visibleNav = NAV.filter((item) => !item.permission || can(session, item.permission));

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
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {isSuperAdmin && (
            <>
              <Link
                href="/admin/utilisateurs"
                className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
              >
                Utilisateurs
              </Link>
              <Link
                href="/admin/journal"
                className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
              >
                Journal d&apos;activité
              </Link>
            </>
          )}
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
