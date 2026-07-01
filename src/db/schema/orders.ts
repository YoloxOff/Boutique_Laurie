import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { productVariants, products } from "./catalog";
import { users } from "./auth";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const shippingMethodEnum = pgEnum("shipping_method", [
  "click_collect",
  "domicile",
  "mondial_relay",
  "colissimo",
]);

export const promoTypeEnum = pgEnum("promo_type", [
  "percentage",
  "fixed",
  "free_shipping",
]);

export const addresses = pgTable("addresses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull().default("Domicile"),
  fullName: text("full_name").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull().default("FR"),
  phone: text("phone"),
  isDefault: integer("is_default").notNull().default(0),
});

export const carts = pgTable("carts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  sessionToken: text("session_token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  cartId: text("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  variantId: text("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull().default(1),
  unitPriceSnapshot: numeric("unit_price_snapshot", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const promoCodes = pgTable("promo_codes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(),
  type: promoTypeEnum("type").notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull().default("0"),
  minAmount: numeric("min_amount", { precision: 10, scale: 2 }),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").notNull().default(0),
  active: integer("active").notNull().default(1),
});

export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  email: text("email").notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  shippingAmount: numeric("shipping_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("eur"),
  shippingMethod: shippingMethodEnum("shipping_method").notNull(),
  shippingAddressId: text("shipping_address_id").references(() => addresses.id),
  billingAddressId: text("billing_address_id").references(() => addresses.id),
  promoCodeId: text("promo_code_id").references(() => promoCodes.id),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id),
  variantId: text("variant_id").references(() => productVariants.id),
  nameSnapshot: text("name_snapshot").notNull(),
  sku: text("sku").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const invoices = pgTable("invoices", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  blobUrl: text("blob_url").notNull(),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
});

export const shipments = pgTable("shipments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  carrier: text("carrier").notNull(),
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),
  status: text("status").notNull().default("preparing"),
  shippedAt: timestamp("shipped_at"),
});

export const wishlistItems = pgTable("wishlist_items", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  variantId: text("variant_id").references(() => productVariants.id),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

// Table de deduplication pour l'idempotence du webhook Stripe (event.id est unique chez Stripe)
export const stripeEvents = pgTable("stripe_events", {
  id: text("id").primaryKey(),
  processedAt: timestamp("processed_at").notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  invoices: many(invoices),
  shipments: many(shipments),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [wishlistItems.variantId],
    references: [productVariants.id],
  }),
}));
