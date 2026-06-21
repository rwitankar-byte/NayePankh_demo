import { describe, expect, it } from "vitest";

describe("HTTP application", () => {
  it("reports healthy", async () => {
    const { default: app } = await import("./boot");
    const response = await app.request("/api/health");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });
});
