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

Native CSS owns color/focus feedback; hero-entry and hover-translation movement were removed. GSAP owns story SVG plane transforms/opacity, plus the education track transform and bounded pin. It does not hide narrative content or intercept wheel/touch events. The shared footer checkbox restores the static SVG and native gallery overflow by reverting both sequences; it persists locally and remains subordinate to OS reduced motion. OS reduced motion wins over the control. Official React integration cleans up on toggle, preference replacement, Strict Mode and unmount. Static content remains independent of the animated state.

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

## Career and skills visual revision (2026-10-23)

Replaced the career node diagram with three SVG architectural planes and redesigned the six skills domains as an editorial catalog. Right-hand career copy, data and indexing policy are unchanged. No dependency or navigation entry was added.

Validation: `pnpm check` passed (58 tests in 16 files). Turbopack failed to start its CSS worker both inside and outside the sandbox; production builds were therefore checked with the installed Next CLI `build --webpack`, with explicit static/server profiles and traditional caching. Both profiles built and their smoke checks passed. No project compiler configuration was changed. Chromium inspection of the static artifact verified Spanish desktop/mobile (390px, no horizontal overflow), scroll-driven plane transforms, and restoration of static transforms through the shared motion checkbox; no browser console errors were observed. Full OS reduced-motion emulation, JavaScript-disabled browser execution, assistive technology, real-device testing and comparative performance measurements remain unverified.

## Contact motion and AGENTS review (2026-10-23)

The contact panel now has native finite hover/focus-within image zoom and a light sweep. It reuses the existing client boundary and shared motion preference, keeps text/actions stationary, and adds no effects, dependencies or continuous animation. Color/easing/duration remain token-owned. Browser inspection of the production static build confirmed image scale 1.05 with 0.9s duration on keyboard focus and scale none / 0s when reduced motion is enabled; 390px mobile layout has no horizontal overflow. The user's preference was restored after testing.

The targeted AGENTS review checked portfolio server/client ownership, existing effect exceptions, direct typed editorial data, semantic tokens, image sizing/alt/static compatibility, explicit deployment/cache profiles, workflow validation/publication separation, the 15,000ms HTTP deadline and explicit indexing controls. Corrected stale code-map hosting/motion-control wording. No new architectural violation was identified in the changed portfolio code. This is not an exhaustive security certification: retained source-only Pokemon client naming/dialog contracts, dedicated SAST/secret scanning, Docker execution, complete accessibility and performance evidence remain pending as recorded above. `pnpm check` passed 58 tests plus formatting/lint/typecheck, and `pnpm audit --audit-level high` reported no known vulnerabilities. Static and server validation uses the installed Webpack CLI fallback for the previously observed local Turbopack failure; production workflow compiler settings remain unchanged. No publication or indexing change was made.

## Contact invitation redesign (2026-10-23)

At the owner's request, the photographic contact panel is replaced by a cobalt typographic banner: bilingual invitation, decorative arrow/rings, and a separate ink strip for email, clipboard and LinkedIn. The old architectural asset is not requested by the contact component. Existing native motion/preference handling now applies to the arrow and outer ring, with no new lifecycle or dependency. The earlier photo/zoom descriptions are historical and superseded. Contact link assertions follow the new bilingual CTA labels. Indexing and publication settings are unchanged.

## Hero contact CTA (2026-10-23)

The hero now prioritizes the bilingual contact anchor with the existing primary color and a shared large button size (56px minimum height). Project exploration is a secondary text link. Mobile stacks the actions with a full-width main CTA. Shared Button/LinkButton own typed md/lg sizing; existing consumers retain md by default. No animation, dependency, analytics, indexing or publishing change was introduced. The intent is clearer contact hierarchy; no click-rate uplift is claimed without measurement. Bilingual route tests assert that the new CTA reaches #contact.

## Formal CTA interaction (2026-10-23)

The hero CTA retains its primary color and label; only its decorative arrow advances 4px over 300ms on hover or visible keyboard focus. The small client arrow subscribes to the existing reduced-motion preference; the hero remains server-rendered. No continuous attention effect or new dependency. Formatting, lint, TypeScript and all 58 tests passed. Existing Webpack fallback is used for profile builds; no workflow/compiler setting was changed.

## CV and employment (2026-10-27)

Added a compact server-rendered employment section within the career section, with three bilingual entries sourced from the owner's CV. The product trainee/analyst roles share the stated Feb 2025–Mar 2026 tenure without inventing separate transition dates. Header Experience navigation targets employment. A native base-path-aware link downloads the original English PDF from public/files; SHA-256 matches the supplied file. Project summaries now distinguish document-review reduction (~70%) from signature approval automation (~80%); GILSA and Aeris descriptions remain concise.

No dependency, effect, client boundary, animation, metadata or indexing policy change. Format/lint/typecheck and 58 tests passed. Both server and static builds passed with the existing local Webpack fallback; both smoke checks verify PDF status, MIME and signature. Windows sandbox restrictions required elevated build/server checks. Browser visual verification was blocked by the browser URL security policy; responsive visual and assistive-technology acceptance remain unverified. Dedicated SAST/secret scanning remains pending. No publication was performed.

## Employment presentation and contact CV (2026-10-27)

Employment now uses a connected card timeline with the current position highlighted in the existing ink/inverse palette. Finite native hover transitions move cards 4px and scale decorative markers; a focused client list consumes the shared preference while content remains server-owned. No new effects or dependencies; touch and reduced motion remain static. Contact includes the same base-path-aware original English PDF download. Skills descriptions and the architecture quote use shorter, concrete bilingual wording; the product narrative date now includes 2026 to match the CV tenure. Existing project disclosures and education content remain concise.

Formatting, lint, TypeScript and 59 tests passed, including both download links and preference replacement. Visual browser/device checks remain unverified following the browser security-policy block recorded above; this is not full accessibility or performance acceptance. Indexing and deployment configuration are unchanged.
Both server/static production builds and smoke checks passed using the established local Webpack fallback, including PDF delivery. No publication was performed.
