# Next.js frontend template

## Status and authority

An executable Pokémon reference frontend is implemented on **Next.js 16.4.2**. Both explicit server/static scripts use traditional caching. See [README](README.md) for commands and [code map](docs/code-map.md) for implemented modules; derived projects must select their own profile.

This file is the compact entry point. The linked topic documents contain the full accepted rules and are mandatory for the work they cover. Read only applicable sections and their relevant cross-references; do not preload all documentation. Examples are not mandatory scaffolding. Pending choices are not approved requirements. Surface genuine conflicts; do not silently weaken a rule.

## Essential constraints

- Build a frontend for landings and platforms consuming external APIs. The backend owns business rules, authorization, and persistence. No database access, ORM, or business backend in this template.
- Select `server` or `static` explicitly at project initialization, then select the cache model and server/client boundaries before dependent work. Static output has no Next.js request-time runtime.
- Use English names, kebab-case files/folders, PascalCase components/types, and camelCase functions/variables. Preserve framework filenames.
- Organize by feature with shallow folders and descriptive sibling files. `app` owns routing/composition, features own behavior/API operations, `components/ui` owns shared primitives, and `lib` owns narrow infrastructure. Split by responsibility, execution boundary, or meaningful reuse.
- Prefer functions, composition, and direct imports. No default mediators, DI containers, generic HTTP repositories, automatic mappers, base services, pass-through layers, global state library, or central registries.
- Default to Server Components where suitable; keep client entries focused. Use `.client.tsx` for explicit client entries and enforce server-only credential modules. File naming alone is not isolation.
- `useEffect` is prohibited by default. An exception is allowed only when appropriate supported alternatives cannot satisfy the requirement correctly and safely; document the alternatives and reason, use correct dependencies and cleanup, and verify the lifecycle. Never disguise effects in render, `useMemo`, unnecessary layout effects, or a wrapper. See the [exception policy](docs/architecture.md#naming-and-organization); imperative animation lifecycles have a bounded amendment in [animations](docs/animations.md#lifecycle-and-effect-amendment).
- Keep remote, local UI, URL, and shared client state distinct. Use static generation where compatible, explicit server `fetch` policies, and one query library when browser data complexity warrants it; TanStack Query is the preferred conditional choice. Do not rebuild a query library in the HTTP transport.
- Preserve the API envelope: success has `value` (object for one resource, array for a collection), optional `meta`, and no `error`; failure has `error.code` and `error.message`, with no `value/meta`. Keep HTTP status semantics. Internal errors use discriminated categories, not invented backend numbers. Field-error extension details remain pending.
- Requests retain the **15,000 ms total deadline**, including body transfer and retries. Uploads remain `multipart/form-data` with File/Blob, without base64; reads use normal binary responses. See the topic rules before implementing transfers.
- Use Tailwind and semantic tokens owned by `src/styles/tokens.css`. Reuse UI variants; do not duplicate brand values or component styling. Target **WCAG 2.2 AA** with applicable checks; automation alone does not establish conformance.
- Animation defaults to native CSS/Tailwind/Web Animations. Motion, GSAP + ScrollTrigger and dotLottie are approved optional tiers that are not preinstalled; any other animation library needs an explicit architecture decision. Follow the [animation policy](docs/animations.md) for dependency intake, client boundaries, reduced motion, no-JavaScript/SEO fallbacks, resource cleanup, measurement and real-browser tests for browser-dependent animation. No smooth-scroll or scroll-jacking by default.
- Protect private data at server/client, cache, API, file, and telemetry boundaries. Validate external inputs/contracts; never expose credentials in client bundles, public files, URLs, or logs.

## Read according to the task

| Work                                                                                 | Required policy                                                                           |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Versions, placement, naming, imports, effect exceptions, code-map maintenance        | [Architecture](docs/architecture.md)                                                      |
| API envelope, internal errors, authentication, forms and field validation            | [API and forms](docs/api.md)                                                              |
| Components, variants, tokens, devices, accessibility                                 | [UI](docs/ui.md#ui-and-device-support)                                                    |
| Public landing metadata, sitemap, indexing, structured data                          | [SEO](docs/ui.md#landing-page-seo)                                                        |
| Animations, motion, scroll effects, animated media, animation dependencies           | [Animations](docs/animations.md)                                                          |
| Images, uploads, downloads, previews                                                 | [Files](docs/files.md), [request deadlines](docs/performance.md#requests-and-collections) |
| Server/browser data, query state, caching, invalidation, resource cleanup, loading   | [Performance and data](docs/performance.md)                                               |
| Error reporting, correlation, traces, latency, telemetry privacy                     | [Observability](docs/observability.md)                                                    |
| Tests, static analysis, security checks, safe rendering                              | [Verification and security](docs/verification.md)                                         |
| Deployment profile, build configuration, GitHub Actions, Docker, export restrictions | [Deployment](docs/deployment.md)                                                          |

## Working sequence

1. Read the applicable policy and installed-version documentation before using framework features. Check actual configuration; justify new dependencies, abstractions, client boundaries, and experimental features.
2. Locate the relevant source with targeted searches. Use [the code map](docs/code-map.md) when the entry point is unclear or work spans modules; a known-file edit does not require reading the whole map. Search for existing components, tokens, and patterns before adding alternatives.
3. Resolve prerequisites for the affected work, implement within accepted decisions, and cover applicable loading, error, empty, success, and cancellation states. Continue independent work if a separate decision remains pending.
4. Run applicable checks and report actual results. The intended baseline is strict TypeScript, formatting/lint, meaningful automated tests, SAST/SCA/secret checks, and production-profile builds/smoke checks. TypeScript, ESLint, Prettier and Vitest are implemented; dedicated SAST/secret tooling remains pending; Playwright remains optional for later flow coverage. Do not invent commands or claim checks exist.
5. Update the owning policy when an accepted decision changes. Update the code map only when navigation is affected; verify links against real files. Report material files, decisions, checks, index impact, and remaining limitations concisely.

## Deferred choices

Keep unresolved choices explicit in their owning document: auth/session integration; field-error wire format and error-code catalog; project-specific query policy; dedicated form/security/telemetry tooling; project design values/device matrix; animation library selection, budgets and motion-control design (a project decision is mandatory before publishing animation that needs pause/stop/disable); hosting and release policies. A preferred conditional library is not a requirement to install it in every project.

No deployment target or publishing credentials are selected. Keep the existing provider-neutral server/static profiles and deployment-dev.yml/deployment-prd.yml conventions. Preserve documented decisions unless the user changes them.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
