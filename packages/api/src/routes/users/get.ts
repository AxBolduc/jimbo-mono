import { RunSchema } from "@jimbostats/core/schemas";
import { UsersService } from "@jimbostats/core/services";
import { Hono } from "hono";

export const app = new Hono();

app.get("/:id/runs", async (c) => {
  const userIdNum = parseInt(c.req.param("id"));

  const runs = await UsersService.getRunsForUser(userIdNum);

  return c.json(RunSchema.array().parse(runs));
});
