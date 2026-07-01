import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/env";
import * as schema from "./schema";

export const isDatabaseConfigured = Boolean(env.DATABASE_URL);

/**
 * `db` est utilisable meme sans DATABASE_URL (les appels echoueront simplement) :
 * chaque module de src/lib/data verifie `isDatabaseConfigured` et retombe sur des
 * donnees mock si la base n'est pas encore branchee (cf. decision "code d'abord,
 * cles plus tard").
 */
const sql = neon(env.DATABASE_URL ?? "postgresql://user:password@placeholder.tld/placeholder");

export const db = drizzle(sql, { schema });
