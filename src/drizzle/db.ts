import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

export const client = new Client({
  host: process.env.POSTGRES_HOST!,
  port: 5432,
  user: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DATABASE!,
  ssl: {
    rejectUnauthorized: false,
  },
});

await client.connect();

// { schema } is used for relational queries
export const db = drizzle(client, { schema });
