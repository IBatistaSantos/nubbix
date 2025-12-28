import { createRouter } from "./src/presentation/http/router";

// Criar router central com todas as rotas configuradas
const app = createRouter();

// Rotas de health check
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
