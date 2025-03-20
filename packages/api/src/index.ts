import { Hono } from "hono";
import { Get } from "./routes/runs";

const app = new Hono();

app.route("/runs", Get.app);

export default app;
