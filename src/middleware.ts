import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // /admin gère sa propre page de connexion (voir AdminLayout) : pas de redirection ici,
  // pour que l'accès admin reste entièrement séparé de /connexion (comptes clients).

  if (pathname.startsWith("/compte")) {
    if (!session?.user) {
      const url = new URL("/connexion", req.nextUrl.origin);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/compte/:path*"],
};
