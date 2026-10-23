# Portfolio review — 2026-10-17

## Current implementation

- English at `/` and Spanish at `/es/`, prerendered with separate root layouts and one shared server shell. Route locale controls document language, navigation, metadata, headings, descriptions, dates, actions and accessible labels. A stored demo preference cannot override the route. Cross-language navigation uses real links and deliberately reloads the document.
- Three public career chapters: business intelligence, applied AI/product and technical leadership. A small client island synchronizes a decorative SVG with scroll; all narrative text remains server rendered and visible. Native sticky layout, no pinning or scroll-jacking. Below 768 CSS pixels the illustration is static and chapter spacing is compact.
- Three brief public project summaries. The owner authorizes project names, company names and outcome metrics; implementation details remain private. Gestor | Validador Documental is one initiative at Crediclub (~80% automation, ~70% less manual review); GILSA is referenced under Datómicos; Aeris covers loan renewal at Crediclub (100% coverage). No technical case studies or additional detail panels were added. The five previous project diagrams remain removed from `public`; smoke checks verify an old direct asset path returns 404.
- Education has two large landscape frames and one narrower portrait frame that translate sideways as vertical page scrolling advances a bounded pin. The footer accessibility preference and OS reduced motion restore native manual overflow. The keyboard-focusable region, previous/next buttons and announced position remain. There is no timed autoplay or custom scroll engine. All three slots are filled with the Business School Top 1% award, graduation and EXATEC SELIT conference photos from Tec de Monterrey. Graduation preserves the full portrait with object-contain. Navigation and position tracking use actual photo offsets to support unequal widths. Gallery buttons stay disabled until their DOM track mounts; without JavaScript the native scroll region remains available.
- Contact copy and actions are bilingual. A split panel pairs the dark text surface with an original generated architectural still life (`public/images/profile/contact-connections.webp`, 1100×1100, 153744 bytes); the image is decorative, lazy loaded, and stacks below the actions on mobile. It does not reuse the workspace banner image. Production-browser inspection at 1280×900 and 390×844 verified the composition and readable actions. Only the owner-provided Gmail address and LinkedIn profile are exposed as contact channels; GitHub and CV request links were removed. Semantic tokens and shared button/link variants remain the appearance owners.

## Content ownership

`src/data` is allowed for typed local editorial content. It is neither database access nor a business backend. The portfolio imports content directly; it adds no repository/service layer. Keep private implementation details, credentials and client documents outside public data and assets. Feature-local placement is an option when it improves ownership, not a mandatory rename for these small modules.

## Architecture and motion decisions

Toast feedback uses the existing ink surface and semantic status colors, without generic notification/time labels. The close target is 44×44 CSS pixels, descriptions wrap within mobile insets, and region/close labels follow the route locale. Existing live-region urgency and cleanup of dismissal timers remain intact; no notification animation was added.

The pages, root layouts, primary text, metrics, public project summaries and gallery figures remain Server Components. Client boundaries own only the story engine/control, scroll-driven gallery and its controls, language context and clipboard feedback. The two scroll sequences use existing pinned GSAP 3.15.0, ScrollTrigger and @gsap/react 2.1.2; no dependency was added. The authorized `useGSAP` lifecycle exception is documented beside the hook and in [animations](animations.md#career-story-adoption-and-motion-controls-2026-10-17).

Native CSS owns color/focus feedback; hero-entry and hover-translation movement were removed. GSAP owns story SVG transforms/opacity and four short dashed paths, plus the education track transform and bounded pin. It does not hide narrative content or intercept wheel/touch events. The shared footer checkbox restores the static SVG and native gallery overflow by reverting both sequences; it persists locally and remains subordinate to OS reduced motion. OS reduced motion wins over the control. Official React integration cleans up on toggle, preference replacement, Strict Mode and unmount. Static content remains independent of the animated state.

Production indexing is still off unless explicitly configured. Canonical and reciprocal language alternates require a real configured origin. Both provider-neutral delivery profiles remain supported. GitHub Pages/static was selected on 2026-10-23; the workflow uses the built-in GitHub token and current Pages metadata. Remote publication and domain configuration have not been executed locally.

## Verification evidence

Pages configuration verification (2026-10-23): `pnpm check` passed all 58 tests in 16 files, plus formatting, ESLint and strict TypeScript. `pnpm audit --audit-level high` reported no known vulnerabilities. Both workflow YAML files parsed successfully. Server build/smoke passed; static build/smoke passed with `/personal-portfolio` and production indexing enabled, then again with an empty prefix and indexing disabled. Smoke now verifies public images and prefixed internal links as well as generated assets, bilingual routes, sitemap policy and 404s. The final local export was restored without a prefix. No remote Actions run or publication was performed.

- Formatting, ESLint and strict TypeScript passed. The test suite has 52 tests in 15 files, including route-locale precedence, bilingual public content/gallery slots, and story cleanup under Strict Mode, disable/re-enable, unmount and live reduced-motion replacement.
- Server and static production builds/smoke checks cover `/`, `/es/`, retired `/explore/` returning 404, generated assets, correct `html lang`, narrative text present in HTML, three gallery slots, exclusion of old project details, noindex, nested refresh, missing routes and an old diagram URL returning 404.
- Real in-app Chromium production inspection: 1280×900 desktop and 390×844 mobile with no document horizontal overflow, Spanish/English document navigation, progressing SVG attributes while scrolling, and keyboard disable restoring static attributes. Downward page scrolling produced actual negative track translations while one gallery pin was active. The shared footer preference removed the pin, restored native overflow, persisted across language navigation and restored one pin when unchecked. Gallery controls also reached the final item and disabled its next button. Normal page inspection showed no relevant console errors.
- One full test run during concurrent compilation timed out waiting for the unchanged Pokémon species fixture. The same test file immediately passed in isolation without assertion or source changes. The final suite is run separately from builds.
- The restored application lockfile is retained with pinned dependencies. The earlier production dependency audit reported no known vulnerabilities. It is not SAST or a secret scan.

## Remaining limits

- Real OS reduced-motion emulation, JavaScript-disabled browser execution, a complete touch/device matrix, assistive-technology checks, module/runtime-failure injection, frame stability, repeated-navigation memory measurement and baseline/delta Core Web Vitals remain unverified. Unit matchMedia tests do not substitute for these production browser checks. This is a local implementation, not full animation-policy or WCAG acceptance.
- The reference explorer is no longer a public route. Its retained source `bare` dialog variant still delegates headings/close behavior to callers; this source-only contract issue is not used by the portfolio.
- The existing below-fold workspace JPEG is approximately 835 kB and image optimization is disabled for static compatibility. Responsive source generation/quality comparison remains useful; size hints alone do not resize an unoptimized asset.
- Dedicated SAST, secret scanning and Docker execution remain pending. No remote deployment or indexing activation was performed; Pages settings and DNS require remote verification.

## Earlier corrections retained

The initial review removed clipped hero ornaments, infinite portfolio/header loops, client-side numeric counters, remote CSS font loading, global feature-style recipes, broad hydration-warning suppression, a silent production-origin fallback and an unmanaged clipboard reset timer. It recovered a valid application lockfile from the installed graph; the original tracked file concatenated a leading package-manager YAML document with the application document. Resolved application versions were preserved. A fresh empty-directory installation was not performed.

## Production presentation correction

The per-section “Disable animation/effect” buttons were removed. Only a discreet footer accessibility checkbox remains, shared by both sequences, with persisted preference and a storage-rejection fallback. The obsolete Pokémon public route and laboratory/error language were removed; error/404 views now belong to the portfolio. Source reference tests remain for retained shared infrastructure. This is the actual portfolio implementation, not a demonstration UI.

## Current route asset footprint

The final static HTML for each language references 11 unique external JavaScript files: 735,904 raw bytes, 238,134 bytes when each file is gzip-compressed locally. Both routes share the same files. This is an artifact-size inventory, including framework code and compatibility scripts, not a measured transfer trace or an animation-specific delta. CSS, inline RSC payload, runtime CPU/memory and real-user Core Web Vitals are not included. No representative pre-change performance baseline exists; no regression/field-compliance claim is made.
