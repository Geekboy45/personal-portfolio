export type HttpFailure =
  | { kind: "backend"; status: number; code: number; message: string }
  | { kind: "network" }
  | { kind: "timeout" }
  | { kind: "cancelled" }
  | { kind: "invalid-response"; status?: number };

export class HttpError extends Error {
  constructor(public readonly failure: HttpFailure) {
    super(failure.kind === "backend" ? failure.message : failure.kind);
    this.name = "HttpError";
  }
}

export function errorMessage(error: unknown): string {
  if (!(error instanceof HttpError))
    return "Something went wrong. Please try again.";
  switch (error.failure.kind) {
    case "cancelled":
      return "Request cancelled.";
    case "timeout":
      return "The request took too long. Please try again.";
    case "network":
      return "Unable to connect. Check your connection and try again.";
    case "backend":
      return "The service could not complete this request.";
    case "invalid-response":
      return error.failure.status === 404
        ? "This item is no longer available."
        : "The service returned an unexpected response. Please try again.";
  }
}
