import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db, isDatabaseConfigured } from "@/db";
import { users, activityLog } from "@/db/schema";
import { env } from "@/env";
import { eq } from "drizzle-orm";

const ADMIN_ROLES = new Set(["employee", "admin", "super_admin"]);
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
// Auto-déconnexion après inactivité : la session expire si aucune requête ne la rafraîchit.
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 2; // 2h
const SESSION_UPDATE_AGE_SECONDS = 60 * 15; // 15 min

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: isDatabaseConfigured ? DrizzleAdapter(db) : undefined,
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
  },
  secret: env.AUTH_SECRET ?? "dev-only-insecure-secret-change-me",
  pages: {
    signIn: "/connexion",
  },
  providers: [
    ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
      ? [Google({ clientId: env.AUTH_GOOGLE_ID, clientSecret: env.AUTH_GOOGLE_SECRET })]
      : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, request) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const ip = request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

        if (!isDatabaseConfigured) {
          // Mode demo sans base de donnees : compte admin de test uniquement.
          if (email === "admin@laurie-coiffure.fr" && password === "admin1234") {
            return { id: "demo-admin", email, name: "Admin (démo)", role: "super_admin", permissions: [] };
          }
          return null;
        }

        const user = await db.query.users.findFirst({ where: eq(users.email, email) });
        if (!user?.passwordHash || user.suspendedAt) return null;

        if (user.lockedUntil && user.lockedUntil > new Date()) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          const attempts = user.failedLoginAttempts + 1;
          const lockedUntil =
            attempts >= MAX_FAILED_ATTEMPTS
              ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
              : null;
          await db
            .update(users)
            .set({ failedLoginAttempts: attempts, lockedUntil })
            .where(eq(users.id, user.id));
          return null;
        }

        await db
          .update(users)
          .set({ failedLoginAttempts: 0, lockedUntil: null })
          .where(eq(users.id, user.id));

        if (ADMIN_ROLES.has(user.role)) {
          await db.insert(activityLog).values({
            userId: user.id,
            userEmail: user.email,
            action: "auth.login",
            ip,
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { role?: string; permissions?: string[] };
        token.role = (u.role as typeof token.role) ?? "customer";
        token.permissions = u.permissions ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as typeof session.user.role) ?? "customer";
        session.user.permissions = (token.permissions as string[] | undefined) ?? [];
      }
      return session;
    },
  },
});
