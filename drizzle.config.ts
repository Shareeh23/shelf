import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./lib/db/auth-schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "./sqlite.db",
  },
});
