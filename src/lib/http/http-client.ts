import { z } from "zod";
import { failureSchema } from "./api-envelope";
import { HttpError, type HttpFailure } from "./http-error";

export const REQUEST_TIMEOUT_MS = 15_000;
export type RequestMeasurement = {
  durationMs: number;
  outcome: "success" | HttpFailure["kind"];
  status?: number;
};
type RequestOptions = RequestInit & {
  accessToken?: string;
  onComplete?: (measurement: RequestMeasurement) => void;
};

// No singleton credentials, retries, query cache, or provider-specific claims.
export async function requestJson<T>(
  url: string,
  schema: z.ZodType<T>,
  options: RequestOptions = {},
): Promise<T> {
  const { accessToken, onComplete, signal, ...init } = options;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (accessToken) {
    if (new URL(url).protocol !== "https:")
      throw new Error("Bearer credentials require HTTPS.");
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  // FormData Content-Type/boundary must remain browser-owned.
  if (typeof FormData !== "undefined" && init.body instanceof FormData)
    headers.delete("Content-Type");
  const controller = new AbortController();
  let abortKind: "timeout" | "cancelled" | undefined;
  const abort = (kind: "timeout" | "cancelled") => {
    if (!controller.signal.aborted) {
      abortKind = kind;
      controller.abort();
    }
  };
  const cancel = () => abort("cancelled");
  signal?.addEventListener("abort", cancel, { once: true });
  if (signal?.aborted) cancel();
  const timer = setTimeout(() => abort("timeout"), REQUEST_TIMEOUT_MS);
  const started = performance.now();
  let status: number | undefined;
  let outcome: RequestMeasurement["outcome"] = "success";
  try {
    const response = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
      redirect: "error",
    });
    status = response.status;
    if (
      !/^application\/(?:[\w.-]+\+)?json(?:;|$)/i.test(
        response.headers.get("Content-Type") ?? "",
      )
    ) {
      await response.body?.cancel();
      throw new HttpError({ kind: "invalid-response", status });
    }
    // The deadline stays active while reading the entire body.
    const body: unknown = await response.json();
    if (!response.ok) {
      const failure = failureSchema.safeParse(body);
      if (failure.success)
        throw new HttpError({ kind: "backend", status, ...failure.data.error });
      throw new HttpError({ kind: "invalid-response", status });
    }
    const result = schema.safeParse(body);
    if (!result.success)
      throw new HttpError({ kind: "invalid-response", status });
    return result.data;
  } catch (error) {
    const classified = abortKind
      ? new HttpError({ kind: abortKind })
      : error instanceof HttpError
        ? error
        : new HttpError(
            status === undefined
              ? { kind: "network" }
              : { kind: "invalid-response", status },
          );
    outcome = classified.failure.kind;
    throw classified;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", cancel);
    try {
      onComplete?.({
        durationMs: performance.now() - started,
        outcome,
        status,
      });
    } catch {
      /* Diagnostic consumers must never break the user's operation. */
    }
  }
}
