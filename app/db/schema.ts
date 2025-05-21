import { pgTable, text, timestamp, uuid, json, uniqueIndex, integer, varchar, numeric } from "drizzle-orm/pg-core";

export const toursTable = pgTable("tours", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  stops: json("stops"),
  }, (tour)=>([uniqueIndex("unique_city_country").on(tour.city, tour.country)]));

  export const token = pgTable("token", {
    clerkId: varchar("clerk_id", { length: 255}).primaryKey(),
    tokens: integer("tokens").default(10000)
  })

  export const portfolioNames = pgTable("portfolios", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name")
  })
  
  export const assets = pgTable("assets", {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkId: varchar("clerk_id", { length: 255 }),
    assetName: text("asset_name"),
    assetSymbol: text("asset_symbol"),
    assetPrice: numeric("asset_price", { precision: 10, scale: 4 }), // Number formatted as 0.0000
    assetQuantity: numeric("asset_quantity", { precision: 10, scale: 2 }), // Number formatted as 0.00
    portfolioName: text("portfolio_name")
  });