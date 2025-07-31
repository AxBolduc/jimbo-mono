import { Hono } from "hono";
import { Env } from "../..";
import { effectValidator } from "@hono/effect-validator";
import { Effect } from "effect";
import { CreateRunSchema } from "@jimbostats/core/schemas";
import { RunsService, RunsServiceLive } from "@jimbostats/core/services";
import { DrizzleFactory } from "@jimbostats/core/db";
import { NoApiKeyError } from "@jimbostats/core/errors";

export const RunsApp = new Hono<Env>();

RunsApp.get("/", async (c) => {
  return c.json({ t: "Hello world" });
});

RunsApp.post("/", effectValidator("json", CreateRunSchema), async (c) => {
  const program = Effect.gen(function* () {
    const authHeader = c.req.header("Authorization");
    const apiKey = authHeader?.split(" ")[1];

    if (!apiKey) {
      return yield* Effect.fail(
        new NoApiKeyError({ message: "No api key provided" }),
      );
    }

    const runsService = yield* RunsService;
    const runRequest = c.req.valid("json");

    const createdRun = yield* runsService.createRun(apiKey, runRequest);

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
          case "NoApiKeyError":
            return c.json({ error: "No api key provided" }, 401);
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
