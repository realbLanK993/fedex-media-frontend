import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import * as z from "zod";
import { createSelectSchema } from "drizzle-zod";
export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
  role: text().notNull().default("STAFF"),
});

export const sessionTable = sqliteTable("sessions_table", {
  id: text().primaryKey(),
  secret_hash: blob(),
  createdAt: int(),
});

const sessionSelectSchema = createSelectSchema(sessionTable);
