import type { DefaultSession } from "next-auth";

export type UserRole = "customer" | "employee" | "admin" | "super_admin";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      permissions: string[];
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    permissions?: string[];
  }
}
