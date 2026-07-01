import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  consentAt: timestamp("consent_at").notNull().defaultNow(),
  source: text("source").notNull().default("site"),
  active: boolean("active").notNull().default(true),
  welcomeCodeSent: boolean("welcome_code_sent").notNull().default(false),
});
