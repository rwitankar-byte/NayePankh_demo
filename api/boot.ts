import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

const localOriginPattern = /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/;
const vercelProjectOriginPattern =
  /^https:\/\/app(?:-[a-z0-9-]+)?-rwitankar-pals-projects\.vercel\.app$/;

function allowedOrigin(origin: string) {
  if (
    origin === env.frontendUrl ||
    localOriginPattern.test(origin) ||
    vercelProjectOriginPattern.test(origin)
  ) {
    return origin;
  }

  return null;
}

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.use(
  "/api/*",
  cors({
    origin: allowedOrigin,
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "x-trpc-source"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.get("/api/health", (c) => c.json({ ok: true }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "8080", 10);
  const hostname = "0.0.0.0";
  serve({ fetch: app.fetch, hostname, port }, () => {
    console.log(`Server running on http://${hostname}:${port}/`);
  });
}
