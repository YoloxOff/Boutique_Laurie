import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const activityLog = pgTable("activity_log", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  userEmail: text("user_email").notNull(),
  action: text("action").notNull(),
  target: text("target"),
  ip: text("ip"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Ligne unique (id="singleton") : paramètres du site éditables depuis /admin/parametres.
export const siteSettingsRow = pgTable("site_settings", {
  id: text("id").primaryKey().default("singleton"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  bookingUrl: text("booking_url"),
  vatNumber: text("vat_number"),
  paymentMethods: text("payment_methods").array().notNull().default([]),
  shippingMethods: text("shipping_methods").array().notNull().default([]),
  announcementBar: text("announcement_bar"),
  hours: jsonb("hours").$type<{ day: string; hours: string }[]>().notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const legalPagesRow = pgTable("legal_pages", {
  key: text("key").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
