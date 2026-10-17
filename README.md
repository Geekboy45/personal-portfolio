# Next.js frontend template

A replaceable PokéAPI reference frontend. No database, authentication provider or deployment host is configured.

## Run and verify

Use Node **24.22.0** and pnpm **11.25.0**, then `pnpm install --frozen-lockfile`.

| Task                                 | Command                                      |
| ------------------------------------ | -------------------------------------------- |
| Develop server profile               | `pnpm dev`                                   |
| Develop static profile               | `pnpm dev:static`                            |
| Format, lint, strict types and tests | `pnpm check`                                 |
| Server artifact and smoke            | `pnpm build` then `pnpm smoke:server`        |
| Static artifact and smoke            | `pnpm build:static` then `pnpm smoke:static` |

Build/smoke profiles sequentially: they share `.next`. `out/` is the static artifact; `.next/standalone` and the Dockerfile supply the server artifact. Named scripts explicitly select the deployment profile and traditional caching. A derived project must select one profile in its scripts and delivery workflows before adding runtime-dependent features. Both delivery workflows currently prepare server artifacts; neither publishes to a hosting provider.

The landing is generated at build time. The explorer owns browser queries to public PokéAPI through a feature-scoped TanStack Query client: 5-minute freshness, 10-minute inactive retention, no retries. The transport retains its 15-second deadline through body transfer. Name/ID search has a bounded catalog exception in [performance policy](docs/performance.md), not a general platform-search pattern.

## Replace the demonstration

- Replace `src/features/pokemon` and route composition; retain the HTTP contract and meaningful tests.
- Map brand values in `src/styles/tokens.css`. Remove the Pokémon domain token group with the demo. Shared UI primitives contain no Pokémon behavior.
- The observation form persists only non-sensitive demo drafts. It validates stored data, provides deletion, and ignores drafts after seven days; expiry does not erase bytes from browser storage. Design identity isolation separately before adding authenticated persistence.
- Public indexing is off. Configure a real HTTPS `NEXT_PUBLIC_SITE_ORIGIN`, `ALLOW_INDEXING=true` and `RELEASE_STAGE=production` deliberately at build time for a public project. Noindex builds publish an empty sitemap. See [SEO policy](docs/ui.md#landing-page-seo).
- Authentication/session integration, production telemetry, dedicated SAST/secret tools and hosting remain pending. The transport callback is not an installed monitoring system. Automated keyboard/contrast tests do not establish complete WCAG conformance.

ESLint 9 is temporarily pinned to satisfy the installed lint-plugin peer ranges and is deprecated upstream. Track its replacement as a coordinated toolchain upgrade; see [architecture](docs/architecture.md#executable-baseline-and-purity). Do not suppress checks or silently upgrade unrelated major versions.

Start navigation with [AGENTS.md](AGENTS.md) and the [code map](docs/code-map.md).
