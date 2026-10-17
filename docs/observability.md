# Observability and production diagnosis

Read when implementing error reporting, tracing, metrics, or incident diagnosis.

These are accepted project rules, except items explicitly marked pending. Start with [AGENTS.md](../AGENTS.md) for the shared constraints and task routing.

## Observability and production error diagnosis

- Observability is a required implementation responsibility, independent of the eventual provider. The provider/SDK/exporter, retention periods, sampling rates, alert destinations, and numeric service objectives remain pending. Do not claim production diagnosis is configured merely because console logs or empty adapters exist. A production release must state which signals are collected, their destination, and any blind spots.
- Use the [internal API error categories](api.md#internal-error-categories) for network, cancellation, timeout, valid backend failures, and invalid responses. Track server/browser rendering or unexpected runtime errors separately. A fetch rejection alone does not identify DNS, CORS, offline, or another root cause; record the observable classification and avoid inventing a diagnosis. Expected validation failures and user cancellations are not automatically application incidents.

### Ownership of signals and error handling

| Owner                             | Responsibility                                                                                                                                                                         |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared HTTP transport             | Request/attempt durations, method and safe endpoint template, status/outcome, timeout/cancellation, and available correlation identifiers; no response/request bodies                  |
| Feature/UI boundary               | Stable operation name, applicable loading/error/empty/success/cancellation UI, and meaningful readiness timing (for example, projects.table.ready); no duplicate transport logging     |
| Next.js server profile            | Request/render spans, external API child spans, uncaught server failures, release/environment identity, and correlated structured server logs                                          |
| External backend team/integration | Backend processing/dependency spans, propagated trace context, a searchable request identifier, and documented optional timing headers; frontend cannot manufacture these observations |
| Browser instrumentation           | Unexpected client failures, Web Vitals, supported navigation/resource timing, and selected interaction/readiness measurements                                                          |
| Deployment/operations             | Build/release association, artifact source maps as appropriate, telemetry delivery configuration, access/retention controls, and operational investigation procedures                  |

- Handle recoverable API/domain failures explicitly. Use route error.tsx/global-error.tsx and supported framework error hooks for unexpected render/server failures where applicable; retain safe fallback UI. Error boundaries do not capture every event-handler/async rejection, so handle or report those at their actual boundary. Use the installed version's instrumentation hooks rather than patching global APIs ad hoc; keep server-only instrumentation out of static runtime bundles.
- Display safe actionable messages and an opaque support reference when available, never raw stack traces, credentials, backend diagnostics, or arbitrary server exception messages. The request identifier is not the numeric error.code, a JWT, or an idempotency key. Next.js error digests may assist lookup but are not automatically distributed trace identifiers.
- Assign one capture owner per failure and deduplicate propagation through transport, feature, and error boundaries. Do not swallow errors just to report them or turn failed operations into apparent success. Log expected cancellation at a suitable low level if needed, without error notifications, retries, or misleading error-rate inflation.

### Correlation and tracing contract

- Use W3C Trace Context (traceparent and tracestate when present) for distributed tracing in instrumented flows. Let the selected standards-compliant instrumentation create/validate trace/span identifiers and sampling flags; each service/attempt has its own span under the appropriate parent. Never reuse a constant trace identifier or hand-construct malformed headers.
- Propagate trace context only to explicitly trusted API origins and supported service boundaries. Incoming trace context is untrusted diagnostic metadata, never authentication or authorization; validate it and follow documented trust/sampling policy. Do not put personal data in trace context or propagate arbitrary baggage.
- For integrations under our control, document X-Request-ID as the opaque per-request support/reference header, returned by the serving API and attached to its logs. Capture a backend-provided identifier when available and associate it with traceId/spanId and the frontend operation. A locally generated fallback can identify frontend activity but must never be presented as backend-confirmed correlation. Keep response JSON unchanged: do not add traceId or other members to the approved error envelope without a separate contract decision.
- Cross-origin browser integrations must explicitly agree on allowed request headers (including traceparent/tracestate when used), exposed response headers (such as X-Request-ID), and Timing-Allow-Origin for permitted detailed timing. These are distinct CORS/timing controls; do not assume observing a fetch response exposes all headers/timings. Document missing backend cooperation as a blind spot and do not break an existing third-party integration by forcing unsupported diagnostic headers.

### Performance measurements and attribution

- Use monotonic local duration measurement (performance APIs or the instrumentation equivalent); record UTC timestamps for event correlation. Do not subtract timestamps from unsynchronized hosts to compute durations.
- Measure the user-visible operation from a defined start (navigation/filter submission/etc.) to its defined readiness milestone. For a table, distinguish response availability, body transfer/decoding/schema validation, and the meaningful UI commit/readiness marker; a fetch finishing or a loading flag changing is not proof that a table has painted.
- Collect supported browser navigation/resource timings for network phases and use server traces for Next.js processing and backend spans for API processing. Server-Timing may expose documented safe processing durations where available. Its absence or restricted cross-origin timings means attribution is incomplete: browser request duration/TTFB must not be labelled as pure backend time, network time, or server render time.
- Account for cached results, retries, prefetches, parallel requests, streaming, and client transitions when interpreting measurements. Nested or concurrent span durations are not additive. Web Vitals describe loading/interactivity/layout experience and do not replace a feature-specific readiness measurement. Use sampled profiling when deeper browser-render attribution is needed; do not ship an always-on detailed React profiler by default.
- Required metric categories are request duration and outcome by safe endpoint/method, timeout/error rates, selected feature readiness latency, browser Web Vitals, and server request/render latency for the server profile. Track distributions/percentiles and counts, not only averages. Define project-specific objectives and alert conditions after representative baseline measurements; no universal table-load threshold is selected here.
- In static deployments there is no Next.js request-time rendering span. Collect browser signals and coordinate with the static host/backend for their timings when available; keep build-time instrumentation separate from live-user traces.

### Safe records, bounded overhead, and verification

- Use structured events with an allowlisted schema: timestamp, severity, stable event/operation name, service, environment, release/build identifier, route/endpoint template, outcome/status, duration and correlation identifiers where available. Sanitize optional diagnostic messages. Keep request/trace identifiers in logs/traces, not high-cardinality metric labels. Do not use concrete user IDs, raw resource URLs, or arbitrary error text as metric dimensions.
- Never collect JWTs/Authorization headers, cookies, passwords, form values, uploaded bytes, raw request/response payloads, signed URL parameters, or unfiltered URLs/query strings. Redact/sanitize at capture time on both browser and server before exporting. Treat third-party SDK auto-capture and session replay as unapproved until their collection/privacy behavior is reviewed. Apply privacy/consent requirements appropriate to the project; do not assume diagnostic collection permits personal tracking.
- Keep telemetry asynchronous and bounded: finite queues/batches, controlled sampling, limited payload size, finite delivery retries, and appropriate cleanup. Telemetry failure must not block the user's operation or recursively instrument its own exporter requests. Browser telemetry contains no private exporter credentials; use an approved public ingestion mechanism with appropriate abuse controls. Server shutdown flushing must be bounded.
- Make release identifiers available consistently to browser/server records. If source maps are used to symbolicate production failures, configure their controlled upload/access and release matching deliberately; do not enable public production source maps solely to support diagnostics by default.
- When implemented, verify redaction, correlation propagation to trusted origins only, observable request IDs, duration measurement, cancellation/timeout classification, error deduplication, private-cache/session transitions, and telemetry failure isolation. Cover backend failures and invalid responses as well as browser/server render failures where applicable. Follow the [useEffect exception policy](architecture.md#naming-and-organization) without hidden lifecycle workarounds.
- Provide a short project runbook for a slow-table incident: locate the release/operation/reference, inspect the request trace and API spans, compare permitted network/body timings, then inspect the browser readiness interval. Mark unavailable stages as unknown. Verify a trace actually reaches the configured destination before claiming end-to-end observability.

Observability references (reviewed 2026-10-16):

- https://nextjs.org/docs/app/guides/open-telemetry
- https://nextjs.org/docs/app/getting-started/error-handling
- https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals
- https://www.w3.org/TR/trace-context/
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Server-Timing
- https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming

## Truthful diagnostic UI

- Never claim an incident was logged, synchronized or correlated without a working integration and confirmed semantics. A rendering failure is not automatically an HTTP 500.
- Display a framework/backend diagnostic reference only when one exists; never substitute a constant reference that appears unique. A digest is not proof of telemetry export.
- Current reference state: the transport exposes an isolated onComplete measurement callback; no production exporter, distributed tracing or Web Vitals destination is configured. The error boundary offers recovery and displays a digest when present, without claiming monitors captured the incident. Tool/provider selection and end-to-end observability verification remain pending.
