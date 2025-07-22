import { UsersService, UsersServiceLive } from "@jimbostats/core/services";
import { Effect, Layer } from "effect";
import { Hono } from "hono";
import { Env } from "../..";
import { RunRepositoryLive } from "@jimbostats/core/repositories";
import { DrizzleFactory } from "../../../../core/src/db";

export const app = new Hono<Env>();

app.get("/", async (c) => {
  return c.json({ t: "Hello world" });
});

app.get("/:id", async (c) => {
  const program = Effect.gen(function* () {
    const usersService = yield* UsersService;

    const runs = yield* usersService.getRunsForUser("bing");

    return runs;
  }).pipe(
    Effect.match({
      onSuccess: (runs) => c.json(runs),
      onFailure: (error) => {
        switch (error._tag) {
          case "DatabaseError":
            return c.json({ error: "Database error" }, 500);
          case "NoRunsFoundError":
            return c.json({ error: "No runs found" }, 404);
          default:
            return c.json({ error: "Unknown error" }, 500);
        }
      },
    }),
    Effect.provide(UsersServiceLive),
    Effect.provide(RunRepositoryLive),
    Effect.provide(DrizzleFactory(c.get("dbLayer"))),
  );

  return await Effect.runPromise(program).catch((err) => console.log(err));
});
