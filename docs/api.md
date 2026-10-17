# API integration and forms

Read when implementing HTTP operations, authentication, API contracts, errors, or form submission.

These are accepted project rules, except items explicitly marked pending. Start with [AGENTS.md](../AGENTS.md) for the shared constraints and task routing.

## API integration and authentication

- Keep feature API operations explicit and HTTP transport concerns shared where useful.
- Use the accepted JSON response contract for APIs under our control:
  - Success: { "success": true, "value": ... }, with optional meta when applicable, and no error member.
  - For a single resource, value is a typed object: { "success": true, "value": { "id": "prj_123", "name": "Customer portal" } }. Never wrap a single-resource response in an array; a missing resource returns HTTP 404.
  - For a collection, value is an array of typed objects: { "success": true, "value": [{ "id": "prj_123", "name": "Customer portal" }] }. Empty collections use value: []. Cardinality follows the endpoint contract, not the number of results: a collection with one result remains an array.
  - Type the envelope generically as ApiResponse<T>, where T is the endpoint's actual value type (for example, Project or Project[]); do not hardcode value as T[] in the shared envelope. Validate this shape against the endpoint contract at the integration boundary. Primitive and null values are not approved; the existing successful no-result convention remains value: [].
  - Paginated collections place pagination under meta.pagination. The approved page-based example uses page (one-based), pageSize, totalItems, and totalPages. Cursor pagination details remain pending.
  - Failure: { "success": false, "error": { "code": 1001, "message": "..." } }, with no value or meta members. code is a stable integer from a documented catalog; message is safe, human-readable text. Do not branch on message text.
  - Preserve appropriate HTTP status codes: 2xx for success, 4xx/5xx for failures. Operations returning the envelope must not use HTTP 204, which has no response body; use HTTP 200 for a successful no-result operation with value: [].
  - File downloads, images, and streaming responses are explicit exceptions to the JSON envelope. Third-party API contracts may differ and must be adapted at their integration boundary when needed.
- The backend error-code catalog, exact retry settings, and optional field-validation wire format remain pending. Internal error categories and field-validation responsibilities are defined below. The [request policy](performance.md#requests-and-collections) retains the 15,000 ms total deadline. Do not fabricate backend error numbers for client transport failures.
- Platforms use JWT-based API authentication. Identity-provider integration varies by project (for example, Entra ID or Google). Simple landing pages may omit authentication.
- Token acquisition, storage, refresh, issuer/audience validation responsibilities, and server/browser integration remain pending. Do not infer a storage mechanism or assume an identity token is an API access token.

### Internal error categories

- Represent API integration failures with a TypeScript discriminated union using `kind`; narrow by this discriminator rather than testing arbitrary messages. This is an internal frontend model, not another backend response envelope.
- Only the `backend` branch carries the API's numeric business error code. Keep available HTTP status and safe correlation metadata without inventing a business code for other branches. Never expose raw response bodies, credentials, or diagnostic causes in user messages.

| kind             | Classification and handling                                                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| backend          | A valid failure response matching the endpoint's agreed contract; preserve its numeric code and safe message. Third-party failures require an explicit boundary adaptation.                                           |
| network          | The request fails before an observable HTTP response, without a known caller cancellation or deadline expiry. Do not infer DNS, CORS, or offline as the exact cause from a fetch rejection alone.                     |
| timeout          | The operation's configured deadline expires; distinguish this from an explicit cancellation. A timed-out write may already have succeeded in the backend.                                                             |
| cancelled        | The caller intentionally aborts or an owned request becomes obsolete. Do not show a generic error toast or retry automatically.                                                                                       |
| invalid-response | A received response violates the expected content type, parsing, schema, or HTTP/envelope consistency. Preserve available status; an HTML 502 page where JSON is required is not a fabricated backend business error. |

- Use the actual cancellation/deadline reason rather than classifying every AbortError as a timeout. Exceptions in rendering or application code remain unexpected runtime failures under [observability](observability.md#ownership-of-signals-and-error-handling); do not relabel them as network errors.
- Keep query retries, UI handling, and telemetry aligned with these categories. The [transport policy](performance.md#requests-and-collections) owns deadlines/retries; the HTTP client must not become a second query/state library.

### Optional field-validation extension

- Support for optional structured field errors is an accepted capability. Preserve `error.code` and `error.message` as the base contract; the exact additional member name, entry shape, field-path syntax, multiplicity, and backend status/code mapping remain pending until agreed with the API. Do not introduce an invented wire format or treat a proposal as the current API.
- Map structured errors only from a documented response contract to known form fields. Never extract field names from message text. Preserve a form-level fallback for absent extensions, unknown paths, or errors that do not belong to one control.
- Keep user input on recoverable failures, associate messages with the relevant controls, and announce errors accessibly. The backend remains authoritative. Follow the [accessibility policy](ui.md#accessibility).
- Zod schemas are selected; a separate form library is not required by this reference. Once implemented, cover base-envelope compatibility, field mapping, multiple messages where supported, and unknown-field fallback with applicable tests.

## Forms and request payloads

- Prevent duplicate submissions: use one submission path, an immediate in-flight guard against overlapping calls (not just a later visual disabled state), and visible accessible pending feedback. Enter-key and button submissions must follow the same path. Restore interaction after completion/failure and preserve user input on recoverable failures.
- Idempotency is desirable when supported by the backend; the intent is to prevent duplicate effects, not to avoid idempotency. A disabled button is only a UX measure and cannot guarantee exactly-once processing across retries, tabs, or network failures.
- Do not automatically repeat a write after a timeout or uncertain response. Its backend outcome may be unknown. Use a documented reconciliation/status check or an explicitly supported backend idempotency protocol. When supported, reuse the same idempotency key for the same logical operation and never reuse it for a different payload/operation. Do not invent an Idempotency-Key contract for APIs that do not support one.
- Define the request DTO and runtime validation against the actual API contract. Use explicit boundary conversion from form values; HTML fields and FormData do not by themselves produce the expected JSON number/boolean/date types. Type assertions do not validate a payload.
- Match API-required field names, primitive types, enums, array/object structures, optional/null semantics, numeric ranges/precision, and date/time formats. Preserve string identifiers (including leading zeroes); distinguish an empty numeric input from zero and reject invalid numeric values. Do not apply blanket coercion, trimming, timezone conversion, or null/empty substitution without contract requirements.
- Submit only the intended writable fields, not the entire UI model or backend response object. Keep presentation state separate from request data. Use the approved multipart protocol for files and the endpoint's documented encoding for its other parts; do not assume multipart fields retain JSON types.
- Frontend validation supports UX and API compatibility. Backend validation and business authorization remain authoritative. Structured server field-error support follows the optional extension policy above; its exact wire format, schema tooling, and form-library selection remain pending.

## Resource identity and browser drafts

- Preserve validated resource IDs/references supplied by the API. Never infer identity from array position, pagination offset or display order. Related resources (for example a Pokémon and its species) use the relationship in the response, not an assumed shared name.
- Browser storage is untrusted input. Validate version, shape, bounds and expiration before using it; malformed, expired or unsupported data must yield safe defaults. Draft validation can allow incomplete fields while submission validation enforces the complete form.
- Persistence must be explicit, bounded, deletable and honest about failure. Perform writes outside state updaters; announce success only after a successful write. Keep edits available on failure. Never store credentials or sensitive form data through a generic draft mechanism.
- The Pokémon demo stores non-sensitive drafts in localStorage with version 1 and a seven-day logical expiry. Expired records are ignored, not silently trusted or automatically migrated. Bytes remain until explicit deletion or browser cleanup; the Delete local observation action also removes the legacy key. This demo has no users/tenants: authenticated projects must separately design identity scope and logout cleanup before reusing persistence.
