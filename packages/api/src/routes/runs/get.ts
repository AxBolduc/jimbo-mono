import { Hono } from "hono";

export const app = new Hono();

app.get("/", (c) => {
  return c.json([]);
});

app.get("/:id", (c) => {
  return c.json([{ id: c.req.param("id") }]);
});
