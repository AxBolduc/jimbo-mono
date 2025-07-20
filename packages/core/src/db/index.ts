import { drizzle } from "drizzle-orm/postgres-js/driver";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL ?? "",
});

export const db = drizzle(client);
export * from "./schema";
