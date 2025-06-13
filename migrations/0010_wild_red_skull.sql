ALTER TABLE "prices" ALTER COLUMN "symbol" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "prices" ADD CONSTRAINT "prices_symbol_unique" UNIQUE("symbol");