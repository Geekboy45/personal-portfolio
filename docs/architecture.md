# Architecture and agent workflow

Read when changing structure, execution boundaries, dependencies, or repository navigation.

These are accepted project rules, except items explicitly marked pending. Start with [AGENTS.md](../AGENTS.md) for the shared constraints and task routing.

## Framework baseline

- Pin Next.js to exactly 16.4.2, verified against the next package's npm latest tag on 2026-10-16: https://registry.npmjs.org/next/latest.
- When package.json is created, declare "next": "16.4.2" without a caret, tilde, wildcard, or latest tag. Use the same version for explicitly installed Next.js companion tooling such as eslint-config-next. Commit the selected package manager's lockfile and use reproducible installs in CI.
- This is a baseline, not a permanent upgrade ban. Evaluate later stable/security releases through an explicit dependency update with relevant checks. Installed versions are pinned in package.json and pnpm-lock.yaml; use those versions rather than online defaults.

## Scope and architecture

- Build a frontend template for landing pages and platforms that consume external backend APIs.
- For platforms, the external backend owns business rules, authorization, and persistence. The frontend owns presentation, interaction, and UX validation; it must not reproduce authoritative business rules.
- Server-side frontend rendering does not imply backend business logic or database access. Do not add database access, ORMs, or a business backend to this template.
- Maintain server and static export profiles in the same template. Each derived project must explicitly select one at initialization; there is no implicit default. The profiles have different capabilities and require their own [deployment checks](deployment.md#required-profile-checks-when-implemented).
- Use functions, modules, and composition. Do not introduce mediators, dependency injection containers, generic HTTP repositories, automatic mappers, base service classes, or pass-through layers by default.

## Naming and organization

- Use English names, kebab-case for files and folders, PascalCase for components and types, and camelCase for functions and variables. Preserve framework-required filenames.
- Organize application functionality by feature with shallow folders and descriptive sibling files.
- Separate files when responsibilities evolve independently, execution boundaries differ, or meaningful reuse exists. Keep small private helpers and exclusively local types near their consumer.
- Do not create every possible responsibility file in advance or split every visual fragment into a file.
- Avoid central API, type, component-export, and registry files that require edits for every new feature.
- Keep remote data, local UI state, URL state, and shared client state distinct. Do not add a global state library by default.
- useEffect is prohibited by default in template-owned code. First use appropriate event handlers, derived values, composition, framework/data-loading mechanisms, or supported lifecycle APIs. An exception is allowed only when these alternatives cannot satisfy the concrete requirement correctly and safely. Typical candidates involve synchronization with an external system; convenience alone does not justify an exception.
- For an exception, document the requirement and alternatives considered next to the effect or in its owning integration documentation, keep its scope narrow, declare correct dependencies, and provide cleanup for acquired resources. Verify setup/cleanup and relevant replacement/disposal behavior, including Strict Mode where applicable. Report the exception in the change summary. This documented exception is already authorized by the policy; it does not require another approval solely because it uses useEffect.
- This is a project preference, not a claim that React forbids Effects or that zero Effects guarantees performance. Never disguise effects in render, useMemo, unnecessary layout effects, or a wrapper, and do not add a library solely to hide an Effect. Library internals may legitimately use Effects. See [React's guidance](https://react.dev/learn/you-might-not-need-an-effect) and the [resource lifecycle policy](performance.md#resource-ownership-and-delivery).
- Amendment for animation: synchronizing an imperative animation library (for example GSAP through `useGSAP`, or a player that needs explicit teardown) with the DOM is a recognized external-system case under the exception above. It is authorized without further approval only when every condition in [animations](animations.md#lifecycle-and-effect-amendment) is met (preference order, scope, cleanup, Strict Mode verification, documentation at the effect and report in the change summary). It authorizes no other `useEffect` use, and anything outside those conditions still needs an explicit decision.

### File structure and ownership

Use the following layout as the reference structure. Create folders and files only when needed; the example is not a mandatory scaffold for every feature.

```text
docs/
  code-map.md                  # Compact navigation index of implemented modules
  architecture.md              # Structure, baseline, and agent workflow
  api.md                       # API/auth, errors, and forms
  ui.md                        # Design system, accessibility, and landing SEO
  animations.md                # Advanced animation policy and dependency intake
  files.md                     # Images, uploads, and downloads
  performance.md               # Data loading, caching, and lifecycle
  observability.md             # Production diagnosis and telemetry
  verification.md              # Automated checks and security
  deployment.md                # Server/static capabilities and delivery
public/
  images/                      # Public, URL-addressable static images
  files/                       # Public static downloads, when needed
src/
  app/
    layout.tsx                 # Root layout and global style import
    globals.css                # Tailwind entry; imports tokens once
    projects/
      page.tsx                 # Route composition; example feature
  features/
    projects/
      project-list.tsx
      project-form.client.tsx
      projects.api.ts          # External API operations for this feature
      projects.schema.ts       # Runtime schemas, when needed
      projects.types.ts        # Types shared by multiple feature files
      projects.api.test.ts      # Meaningful tests beside their subject
  components/
    ui/                        # Shared visual primitives; no feature/API logic
  styles/
    tokens.css                 # Canonical design values and theme overrides
  lib/
    site-config.ts             # Landing identity/origin/indexing configuration when needed
    http/
      http-client.ts           # Shared transport behavior
      http-error.ts            # Transport error representation
    files/                     # Shared file utilities only if needed
.github/
  workflows/
    deployment-dev.yml
    deployment-prd.yml
Dockerfile                     # Server deployment profile only
```

- app owns routing, layouts, route-level loading/error UI, and screen composition. Features own their functionality and external API operations. lib owns narrowly scoped shared infrastructure.
- Keep single-route private presentation beside its route when appropriate; use features for cohesive functionality. Do not maintain two implementations of the same behavior across these locations.
- Keep feature folders flat initially. Add subfolders only when a coherent group becomes difficult to navigate, not to give every file a folder.
- Use direct imports by default. Shared code must not import feature implementations; features must not depend on app routes. Avoid cyclic dependencies and undocumented imports into another feature's internals.
- Use .client.tsx for explicit client entry components; do not add the suffix to every transitive client dependency. Use server-only enforcement for modules containing server credentials; filenames alone do not enforce execution boundaries.
- Animation stays at small client boundaries around otherwise server-rendered content; never make a page or layout a Client Component only to animate a section, and use `ssr: false` only as [animations](animations.md#nextjs-and-react-integration) allows.
- The executable reference uses Zod, Vitest/Testing Library/MSW, Tailwind and Radix Dialog. Hosting, authentication and telemetry providers remain pending.

### Code indexing and navigation

- docs/code-map.md is the canonical, version-controlled navigation index. Keep it concise and in English, like the code. It describes the current repository, not a future scaffold, a task history, or a substitute for architecture rules. Use relative Markdown links to real files/headings; avoid line-number links that become stale.
- Index by module/feature and responsibility rather than listing every file or exported symbol. Each implemented module entry should identify its purpose, primary entry path/symbol, relevant server/client boundary, important direct collaborators, and test location or focused verification command when present. Add only facts useful for choosing the next file to read. Link actual package scripts instead of inventing commands.
- Include a short project-state/configuration summary (actual installed baseline, selected deployment/cache model, or explicit not-yet-selected state), shared entry points (HTTP, UI/tokens, auth, instrumentation, deployment when implemented), and a task-to-entry-point lookup. Link to canonical policies rather than copying their contents into the index. Never index proposed or missing files as implemented.
- Navigation workflow: use the map when the entry point is unclear or the work spans modules. For a known-file task, start from that file and its applicable policy. Use targeted rg searches and bounded file reads to verify the code. Expand to direct dependencies only as needed; do not routinely scan the whole repository, dump every file, or load unrelated policy sections. The source and installed configuration are authoritative if the map disagrees; correct the stale entry as part of the change.
- Update affected index entries in the same change whenever adding/removing/moving a module, route entry point, shared component family, integration, public contract/symbol, ownership/execution boundary, test command, or build/deployment/cache configuration. A significant behavior change also requires an update when the map would otherwise direct a reader incorrectly. Local fixes/copy/style changes with no navigation impact do not require index churn.
- At completion, review the changed paths (git diff/name-status when Git is available, otherwise the known edit set), decide whether indexing was affected, update only relevant entries, remove stale links, and verify referenced paths and documented symbols/scripts against the actual tree. Report index updated or no navigation impact in the task summary when relevant; do not claim an automated freshness check exists before implementing one.
- Keep stable headings, deterministic module order, and focused edits to minimize merge conflicts. Do not regenerate or reorder the entire index, add per-task timestamps, copy implementation details, or append a changelog on every change. Do not make a central symbol/export registry just to enable indexing. If the map eventually becomes unwieldy, split only the large section into a linked local map with one owner; do not precreate per-folder indexes.
- Never include secrets, raw environment values, private customer data, dependency trees, node_modules, .next/out/build artifacts, coverage output, or generated lockfile contents in the map. Do not introduce embeddings, an external indexing service, or another dependency by default. The aim is less context needed for navigation, not a second copy of the codebase.

## Changes by agents

1. Read the applicable architecture rules and documentation matching the installed framework/library versions before using framework features. Check the actual installed version and enabled configuration; do not assume the current online defaults match the project. Evaluate experimental features before adoption.
2. Respect approved decisions. A pending item is not authorized; do not quietly select a provider, library, contract extension, or deployment target on its behalf. Record accepted decisions, reasons, and conditions for reconsideration, keeping the owning topic document and the compact AGENTS.md entry point aligned with implementation.
3. Determine and record the deployment profile, explicit cache model/data policies, and server/client execution boundaries before relevant implementation. Do not implement profile/cache-dependent features while those prerequisites remain undefined.
4. Use docs/code-map.md when orientation is needed; known-file tasks may start directly from the relevant source. Verify the source with targeted searches, and search for existing components, tokens, API utilities, and patterns before creating alternatives. Reuse the appropriate owner and avoid duplicated responsibilities/styles.
5. Justify new dependencies, abstractions, and client boundaries with a concrete requirement and relevant bundle/runtime cost. Do not mark an entire screen or layout as client merely to avoid designing its boundary.
6. Validate inputs and API payloads at appropriate boundaries, and protect private information. Keep authoritative validation/authorization in the backend and secrets out of client bundles, static artifacts, URLs, and logs.
7. Account for loading, error, empty, success, and cancellation states where applicable. Document any intentionally inapplicable state rather than creating artificial UI for every operation.
8. Run the checks applicable to the changed behavior and selected profile. Report actual commands/outcomes, failures, and checks not run with their reason. Do not claim a passing build/test or deployed result without evidence.
9. Surface conflicts with accepted rules before implementing the conflicting behavior. Continue independent authorized work where possible, but never introduce hidden workarounds, suppress meaningful checks, or misrepresent unsupported capabilities.
10. After relevant changes, update and verify the affected entries in docs/code-map.md under the indexing policy. Finish with a concise summary of affected files, material decisions, verification results, index impact, and remaining risks or unresolved decisions relevant to the change. Do not invent tests or risks merely to populate a report.

## Executable baseline and purity

- Runtime: Node 24.22.0; package manager: pnpm 11.25.0. Next/React and other exact versions are owned by package.json and its lockfile, not duplicated throughout these policies.
- TypeScript 5.9.3 and ESLint 9.39.4 are the compatibility baseline for the installed Next lint plugins. ESLint 9 is deprecated upstream: this is a temporary tooling constraint, not a long-term recommendation. Reassess the complete lint peer-dependency set together during the next toolchain update; do not update a major independently or disable checks to make it work.
- State updaters, reducers and render calculations are pure. Persisting data, publishing notifications or logging operations belongs in event handlers or a justified external-system lifecycle. Verify observable effects under Strict Mode.
- Dependency changes must pass the independent typecheck, lint, tests, and production-profile checks. A framework build does not replace the independent typecheck. Distinguish filesystem/sandbox dependency-resolution failures from actual source diagnostics before changing code.
- Optional capability libraries are not part of the baseline and are never preinstalled. A category with an approved catalog and intake checklist (currently animation: [animations](animations.md#dependency-intake)) allows only the listed libraries, and only after the intake is recorded. Any library outside an approved catalog requires an explicit architecture decision recorded in its owning topic document before installation. Do not add wrappers or abstraction layers over such libraries in advance.
