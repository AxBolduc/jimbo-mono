import { RunRepositoryLive } from "@jimbostats/core/repositories";
import { UsersService, UsersServiceLive } from "@jimbostats/core/services";
import { Effect, Layer, ManagedRuntime } from "effect";
import { Hono } from "hono";

export const app = new Hono();

const runtime = ManagedRuntime.make(
  Layer.provideMerge(UsersServiceLive, RunRepositoryLive),
);

app.get("/", (c) => {
  return c.json(["Hello world"]);
});

app.get("/:id", async (c) => {
  const program = Effect.gen(function* () {
    const usersService = yield* UsersService;

    const runs = yield* usersService.getRunsForUser(1);

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
  );

  return await runtime.runPromise(program);
});
