# Data loading, caching, and resource lifecycle

Read when changing data ownership, caching, requests, rendering, or resource cleanup.

These are accepted project rules, except items explicitly marked pending. Start with [AGENTS.md](../AGENTS.md) for the shared constraints and task routing.

## Performance and resource lifecycle

These policies were reviewed against official documentation on 2026-10-16. They define implementation criteria, not universal numeric defaults. Recheck version-specific APIs against the framework and library versions actually installed. Do not enable an experimental feature or install a library merely because it appears in a reference.

### Data loading and state ownership

| Scenario                                   | Accepted default                                                                                                                                                       |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stable public content                      | Generate statically when the selected profile and content freshness allow it.                                                                                          |
| Reads in Server Components                 | Use native fetch with an explicit public/private caching policy compatible with the selected cache model.                                                              |
| Interactive remote data in the browser     | Use one query library when coordination, freshness, invalidation, or shared observations warrant it. TanStack Query is the preferred conditional choice for platforms. |
| Shareable filters, sorting, and pagination | Keep non-sensitive shareable state in the URL; parse/validate it against the API contract. Do not put secrets or private form content there.                           |
| Local visual state                         | Keep it in local React state; derive inexpensive values rather than duplicating them.                                                                                  |

- A query means an external API read, never authorization to access a database. Do not install TanStack Query in a simple landing or isolated interaction without a concrete need. Its exact version is selected against the installed stack when adopted; do not mix multiple query libraries for the same responsibility.
- Configure freshness, inactive retention, refetch triggers, retries, and cancellation deliberately, following the rules below and the shared total request deadline. Use per-request server instances when needed and scope private data by identity/tenant; no shared mutable server query store.
- Let the query library own remote state and its lifecycle. The shared HTTP transport owns request execution, envelope validation, error classification, cancellation, and the total deadline; it must not implement a competing query cache, polling/state system, or independent retry budget.
- Avoid fetching the same resource independently on server and browser without an intentional handoff/freshness policy. Use the adopted library's supported hydration approach only where required, preserving private-data isolation and execution boundaries. Keep editable drafts and local presentation state separate from remote data.
- URL and local-state choices do not select a router-state package, form library, or global-state library. These remain unnecessary by default.

Reference: [TanStack Query defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults).

### Data retention and caching

- Distinguish HTTP/browser caching, Next.js server/render caching, and client query caching. Document which layer owns freshness and invalidation for each important data flow; do not assume their defaults or lifetimes are equivalent.
- For cached data, define freshness, inactive retention/eviction, invalidation after writes, and identity/tenant scope. Use finite retention for potentially growing caches unless a bounded dataset and documented requirement justify otherwise. Do not create unbounded module-level Maps, histories, logs, or result caches.
- Do not use shared server caches for private responses without an explicit isolation design. Never share a mutable client query store across server requests or users. On logout or identity/tenant switch, prevent late responses from restoring old private data; cancel relevant work and remove affected cached entries as appropriate.
- Avoid copying whole remote responses into local or global state when a query cache already owns them. Local editable drafts are valid when their save/reset behavior is explicit. Avoid serializing unnecessary API fields into client props; do not duplicate backend business rules in presentation adapters.
- If a query library is adopted, configure freshness, inactive retention, refetch-on-focus/reconnect/mount, polling, and retry behavior intentionally. Defaults may be retained when justified; do not assume every cached result stays fresh or every inactive query is immediately removed. TanStack Query remains optional, not selected by these rules.

### Next.js cache model selection and data policy

- Before implementing server data access, explicitly select CACHE_MODEL as traditional or cache-components in project build configuration and README, alongside DEPLOYMENT_PROFILE. Validate the choice against next.config.ts and the installed Next.js version; do not inherit create-next-app defaults silently or enable Cache Components for every project.
- traditional means cacheComponents is explicitly disabled and the project follows the documented non-Cache-Components model. cache-components means explicitly enabling cacheComponents and the associated version-required settings (including partialPrefetching in the pinned baseline). Review incompatible route options and runtime assumptions before switching; do not mix examples from different models blindly.
- Template policy for DEPLOYMENT_PROFILE=static is CACHE_MODEL=traditional with Cache Components disabled: use build-time generation and supported external/browser caches. This is a conservative supported combination, not a claim that every caching primitive has identical compatibility across Next.js versions. Consider additional combinations only through a documented compatibility change with real export checks. A server project may select either model after evaluation.
- Authenticated platforms start with private data read dynamically: no persistent/shared server caching and no static generation of private results. Under traditional, use explicit cache: 'no-store' for private server fetches and verify the route's request-time behavior; with Cache Components, keep private reads outside shared 'use cache' scopes and use the required dynamic/Suspense boundaries. Request-local deduplication is distinct from cross-request caching. Client query caching is allowed only with explicit bounded retention and user/tenant isolation.
- Public landings prefer build-generated content when compatible. Server-cached public content is opt-in with an explicit lifetime; static output is a build snapshot whose update mechanism is rebuild/redeploy. Do not advertise runtime revalidation or a server TTL for exported files; static-host/CDN HTTP cache policy is a separate decision.
- Before introducing any persistent data cache, document a compact policy beside the owning feature/query (or in a shared policy document for common datasets): data/classification, owning layer, identity/tenant scope and keys, numeric freshness/retention or the rebuild update policy, invalidation events, tolerated staleness, and responsible operation. No numeric TTL is implied by this template. If these are unspecified, leave the read uncached rather than guessing a lifetime.
- Never cache credentials, access/refresh tokens, authorization decisions, or sensitive user payloads as shared public data. Do not key caches by raw JWTs or put secrets into cache tags. Adding a tenant identifier does not by itself prove isolation: authentication, authorization, all relevant key inputs, storage scope, and invalidation must be reviewed.
- In traditional mode, opt into public fetch caching explicitly with supported cache/next.revalidate/next.tags options as needed; do not combine conflicting cache options. In Cache Components mode, apply 'use cache' narrowly to approved data/components, declare cacheLife explicitly, and use cacheTag when tag-based invalidation is required. Cache tags label invalidation groups, not access permissions. Do not adopt private/remote cache variants without evaluating their exact stability, security, and storage requirements in the pinned version.

| Invalidation mechanism                   | Use and limits                                                                                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| revalidatePath(path, type when required) | Server-side invalidation for the affected route/layout; document scope, caller context, and refresh timing; not a substitute for invalidating shared data used by unrelated paths                                        |
| revalidateTag(tag, 'max')                | Tagged server data where stale-while-revalidate is acceptable; supports appropriate server contexts in either model with the corresponding tag assignment; does not guarantee immediate fresh data for the mutating user |
| updateTag(tag)                           | Immediate tagged-data expiration/read-your-own-writes in supported Server Actions; do not call it from browser code or Route Handlers                                                                                    |
| Client query invalidation/update         | Relevant to browser-owned cached API data; isolate keys and update/refetch affected list/detail queries after confirmed successful writes                                                                                |
| Rebuild/redeploy plus host policy        | Updates exported HTML/data; HTTP cache invalidation/versioned assets must be coordinated with the static host                                                                                                            |

- Invoke invalidation only after the external backend confirms mutation success. A direct browser-to-backend mutation does not automatically invalidate Next.js server caches: either keep those reads uncached or define a secured, validated server invalidation integration (including external-change/webhook handling when needed). No revalidation mechanism grants permission to move business logic into Next.js.
- A router refresh is not a universal server-data-cache purge. Document server cache, router/navigation state, browser query cache, and CDN behavior separately where involved. Resolve uncertain mutation outcomes using the established idempotency/reconciliation policy before reporting updated state.
- With Cache Components/navigation preservation, do not assume leaving a route always unmounts it. Include hidden/restored screens, retained form state, and back navigation in cleanup/privacy review; on identity/tenant changes, prevent restoration of prior private UI as well as removing query entries.
- Mandatory isolation tests when applicable: sequential and concurrent users A/B, tenants A/B (including the same resource identifier in different tenants), logout/login, tenant switching, back navigation, cached requests/prefetch, and a late response after the identity switch. Verify HTML/RSC/JSON, relevant headers/CDN behavior, and browser state contain no other user's data. Test invalidation after successful writes and retained correctness after failed writes. Mock-only checks cannot prove production cache isolation; exercise the relevant production build/cache layer.

Cache-model references (reviewed 2026-10-16):

- https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
- https://nextjs.org/docs/app/guides/caching-without-cache-components
- https://nextjs.org/docs/app/getting-started/caching
- https://nextjs.org/docs/app/api-reference/functions/revalidatePath
- https://nextjs.org/docs/app/api-reference/functions/revalidateTag
- https://nextjs.org/docs/app/api-reference/functions/updateTag

### Requests and collections

- Shared HTTP transport accepts AbortSignal and uses a 15,000 ms request deadline, covering sending the request and receiving/reading its response body. Preserve the caller's cancellation signal, release timers/listeners on every completion path, and distinguish timeout from explicit cancellation. Do not clear the deadline merely when response headers arrive.
- Retries for a logical request must fit within the same 15,000 ms total budget, including delays; do not silently multiply the deadline per attempt. Do not disable or extend the limit for uploads, downloads, token refresh, or other integrations without an explicit documented project decision. The timeout is a network/I/O deadline, not a guarantee that synchronous JSON parsing or UI work can be preempted.
- Use a cancellation/deadline mechanism compatible with the supported runtimes. Expected cancellation should not trigger generic error notifications or automatic retries.
- Cancel superseded or obsolete reads when no other consumer needs them, and prevent stale responses from overwriting current state. Integrate the query library's signal and ownership model when used; do not cancel shared requests merely because one observer unmounts. Letting a useful request finish for a bounded cache is valid.
- Parallelize independent reads where useful, preserving actual dependencies and bounding fan-out for large batches. Debounce search only when appropriate for the interaction and cancel its pending timers when no longer needed.
- Retry only selected transient failures, with bounded attempts and delay/backoff; respect Retry-After where applicable. Do not blindly retry cancellation, validation/auth failures, or writes without documented idempotency guarantees. Client cancellation does not roll back backend work.
- Use backend pagination for potentially large collections instead of downloading all records for local pagination/filtering. Retain only a bounded number of pages for infinite scrolling when necessary, using supported eviction/refetch behavior. Do not silently truncate required results.
- Evaluate virtualization when measured list/DOM size causes rendering problems. It reduces mounted elements, not the downloaded dataset; retain pagination and consider accessibility, keyboard navigation, dynamic row sizes, and find/search requirements. Do not virtualize every small list by default.

### Loading and rendering

- Keep Server Components as the default where suitable, with focused client boundaries for interactivity. Keep feature providers near their consumers instead of loading every provider in the root layout. Static export and server deployment must each use supported rendering/caching behavior.
- Use route loading UI and Suspense boundaries around meaningful independently loading regions where supported. Provide stable-size fallbacks and avoid blocking critical content on secondary data. Suspense alone does not make arbitrary effect-based fetching stream or load in parallel.
- Defer heavy optional Client Components and libraries (for example, editors, maps, and document viewers) with supported dynamic imports when their cost justifies it. Keep critical initial content available; do not dynamically split every small component or disable SSR to mask hydration problems. Verify that a dynamic component is actually rendered on demand when deferred loading is intended. Animation libraries follow the stricter loading and first-viewport rules in [animations](animations.md#nextjs-and-react-integration).
- Preserve useful framework navigation and prefetch behavior. Tune prefetch for unusually large link collections or expensive destinations based on measurement; do not disable or force prefetch globally as an assumed optimization.
- Derive inexpensive values during render rather than storing redundant state. Use stable data identifiers for list keys. Apply memo/useMemo/useCallback only for a demonstrated cost or a documented identity requirement, considering whether React Compiler is enabled. Memoization must not be required for correctness and must never own resource acquisition or cleanup.
- Consider Web Workers only for measured CPU-heavy client work, accounting for transfer/copy/startup cost and termination. Do not move authoritative business logic into the frontend for performance.

### Resource ownership and delivery

- Every manually acquired persistent resource has an explicit owner and a matching release path on replacement, loss of need, and disposal where applicable: timers, listeners, observers, subscriptions, connections, object URLs, and workers. Do not rely on tab closure or effect avoidance to guarantee cleanup.
- Acquire resources outside render with a lifecycle mechanism supported by the installed React version. Cleanup must tolerate repeated setup/disposal. Keep React Strict Mode enabled to expose lifecycle errors. Use the [documented useEffect exception](architecture.md#naming-and-organization) only when appropriate supported alternatives cannot satisfy the requirement correctly and safely; record the reason and verify its lifecycle rather than introducing a hidden workaround. Animation engines, players, observers and `requestAnimationFrame` loops are resources under this rule; their conditions are in [animations](animations.md#lifecycle-and-effect-amendment).
- Use next/font where appropriate and limit loaded font families, subsets, and weights. Apply the existing responsive-image rules, avoid eagerly downloading secondary video/media, and load third-party scripts with an appropriate next/script strategy only on pages that need them. Do not preload all resources or remove diagnostics indiscriminately in the name of performance.
- Keep debug histories and telemetry queues bounded, avoid retaining file bodies or large API payloads in logs, and exclude development-only tools from production bundles. Check dependency and route-bundle cost before adding a large package for a small task.

### Measurement and verification

- Assess loading and interaction performance using production builds and representative devices/network conditions. Track Core Web Vitals and inspect route JavaScript/dependencies; distinguish laboratory measurements from real-user observations. Set numeric budgets after a representative baseline, not as unsupported universal limits. Advanced animation changes also record bundle, Core Web Vitals and runtime-behavior impact as specified in [animations](animations.md#performance).
- Test stale-response handling, cancellation, cache invalidation/identity isolation, and resource release where those behaviors exist. When browser flow testing is introduced, include repeated navigation and file-preview replacement scenarios to detect retained resources. Do not infer a memory leak from a single heap reading or require zero memory growth.
- Do not repeat profiling or broaden tests after a documentation-only change. Template changes affecting both profiles require checks for both; derived projects verify their explicitly selected profile. Never report compatibility for an unverified profile.

Validation references:

- Next.js production checklist: https://nextjs.org/docs/app/guides/production-checklist
- Next.js caching (check the model enabled in the installed version): https://nextjs.org/docs/app/getting-started/caching
- Parallel reads and loading: https://nextjs.org/docs/app/getting-started/fetching-data
- Lazy loading: https://nextjs.org/docs/app/guides/lazy-loading
- Third-party script strategies: https://nextjs.org/docs/app/api-reference/components/script
- React Effects and cleanup: https://react.dev/reference/react/useEffect
- React memoization: https://react.dev/reference/react/useMemo
- Query cache defaults: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
- Query cancellation: https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation
- Bounded infinite queries: https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries
- List virtualization: https://tanstack.com/virtual/latest/docs/introduction
- Browser cancellation: https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
- Object-URL release: https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static

## Pokémon reference exception and notification lifecycle

- The public PokéAPI name/ID search deliberately uses one bounded catalog lookup because its REST API has no substring-search endpoint. It is a demo-only exception: maximum 2,000 records, explicit rejection of incomplete/oversized catalogs, five-minute freshness, ten-minute inactive retention, no retries, and at most 60 visible matches with an explanatory limit. Do not copy this pattern to private, growing or large platform collections; use backend search/pagination instead. Revisit the demo when the bound is reached.
- Resource IDs come from validated API references, not catalog position. Numeric lookup matches the actual ID; unrelated metadata must not claim a fixed live catalog count.
- Toast deadlines belong to each mounted notification. Parent renders or new notifications must not restart existing deadlines. A timer effect is justified for mount/unmount ownership; fresh callbacks use the supported React Effect Event API. Test simultaneous notifications, callback replacement, Strict Mode and unmount cleanup.
