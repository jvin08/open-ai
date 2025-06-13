ALTER TABLE "assets" ADD COLUMN "last_price" numeric(10, 4);--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;