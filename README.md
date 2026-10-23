# Luis Elizondo — Personal portfolio

A bilingual professional portfolio: English at `/` and Spanish at `/es/`. Pages are prerendered, with small client boundaries for scroll storytelling, the education gallery and clipboard actions.

## Run and verify

Use Node **24.22.0** and pnpm **11.25.0**. Install reproducibly with `pnpm install --frozen-lockfile`.

| Task                                 | Command                                      |
| ------------------------------------ | -------------------------------------------- |
| Local development                    | `pnpm dev`                                   |
| Static-profile development           | `pnpm dev:static`                            |
| Format, lint, strict types and tests | `pnpm check`                                 |
| Server production artifact and smoke | `pnpm build` then `pnpm smoke:server`        |
| Static production artifact and smoke | `pnpm build:static` then `pnpm smoke:static` |

Build profiles sequentially because they share `.next`. The selected deployment is GitHub Pages using the static profile and traditional caching: `out/` is the published artifact. `.next/standalone` remains available for portable Node hosting. The portfolio requires no request-time Next.js runtime.

## Content and photography

Public bilingual editorial content lives in `src/data`. Local typed content is permitted by the architecture; private implementation details and client documents do not belong in public content or assets. `src/features/portfolio/portfolio-page.tsx` composes the server-rendered sections. Project summaries intentionally omit internal diagrams and pipelines.

The education gallery includes three Tec de Monterrey photos: the Business School Top 1% award, graduation and the EXATEC SELIT conference. Graduation uses a narrower portrait frame without cropping. Edit reviewed local paths and bilingual alt text in `src/data/education-gallery.ts`.

The education gallery moves horizontally while the visitor scrolls down, then releases the page back into ordinary vertical flow. The footer's accessibility preference and OS reduced motion switch both storytelling sequences to their static/manual variants. The footer choice persists locally when storage is available; there are no per-section animation debug controls, timers or autoplay.

## Configuration and release

Enable **repository Settings → Pages → Build and deployment → Source: GitHub Actions**. Push to `main`, or run **Actions → Deploy portfolio to GitHub Pages → Run workflow** on `main`. The workflow installs pinned tooling, runs `pnpm check` and the dependency audit, builds/smoke-tests the static site, then publishes `out/` in a separate job. Development artifact preparation remains manual and does not publish. No extra deployment secret is required.

The workflow reads the Pages origin and base path automatically. The current repository works at `https://geekboy45.github.io/personal-portfolio/`; local URLs remain at `/`. After configuring a custom domain in Pages and DNS, rerun the production workflow to rebuild without the repository prefix. Do not set `NEXT_PUBLIC_BASE_PATH` manually in GitHub. For an equivalent local project-path build, set it to `/personal-portfolio` for both `pnpm build:static` and `pnpm smoke:static`, then clear it before normal local builds.

Search indexing remains off by default. To enable it, add repository **Settings → Secrets and variables → Actions → Variables → `ALLOW_INDEXING` = `true`**, then rerun the workflow. Pages supplies the real origin; no placeholder domain is published. The `github-pages` environment may require approval if configured in GitHub. See [deployment](docs/deployment.md#portfolio-selection-github-pages-2026-10-23).

Design roles belong to `src/styles/tokens.css`. Public indexing remains off unless a real `NEXT_PUBLIC_SITE_ORIGIN`, `ALLOW_INDEXING=true` and `RELEASE_STAGE=production` are deliberately supplied at build time. Canonical/reciprocal language alternates are emitted only with a configured origin. Both language versions are actual static routes with correct document language; browser storage cannot override the route.

The original Pokémon reference modules and tests remain in source while shared infrastructure is retained; `/explore/` is no longer a public route and must return 404. They are not portfolio content. There is no database, authentication provider or business backend.

See [AGENTS.md](AGENTS.md), [code map](docs/code-map.md), [motion policy](docs/animations.md) and [current review](docs/portfolio-review.md) for accepted constraints and actual verification limits. Dedicated SAST/secret tooling remains pending; passing tests do not establish WCAG or security certification. Remote Pages publication and domain/DNS configuration must still be verified on GitHub and the DNS provider.
