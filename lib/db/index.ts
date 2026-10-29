import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as authSchema from "./auth-schema";
import * as notesSchema from "./notes-schema";

const sqlite = new Database("sqlite.db");

export const db = drizzle(sqlite, {
  schema: {
    ...authSchema,
    ...notesSchema,
  },
});
