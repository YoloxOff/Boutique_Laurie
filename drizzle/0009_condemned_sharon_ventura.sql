ALTER TABLE "products" ADD COLUMN "position" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
UPDATE "products" p
SET "position" = ranked.rn
FROM (
  SELECT p2.id, row_number() OVER (ORDER BY b.name NULLS LAST, p2.name) - 1 AS rn
  FROM "products" p2
  LEFT JOIN "brands" b ON b.id = p2.brand_id
) ranked
WHERE p.id = ranked.id;