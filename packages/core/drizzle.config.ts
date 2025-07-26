import { defineConfig } from "drizzle-kit";

export default defineConfig({
  strict: true,
  verbose: true,
  out: "./migrations",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_DEFAULT_ACCOUNT_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
    databaseId: "99399ad7-5bc8-49b2-b899-54972d9de516",
  },
  schema: "./packages/core/src/db/schema.ts",
});
