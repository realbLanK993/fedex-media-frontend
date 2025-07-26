import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import * as z from "zod/v4";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
  role: text().notNull().default("STAFF"),
});

export const usersMetadata = sqliteTable("users_metadata", {
  userId: int()
    .primaryKey()
    .references(() => users.id),
  profilePic: text(),
  age: int().notNull(),
});
export const metaDataRelations = relations(usersMetadata, ({ one }) => ({
  userId: one(users, {
    fields: [usersMetadata.userId],
    references: [users.id],
  }),
}));
export const usersRelation = relations(users, ({ one, many }) => ({
  profileMetadata: one(usersMetadata),
  sessions: many(sessions),
}));

export const sessions = sqliteTable("sessions", {
  id: text().primaryKey(),
  userId: int()
    .notNull()
    .references(() => users.id),
  secretHash: text().notNull(),
  createdAt: int().notNull(),
});

export const sessionsRelation = relations(sessions, ({ one }) => ({
  userId: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const usersMetadataSchema = createSelectSchema(usersMetadata);

export const usersSelectSchema = createSelectSchema(users);
export const usersInsertSchema = createInsertSchema(users);

export const sessionSelectSchema = createSelectSchema(sessions);
export const sessionInsertSchema = createInsertSchema(sessions);

export type UsersSelect = z.infer<typeof usersSelectSchema>;
export type UsersWithMetadata = Omit<UsersSelect, "passwordHash"> & {
  metadata?: Omit<z.infer<typeof usersMetadataSchema>, "userId">;
};
export type UsersInsert = z.infer<typeof usersInsertSchema>;
