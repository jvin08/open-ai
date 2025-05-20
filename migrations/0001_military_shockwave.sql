CREATE TABLE "assets" (
	"clerk_id" varchar(255) PRIMARY KEY NOT NULL,
	"asset_name" text,
	"asset_price" numeric(10, 4),
	"asset_quantity" numeric(10, 2),
	"portfolio_name" text
);
--> statement-breakpoint
CREATE TABLE "token" (
	"clerk_id" varchar(255) PRIMARY KEY NOT NULL,
	"tokens" integer DEFAULT 10000
);
