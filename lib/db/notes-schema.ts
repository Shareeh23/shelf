import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth-schema";

export const notes = sqliteTable(
  "notes",
  {
    id: text("id").primaryKey(),

    title: text("title").notNull(),

    category: text("category").notNull().default("General"),

    description: text("description").notNull().default(""),

    sources: text("sources", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'`),
    content: text("content").notNull(),

    isArchived: integer("is_archived", { mode: "boolean" })
      .notNull()
      .default(false),

    isJunk: integer("is_junk", { mode: "boolean" }).notNull().default(false),

    isFavorite: integer("is_favorite", { mode: "boolean" })
      .notNull()
      .default(false),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),

    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("notes_user_id_idx").on(table.userId)],
);

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(user, {
    fields: [notes.userId],
    references: [user.id],
  }),
}));
