export const honoApi = new sst.cloudflare.Worker("HonoEffect", {
  url: true,
  handler: "./packages/api/src/index.ts",
});
