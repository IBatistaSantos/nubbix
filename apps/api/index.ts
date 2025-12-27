import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

app.get("/health", (c) => {
  return c.json({ message: "OK" });
});

const port = Number(process.env.PORT) || 3001;

export default {
  port,
  fetch: app.fetch,
};
