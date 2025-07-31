import { DrizzleFactory } from "@jimbostats/core/db";
import { RunRepositoryLive } from "@jimbostats/core/repositories";
import { Effect } from "effect";
import { Hono } from "hono";
import { Env } from "../..";
import { RunsService, RunsServiceLive } from "@jimbostats/core/services";

export const app = new Hono<Env>();

app.get("/:id/runs", async (c) => {
  const program = Effect.gen(function* () {
    const runsService = yield* RunsService;

    const userId = c.req.param("id");
    const runs = yield* runsService.getRunsForUser(userId);

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
    Effect.provide(RunsServiceLive),
    Effect.provide(RunRepositoryLive),
    Effect.provide(DrizzleFactory(c.get("dbLayer"))),
  );

  return await Effect.runPromise(program).catch((err) => console.log(err));
});
