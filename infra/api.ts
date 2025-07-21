import { d1Database } from "./database";

export const honoApi = new sst.cloudflare.Worker("HonoEffect", {
  url: true,
  link: [d1Database],
  handler: "./packages/api/src/index.ts",
});
