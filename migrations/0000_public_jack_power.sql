CREATE TABLE "tours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image" text,
	"stops" json
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_city_country" ON "tours" USING btree ("city","country");