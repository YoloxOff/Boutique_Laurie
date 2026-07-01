CREATE TABLE "legal_pages" (
	"key" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY DEFAULT 'singleton' NOT NULL,
	"phone" text,
	"email" text,
	"address" text,
	"instagram" text,
	"facebook" text,
	"booking_url" text,
	"vat_number" text,
	"payment_methods" text[] DEFAULT '{}' NOT NULL,
	"shipping_methods" text[] DEFAULT '{}' NOT NULL,
	"announcement_bar" text,
	"hours" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
