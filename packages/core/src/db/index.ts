import * as DrizzleSqlite from "@effect/sql-drizzle/Sqlite";
import { ConfigError, Layer } from "effect";
import * as Client from "@effect/sql/SqlClient";

export const DrizzleFactory = (
  db: Layer.Layer<Client.SqlClient, ConfigError.ConfigError>,
) => DrizzleSqlite.layer.pipe(Layer.provide(db));

export * from "./schema";
