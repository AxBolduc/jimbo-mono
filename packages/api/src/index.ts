import { Hono } from "hono";
import { Get } from "./routes/runs";

const app = new Hono();

app.route("/runs", Get.app);
app.route("/users", Get.app);

export default app;
