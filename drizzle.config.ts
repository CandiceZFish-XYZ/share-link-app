import "dotenv/config";
import { defineConfig } from "drizzle-kit";
// import type { Config } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle",
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    port: 5432,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DATABASE!,
    ssl: true,
  },
});
