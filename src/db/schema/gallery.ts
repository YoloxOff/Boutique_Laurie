import { pgEnum, pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const galleryItemTypeEnum = pgEnum("gallery_item_type", ["photo", "avant-apres", "video"]);

export const galleryItems = pgTable("gallery_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull().default(""),
  type: galleryItemTypeEnum("type").notNull().default("photo"),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  imageAfterUrl: text("image_after_url"),
  videoUrl: text("video_url"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
