# Code map

## Current state

An executable Pokémon reference frontend is implemented. Exact versions and scripts are owned by [package.json](../package.json); see [README](../README.md) for startup and replacement instructions.

- Installed Next.js baseline: **16.4.2**. Explicit server/static scripts use traditional caching; derived projects select one profile.
- Landing content is prerendered; Pokémon reads run in the browser. No auth, database, telemetry exporter or hosting integration exists.
- Accepted constraints and deferred choices are owned by [AGENTS.md](../AGENTS.md) and its linked topic policies.

## Implementation entry points

| Work                        | Owner and collaborators                                                                                                                                                              | Verification                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| Routes and metadata         | [root layout](../src/app/layout.tsx), [landing](../src/app/page.tsx), [explore](../src/app/explore/page.tsx); server composition, static sitemap/robots                              | profile build/smoke scripts                              |
| Landing animations          | [SpecimenScrollDeconstruction](../src/features/landing/specimen-scroll-deconstruction.client.tsx); GSAP ScrollTrigger specimen dissection chamber, client boundary                   | landing page tests, browser verification                 |
| Collection and search       | [PokemonExplorer](../src/features/pokemon/pokemon-explorer.client.tsx); browser query provider, URL pagination, bounded public lookup                                                | sibling explorer tests                                   |
| Detail and observation      | [PokedexDevice](../src/features/pokemon/pokedex-device.tsx); detail/species queries, tabs, form and notifications                                                                    | sibling device tests                                     |
| API identity and validation | [pokemon.api.ts](../src/features/pokemon/pokemon.api.ts), [schemas](../src/features/pokemon/pokemon.schema.ts); third-party adaptation and validated references                      | sibling API tests                                        |
| Browser drafts              | [storage](../src/features/pokemon/pokemon-observation.storage.ts); versioned, validated drafts with logical expiry and deletion                                                      | sibling storage tests                                    |
| HTTP                        | [requestJson](../src/lib/http/http-client.ts), sibling envelope/error modules; no query cache or credentials singleton                                                               | sibling HTTP tests                                       |
| UI and tokens               | [Dialog](../src/components/ui/dialog.client.tsx), [ToastProvider](../src/components/ui/toast.client.tsx), shared button/input; [tokens](../src/styles/tokens.css) owns design values | toast tests, device keyboard tests, token contrast tests |
| Language preference         | [LocaleProvider](../src/lib/i18n.client.tsx); browser storage subscription with English server snapshot                                                                              | language-selector tests                                  |
| Error recovery              | [error boundary](../src/app/error.tsx); optional real digest, no claimed telemetry export                                                                                            | error-page tests; [policy](observability.md)             |
| Delivery                    | [runner](../scripts/next-profile.mjs), [smoke checks](../scripts/smoke.mjs), [CI](../.github/workflows/validate.yml), [Dockerfile](../Dockerfile)                                    | build/smoke matrix; Docker runtime check in CI           |

## Maintaining this map

Add module entries only when implemented: purpose, primary entry path/symbol, execution boundary, important direct collaborators, and test location or real verification command. Use stable links to actual files.

Update affected entries when structure, contracts, boundaries, or commands change enough to alter navigation. Do not list every symbol, copy policies, or update the map for local changes with no navigation impact. Known-file tasks may start directly from the source and applicable policy.
