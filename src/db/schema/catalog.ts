import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const categoryTypeEnum = pgEnum("category_type", ["product", "service"]);
export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "approved",
  "rejected",
]);

export const brands = pgTable("brands", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  type: categoryTypeEnum("type").notNull().default("product"),
  parentId: text("parent_id"),
  position: integer("position").notNull().default(0),
});

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sku: text("sku").notNull().unique(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brandId: text("brand_id").references(() => brands.id, { onDelete: "set null" }),
  categoryId: text("category_id").references(() => categories.id),
  shortDescription: text("short_description"),
  description: text("description").notNull(),
  usageAdvice: text("usage_advice"),
  ingredients: text("ingredients"),
  hairTypes: text("hair_types").array().notNull().default([]),
  objectives: text("objectives").array().notNull().default([]),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("active"),
  position: integer("position").notNull().default(0),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  sku: text("sku").notNull().unique(),
  priceOverride: numeric("price_override", { precision: 10, scale: 2 }),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  weightGrams: integer("weight_grams").notNull().default(0),
  barcode: text("barcode"),
});

export const productImages = pgTable("product_images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  position: integer("position").notNull().default(0),
});

export const productReviews = pgTable("product_reviews", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: text("user_id"),
  authorName: text("author_name").notNull(),
  rating: integer("rating").notNull(),
  title: text("title"),
  comment: text("comment").notNull(),
  status: reviewStatusEnum("status").notNull().default("pending"),
  photos: text("photos").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productComplements = pgTable("product_complements", {
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  complementId: text("complement_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  reviews: many(productReviews),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
}));
