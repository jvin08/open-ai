import { pgTable, text, timestamp, uuid, json, uniqueIndex, integer, varchar } from "drizzle-orm/pg-core";

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