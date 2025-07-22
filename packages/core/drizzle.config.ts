import { defineConfig } from "drizzle-kit";

export default defineConfig({
  strict: true,
  verbose: true,
  out: "./migrations",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
    databaseId: "da25f6ea-5437-4ef8-bc3d-690e794c07b5",
  },
  schema: "./packages/core/src/db/schema.ts",
});
