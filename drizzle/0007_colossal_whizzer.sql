CREATE TYPE "public"."gallery_item_type" AS ENUM('photo', 'avant-apres', 'video');--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"type" "gallery_item_type" DEFAULT 'photo' NOT NULL,
	"category" text NOT NULL,
	"image_url" text NOT NULL,
	"image_after_url" text,
	"video_url" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
