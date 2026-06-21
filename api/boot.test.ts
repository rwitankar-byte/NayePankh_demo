import { describe, expect, it } from "vitest";

describe("HTTP application", () => {
  it("reports healthy", async () => {
    const { default: app } = await import("./boot");
    const response = await app.request("/api/health");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("allows the Vercel frontend origin during preflight", async () => {
    const { default: app } = await import("./boot");
    const origin =
      "https://app-pi82polj8-rwitankar-pals-projects.vercel.app";
    const response = await app.request("/api/trpc/event.list", {
      method: "OPTIONS",
      headers: {
        Origin: origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type,x-trpc-source",
      },
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(origin);
    expect(response.headers.get("Access-Control-Allow-Credentials")).toBe("true");
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain("PATCH");
    expect(response.headers.get("Access-Control-Allow-Headers")).toContain(
      "x-trpc-source",
    );
  });
});
