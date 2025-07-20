/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "jimbo-mono",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "cloudflare",
    };
  },
  async run() {
    const { readdirSync } = await import("fs");

    const outputs = {};
    for (const value of readdirSync("./infra/")) {
      const result = await import(`./infra/${value}`);
      if (result.outputs) Object.assign(outputs, result.outputs);
    }

    return outputs;
  },
});
