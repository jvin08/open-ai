import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const toursTable = pgTable("tours", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(), // Changed to `text` for longer content
  image: text("image"), // Kept as `text` for optional field
});