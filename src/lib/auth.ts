import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";
import { env } from "@/env";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: isDatabaseConfigured ? DrizzleAdapter(db) : undefined,
  session: { strategy: "jwt" },
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
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        if (!isDatabaseConfigured) {
          // Mode demo sans base de donnees : compte admin de test uniquement.
          if (email === "admin@laurie-coiffure.fr" && password === "admin1234") {
            return { id: "demo-admin", email, name: "Admin (démo)", role: "admin" };
          }
          return null;
        }

        const user = await db.query.users.findFirst({ where: eq(users.email, email) });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "customer" | "admin") ?? "customer";
      }
      return session;
    },
  },
});
