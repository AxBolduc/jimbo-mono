import { Effect } from "effect";
import { Hono } from "hono";
import { Env } from "../..";
import { RunsService, RunsServiceLive } from "@jimbostats/core/services";
import { effectValidator } from "@hono/effect-validator";
import { CreateRunRequestSchema } from "./schemas";
import { DrizzleFactory } from "@jimbostats/core/db";

export const app = new Hono<Env>();

app.get("/", async (c) => {
  return c.json({ t: "Hello world" });
});

// NOTE: Create run endpoint POST /runs
app.post("/", effectValidator("json", CreateRunRequestSchema), async (c) => {
  const program = Effect.gen(function* () {
    const runsService = yield* RunsService;
    const runRequest = c.req.valid("json");

    const createdRun = yield* runsService.createRun(
      runRequest.apiKey,
      runRequest.run,
    );

    return c.json(createdRun);
  }).pipe(
    Effect.match({
      onSuccess: (runs) => c.json(runs),
      onFailure: (error) => {
        switch (error._tag) {
          case "DatabaseError":
            return c.json({ error: "Database error" }, 500);
          case "UserNotFoundError":
            return c.json({ error: "User not found" }, 404);
          default:
            return c.json({ error: "Unknown error" }, 500);
        }
      },
    }),
    Effect.provide(RunsServiceLive),
    Effect.provide(DrizzleFactory(c.get("dbLayer"))),
  );

  return await Effect.runPromise(program).catch((err) => console.log(err));
});
