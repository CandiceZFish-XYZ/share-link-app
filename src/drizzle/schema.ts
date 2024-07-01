import {
  pgTable,
  varchar,
  timestamp,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const urlLinks = pgTable("url_links", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`), // Adjust as needed for cuid() equivalent
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  url: text("url").notNull(),
  code: integer("code").notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(), // Adjust length based on your requirements
});
