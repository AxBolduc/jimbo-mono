import { DefaultUsersService, UsersService } from "@jimbostats/core/services";
import { Effect } from "effect";
import { Hono } from "hono";

export const app = new Hono();

app.get("/", (c) => {
  return c.json(["Hello world"]);
});

app.get("/:id", async (c) => {
  const program = Effect.gen(function* () {
    const usersService = yield* UsersService;

    const runs = yield* usersService.getRunsForUser(1);

    return runs;
  });

  const runnableProgram = Effect.provideService(
    program,
    UsersService,
    DefaultUsersService,
  ).pipe(
    Effect.match({
      onSuccess: (runs) => c.json(runs),
      onFailure: (error) => c.json({ message: "failed" }, 404),
    }),
  );

  return await Effect.runPromise(runnableProgram);
});
