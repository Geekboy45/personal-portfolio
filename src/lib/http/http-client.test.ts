import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { z } from "zod";
import { server } from "@/test/server";
import { requestJson, REQUEST_TIMEOUT_MS } from "./http-client";
import { successSchema } from "./api-envelope";

const endpoint = "https://api.example.test/resource";
const schema = successSchema(z.object({ name: z.string() }));
describe("HTTP boundary", () => {
  it("validates a single-resource envelope without changing cardinality", async () => {
    server.use(
      http.get(endpoint, () =>
        HttpResponse.json({ success: true, value: { name: "sample" } }),
      ),
    );
    await expect(requestJson(endpoint, schema)).resolves.toEqual({
      success: true,
      value: { name: "sample" },
    });
  });
  it("preserves backend codes and rejects status/envelope contradictions", async () => {
    server.use(
      http.get(endpoint, () =>
        HttpResponse.json(
          { success: false, error: { code: 1001, message: "Unavailable" } },
          { status: 409 },
        ),
      ),
    );
    await expect(requestJson(endpoint, schema)).rejects.toMatchObject({
      failure: { kind: "backend", status: 409, code: 1001 },
    });
    server.use(
      http.get(endpoint, () =>
        HttpResponse.json({
          success: false,
          error: { code: 1001, message: "Wrong status" },
        }),
      ),
    );
    await expect(requestJson(endpoint, schema)).rejects.toMatchObject({
      failure: { kind: "invalid-response", status: 200 },
    });
  });
  it("classifies malformed/non-JSON responses without inventing business codes", async () => {
    server.use(
      http.get(endpoint, () =>
        HttpResponse.html("<h1>Bad gateway</h1>", { status: 502 }),
      ),
    );
    await expect(requestJson(endpoint, schema)).rejects.toMatchObject({
      failure: { kind: "invalid-response", status: 502 },
    });
  });
  it("classifies network failure and explicit cancellation separately", async () => {
    server.use(http.get(endpoint, () => HttpResponse.error()));
    await expect(requestJson(endpoint, schema)).rejects.toMatchObject({
      failure: { kind: "network" },
    });
    const controller = new AbortController();
    controller.abort();
    await expect(
      requestJson(endpoint, schema, { signal: controller.signal }),
    ).rejects.toMatchObject({ failure: { kind: "cancelled" } });
  });
  it("keeps the deadline active after headers while the body is pending", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async (_url, init) =>
        ({
          ok: true,
          status: 200,
          headers: new Headers({ "Content-Type": "application/json" }),
          json: () =>
            new Promise((_resolve, reject) =>
              init?.signal?.addEventListener(
                "abort",
                () => reject(new DOMException("Aborted", "AbortError")),
                { once: true },
              ),
            ),
        }) as Response,
    );
    try {
      const result = requestJson(endpoint, schema).catch(
        (error: unknown) => error,
      );
      await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
      expect(await result).toMatchObject({ failure: { kind: "timeout" } });
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
  it("does not share Bearer tokens across concurrent requests", async () => {
    server.use(
      http.get(endpoint, ({ request }) =>
        HttpResponse.json({
          success: true,
          value: { name: request.headers.get("Authorization") ?? "public" },
        }),
      ),
    );
    const [a, b, publicResult] = await Promise.all([
      requestJson(endpoint, schema, { accessToken: "user-a" }),
      requestJson(endpoint, schema, { accessToken: "user-b" }),
      requestJson(endpoint, schema),
    ]);
    expect([a.value.name, b.value.name, publicResult.value.name]).toEqual([
      "Bearer user-a",
      "Bearer user-b",
      "public",
    ]);
  });
  it("lets the runtime generate multipart boundaries and isolates diagnostic failure", async () => {
    server.use(
      http.post(endpoint, async ({ request }) => {
        expect(request.headers.get("Content-Type")).toContain(
          "multipart/form-data; boundary=",
        );
        expect((await request.formData()).get("label")).toBe("sample");
        return HttpResponse.json({
          success: true,
          value: { name: "uploaded" },
        });
      }),
    );
    const body = new FormData();
    body.set("label", "sample");
    await expect(
      requestJson(endpoint, schema, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        onComplete: () => {
          throw new Error("Exporter failed");
        },
      }),
    ).resolves.toMatchObject({ value: { name: "uploaded" } });
  });
});
