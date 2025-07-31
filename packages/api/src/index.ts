import { Hono } from "hono";
import { RunsApp } from "./routes/runs";
import type { D1Database } from "@cloudflare/workers-types";
import * as D1 from "@effect/sql-d1/D1Client";
import { SqlClient } from "@effect/sql/SqlClient";
import type { ConfigError, Layer } from "effect";
import { UsersController } from "./routes/users";

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

app.route("/runs", RunsApp);
app.route("/users", UsersController.app);

export default app;
