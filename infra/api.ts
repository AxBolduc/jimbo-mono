export const honoApi = new sst.cloudflare.Worker("Hono", {
  url: true,
  handler: "./packages/api/src/index.ts",
});
