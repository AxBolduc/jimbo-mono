import { Hono } from "hono";
import { Get } from "./routes/runs";
import type { D1Database } from "@cloudflare/workers-types";
import * as D1 from "@effect/sql-d1/D1Client";
import { SqlClient } from "@effect/sql/SqlClient";
import type { ConfigError, Layer } from "effect";

export interface Env {
  Bindings: {
    JimboDb: D1Database;
  };
  Variables: {
    dbLayer: Layer.Layer<D1.D1Client | SqlClient, ConfigError.ConfigError>;
  };
}

const app = new Hono<Env>();

app.use(async (c, next) => {
  c.set("dbLayer", D1.layer({ db: c.env.JimboDb }));

  await next();
});

app.route("/runs", Get.app);
app.route("/users", Get.app);

export default app;
