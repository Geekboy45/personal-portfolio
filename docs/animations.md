# Advanced animation policy

Read when adding, changing or reviewing motion, scroll effects, animated media, or any animation dependency.

These are accepted project rules, except items explicitly marked pending. Start with [AGENTS.md](../AGENTS.md) for the shared constraints and task routing. This document is the single owner of animation policy; [architecture](architecture.md), [UI](ui.md), [performance](performance.md) and [verification](verification.md) only point here for the topics they own and must not restate these rules.

## Status and decision record

The portfolio combines native CSS microinteractions with a scoped GSAP/ScrollTrigger career narrative. The legacy specimen component is not composed into the route. The project record below describes adoption and remaining production acceptance evidence; dependency presence alone is not evidence of acceptance. Reviewed against official sources on 2026-10-17 (see [references](#references)); recheck version-specific APIs against the versions actually installed.

| Decision                                                                                           | Status                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Four-tier hierarchy as a preference guide, not a mandatory elimination sequence                    | Approved                                                                                                                                                             |
| Motion, GSAP + ScrollTrigger and dotLottie are permitted optional dependencies, never preinstalled | Approved                                                                                                                                                             |
| Any other animation library (for example react-spring, anime.js, AOS, Lenis, Rive, Three.js)       | Requires an explicit architecture decision before installation                                                                                                       |
| Bounded `useEffect`/lifecycle amendment for imperative animation libraries                         | Approved, conditional ([amendment](#lifecycle-and-effect-amendment))                                                                                                 |
| Dependency intake checklist and project adoption record                                            | Approved                                                                                                                                                             |
| Accessibility, performance, SEO and acceptance criteria below                                      | Approved                                                                                                                                                             |
| Exact package versions                                                                             | Pending per project; the lockfile is the record                                                                                                                      |
| Numeric budgets beyond public Core Web Vitals thresholds                                           | Pending until a representative baseline exists                                                                                                                       |
| Motion controls (pause, stop, hide, disable): design in the base template                          | Pending; a project decision is mandatory before publishing animation that needs them ([controls](#motion-controls))                                                  |
| Playwright dependency                                                                              | Not installed by default; real-browser tests are required for scroll, viewport, hydration or critical-interaction animation ([validation](#real-browser-validation)) |
| Smooth-scroll or scroll-jacking mechanisms                                                         | Not approved; requires its own explicit decision and a11y review                                                                                                     |

## Selection hierarchy

The tiers are a preference guide, not a mandatory sequence of successive eliminations. Choose the technology whose functionality, maintainability and measured performance best fit the concrete requirement, and record the reasoning briefly in the change summary. Lower tiers are preferred when they fit equally well because they add no dependency, but a higher tier may be chosen directly when it is clearly the better fit; do not build a lower-tier version first just to discard it. A simple fade, slide, hover, focus or state transition never justifies a dependency.

| Tier | Technology                                                                            | Use for                                                                                                                                                               | Do not use for                                                                                  |
| ---- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1    | CSS transitions/animations and Tailwind; Web Animations API; native scroll-driven CSS | Default when it fits the requirement. WAAPI when programmatic play/pause/reverse/completion is needed.                                                                | Choreography that cannot be expressed or controlled sanely without a library.                   |
| 2    | Motion (optional dependency)                                                          | Declarative React animation: state-to-state transitions, enter/exit, layout animation, gestures, orchestration where its features justify its cost.                   | Effects Tier 1 delivers equally well with less code.                                            |
| 3    | GSAP + ScrollTrigger (optional, specialized)                                          | Complex timelines, storytelling, scroll-synchronized sequences, pinning, advanced SVG, choreography that would be harder to maintain or perform worse with Tiers 1-2. | A default replacement for CSS or Motion. Smooth-scroll or scroll-jacking by default.            |
| 4    | dotLottie (optional, specialized)                                                     | Designer-authored vector animation, animated illustrations and interactive Lottie-compatible assets.                                                                  | Spinners, icon transitions or decoration that CSS/SVG/a static image handles. Video-like media. |

Cross-tier rules:

- Do not run two engines that control the same properties of the same element (for example GSAP and Motion on one element's transform, or a CSS transition plus a JS tween on the same property). Each element property has one owner.
- Mixing tiers in one route needs a justification covering the combined bundle and lifecycle cost.
- `src/styles/tokens.css` remains the source of global visual-system motion values (shared durations, easings and distances used across the UI; [UI tokens](ui.md#design-system-configuration-and-ai-handoff)). Parameters specific to one choreography (durations, easings, delays, stagger, sequencing) may be defined locally in TypeScript beside the animation that owns them. Do not create a shared or global motion table in TypeScript that duplicates or competes with the tokens; a local value that is reused by another choreography or feature, or that restates the meaning of an existing token, moves to `tokens.css` or uses the token.
- Animation behavior specific to one feature lives in that feature. A shared primitive in `src/components/ui` requires meaningful reuse and no brand or feature specifics.

### Tier 1 specifics

- Tailwind `motion-safe:`/`motion-reduce:` variants and `@media (prefers-reduced-motion: reduce)` are the baseline for declarative motion.
- Web Animations API: cancel or finish animations on replacement and disposal. If started from an effect, the lifecycle amendment applies.
- Native scroll-driven animation (`animation-timeline`): adopt only after verifying support in the project's target browsers against a current compatibility table at adoption time; wrap it in `@supports` with a fully readable, non-animated fallback. Do not assume universal support or reuse another project's matrix.

### Tier 2: Motion

- Choose the import style by animation complexity, the Motion features actually required and measured performance; no style is mandatory. `motion/react` with the full `motion` component is the simplest and fits when many features are used or the measured cost is acceptable. `motion/react-m` with `LazyMotion` (loading only the needed feature bundle, optionally asynchronously) is an option when measurement of the real route shows the initial cost matters and the required features fit a bundle; `m` components animate only inside a `LazyMotion` provider. Use `motion/react-client` when a Server Component must render motion elements without a local client file (it is still client code and still ships Motion's client JavaScript).
- Motion's own guide (reviewed 2026-10-17) publishes approximate figures: the `motion` component cannot be tree-shaken below about 43 kB, `m` with `LazyMotion` is about 5 kB for the initial render plus features, and `useAnimate` has a mini WAAPI-only variant (about 3.3 kB) versus a hybrid (about 23 kB). These are vendor figures, not measurements of this template; measure the real route.
- Keep `MotionConfig` and, when used, `LazyMotion` providers beside the animated island, not in the root layout ([performance](performance.md#loading-and-rendering)).
- `MotionConfig reducedMotion="user"` honors the OS preference. Per Motion's documentation it disables transform and layout animations but keeps opacity and color animating, so looping, autoplaying or other non-transform motion still needs explicit handling under [accessibility](#accessibility).

### Tier 3: GSAP and ScrollTrigger

- Packages: `gsap` (core and the ScrollTrigger plugin) and `@gsap/react`. Import and register only the plugins used, in the client module that owns the animation, not in layouts.
- Licensing: GSAP is distributed under its Standard "No Charge" license, which carries restrictions (notably on products that compete with Webflow's visual animation tooling). Read the current license text at adoption, confirm the project's use complies, and record the review date in the [adoption record](#project-adoption-record). Do not rely on summaries.
- ScrollTrigger pinning inserts spacing elements and shifts layout: reserve space, verify CLS, and verify trigger positions after late layout changes (images, fonts, dynamic content).
- GSAP does not apply reduced motion automatically. Use `gsap.matchMedia()` (or an equivalent explicit check) to build the full and reduced variants.
- No ScrollSmoother, Lenis or other smooth-scroll/scroll-jacking by default. Native scrolling, keyboard scrolling, anchor navigation, find-in-page and focus-into-view must keep working; any proposal is a separate decision with an accessibility review.

### Tier 4: dotLottie

- Prefer the official React adapter (`@lottiefiles/dotlottie-react`) when it covers the requirements. Use the low-level player (`@lottiefiles/dotlottie-web`) only for a documented need for direct control.
- Evaluate asset size, WASM runtime download, renderer, memory and compatibility against the alternatives (CSS/SVG, static image). Do not assume dotLottie is the lightest option.
- The player's default configuration fetches its WASM runtime from a public CDN. That violates the no-third-party-resource rule below. Configure a same-origin WASM URL (`setWasmUrl`, bundled or served from `public/`) so the call runs before any player instance is created. Per the package documentation, setting it disables the built-in CDN fallback, so a load failure must degrade to the static fallback. WebAssembly may need a deliberate CSP allowance, which must be narrow ([security](verification.md#security-checks-and-secure-implementation)).
- Verify, against the installed version and the production artifact of the selected deployment profile, that: `setWasmUrl` executes before the first player initializes (including after client navigation and remounts); the WASM request resolves from the project's own origin and base path, with no request to a third-party CDN, in the server profile and, for the static profile, from the exported output served by a static-only server; and the static fallback appears when the WASM or animation file fails to load. Check this in a real browser's network and console output, not only with mocks ([validation](#real-browser-validation)).
- Animation files (`.lottie`/Lottie JSON) are reviewed repository assets with recorded provenance and license. Do not load animation files from third-party hosts by default; treat external files as untrusted content.
- Classify each animation before implementing it, because the classification defines its accessibility. Informative: it conveys content, state or instructions that are not available in adjacent text. Provide an accessible name or description (for example `role="img"` with a label) or equivalent adjacent text, keep it exposed to assistive technology, and provide a static equivalent. Decorative: it adds no information. Hide it from assistive technology (for example `aria-hidden="true"`), make it non-focusable and give it no text alternative. The classification decides naming and exposure only; it does not exempt auto-playing motion from [motion controls](#motion-controls) or reduced-motion handling.
- The player does not necessarily honor reduced motion: do not assume it; verify and, when reduced motion is active, show a static frame instead of autoplay.

## Dependency intake

Before adding any animation library, the change records all of the following in its summary and in the [adoption record](#project-adoption-record):

1. Functional need and the native (Tier 1) alternative that was considered.
2. Reason for choosing this library, based on functionality, maintainability and performance, compared with the other approved options.
3. Compatibility with the pinned Next.js and React versions and the project's target browsers.
4. Maintenance, support, license, security posture and transitive dependencies.
5. Measured or estimated impact on JavaScript, CSS, WASM, network, CPU and memory, as applicable.
6. Loading and isolation strategy per route or component.
7. Accessibility strategy and behavior with animation disabled.
8. Owner of initialization, cancellation and cleanup of every acquired resource.
9. Tests and acceptance criteria from [acceptance](#acceptance-criteria).

Rules:

- Install with pnpm and commit `pnpm-lock.yaml`; follow the version-pinning convention of the repository's `package.json`. The lockfile, not this document, records versions. Dependency changes pass the checks in [architecture](architecture.md#executable-baseline-and-purity).
- No CDN-hosted scripts and no animation assets or runtimes loaded from third parties by default. Any exception names the concrete requirement and its security/privacy review.
- No generic wrappers, adapters or abstraction layers over animation libraries built in advance. Import the library directly in the feature that needs it; extract a shared component only when reuse is demonstrated.
- Keep the dependency isolated to the route or feature that uses it so removal is a bounded change.

### Project adoption record

Derived projects fill this table when they adopt a library. Legacy dependencies without completed intake remain explicitly unaccepted.

| Library            | Version (lockfile)        | Tier | Justification                        | Routes/components                                        | Measured impact                               | License review date |
| ------------------ | ------------------------- | ---- | ------------------------------------ | -------------------------------------------------------- | --------------------------------------------- | ------------------- |
| GSAP + @gsap/react | 3.15.0 / 2.1.2 (lockfile) | 3    | Career SVG synchronized with reading | CareerStoryMotion and EducationGallery on `/` and `/es/` | Current footprint in review; baseline pending | 2026-10-17          |

## Next.js and React integration

- Pages, layouts and primary content stay Server Components. Isolate browser-only animation in small `.client.tsx` boundaries. A client wrapper that receives `children` keeps server-rendered children server-rendered. Never convert a page or layout to a Client Component only to animate one section ([architecture](architecture.md#naming-and-organization)).
- `ssr: false` with `next/dynamic` is only valid inside Client Components (Next.js rejects it in Server Components). Use it only for a genuinely browser-only dependency with a documented reason. It is never a convenience or an automatic fix for hydration mismatches; fix the mismatch instead.
- Use dynamic imports only when a real, verified reduction of initial cost exists. Do not blanket-defer first-viewport animation: deferring it can cause visible pop-in and LCP regressions. Judge the first viewport by its LCP and visual stability.
- The prerendered HTML contains the semantic text, links, headings, calls to action and images. It is the final readable state or an intentional static fallback, never content hidden pending JavaScript.
- When JavaScript is disabled, a module fails to load, a runtime cannot initialize, or reduced motion is active, the page remains fully readable, navigable and usable. A failed animated module renders its static fallback through an error boundary or equivalent, never a blank or broken region.
- Animations must not block navigation, input or reading: no intro screens, preloaders or overlays that gate content; link navigation is never delayed for an exit animation.
- Both deployment profiles must work: animation code is browser-only, and assets are bundled or served from `public/` ([deployment](deployment.md)). Verify exported static output when the static profile is selected.

## Lifecycle and effect amendment

This section is an explicit amendment to the `useEffect` prohibition in [architecture](architecture.md#naming-and-organization). It does not remove the prohibition; it defines the only animation cases the existing exception covers without further approval.

Preference order:

1. Declarative CSS, Tailwind, or WAAPI with no effect of our own.
2. A library's declarative React API (Motion elements and hooks). Library internals may use effects; template code writing no effect for it is the goal.
3. The library's official lifecycle integration for imperative engines (`useGSAP` for GSAP; the official React component for dotLottie).
4. A documented `useEffect`/`useLayoutEffect` of our own only when the library has no supported React integration.

Conditions for any effect-based animation lifecycle:

- It synchronizes an imperative library with the DOM or another external system; derived state, data fetching and prop-to-state syncing remain prohibited.
- A comment at the effect names the requirement, the alternatives considered, its narrow scope and its cleanup, and links this section. The change summary reports each use ([architecture](architecture.md#naming-and-organization)).
- Dependencies are correct and minimal; setup is idempotent; cleanup releases everything acquired.
- No side effects during render, in `useMemo`, or in a hand-written wrapper that hides an effect. Do not write a custom `useGSAP`-style wrapper.
- Strict Mode remains enabled and the lifecycle is verified under it.

GSAP:

- Prefer `useGSAP` from `@gsap/react` (it wraps `gsap.context()`, so animations, ScrollTriggers and other GSAP objects created in the callback are reverted on unmount). It is an officially maintained wrapper and this amendment is the declared exception to the "no disguised effect/wrapper" rule; it also uses a layout effect internally, which is acknowledged and not to be replicated.
- Pass a `scope` ref confined to the component; do not use selectors that can match elements outside it.
- Wrap animations created in event handlers or deferred callbacks with `contextSafe` so they are tracked and reverted with the context.
- Create every ScrollTrigger inside the context. Decide `dependencies` and `revertOnUpdate` explicitly and verify behavior when dependencies change.
- Build reduced-motion variants with `gsap.matchMedia()`; matchMedia-created animations are reverted when the query stops matching.
- Verify unmount, remount, dependency changes, route navigation and Strict Mode leave no tweens, ScrollTriggers, listeners, pin spacers or inline styles behind.

Other integrations:

- Use the library's official lifecycle and teardown APIs: destroy or unmount players (for dotLottie's low-level player, its documented destroy method) and remove their listeners.
- Release every acquired resource on replacement and disposal: observers (`disconnect`), listeners, timers, `requestAnimationFrame` handles, WAAPI animations and media-query subscriptions. Prefer `useSyncExternalStore` for subscribing to `prefers-reduced-motion`, matching the existing persisted-preference pattern ([UI contracts](ui.md#enforced-component-contracts)).
- Do not initialize repeatedly, do not leave animations running or DOM mutations (inline styles, classes on `html`/`body`, wrapper elements) after unmount, and do not leak memory.

## Accessibility

WCAG 2.2 AA remains the minimum ([UI accessibility](ui.md#accessibility)). Reduced-motion support below is additional good practice; `prefers-reduced-motion` alone does not establish WCAG conformance and does not replace in-page [motion controls](#motion-controls).

- Respect `prefers-reduced-motion`. Provide a reduced variant (opacity/color only, no parallax, no scroll-linked translation, no autoplaying loops) or no motion for complex effects. Library defaults do not cover every case; verify each mechanism's actual behavior ([Motion](#tier-2-motion), [GSAP](#tier-3-gsap-and-scrolltrigger), [dotLottie](#tier-4-dotlottie)).
- Content stays visible and usable when animation is disabled, fails or has not started.
- WCAG 2.2.2 (Pause, Stop, Hide): moving, blinking or scrolling content that starts automatically, lasts more than five seconds and is shown alongside other content has a keyboard-operable, accessibly named mechanism to pause, stop or hide it. This covers loops, tickers, marquees, autoplaying Lottie and animated backgrounds.
- WCAG 2.3.1 (Three Flashes or Below Threshold): no content flashes more than three times per second or exceeds the general/red flash thresholds.
- Internal policy, referencing WCAG 2.3.3 (Animation from Interactions, AAA, not a conformance claim): non-essential motion triggered by interaction can be disabled. Gate it on the reduced-motion preference and on the mechanism chosen in [motion controls](#motion-controls).
- Never convey information by motion alone; provide text or a static equivalent.
- Keyboard, focus and touch must keep working: no hover-only reveal, no focus loss or trap, no focus indicator clipped by transforms or overflow, no pinned section that traps scrolling, no scroll-jacking.
- Complex animation, parallax and storytelling have a static or reduced-motion alternative that delivers the same content in a readable sequence.
- Decorative animation is hidden from assistive technology; meaningful canvas or animated graphics have a text alternative.
- Handle preference changes during the session when the mechanism supports it (media-query change subscription, `gsap.matchMedia()`, Motion's reduced-motion support); otherwise document that a reload is required.

### Motion controls

`prefers-reduced-motion` is an operating-system signal. It gives no in-page way to pause, stop or hide motion that is already running (WCAG 2.2.2), it does not cover users who have not set it, and it does not by itself make non-essential interaction motion disable-able. Treat it as one input, not as the control.

The template base leaves the control design [pending](#pending-decisions), but the decision is mandatory and blocks publication: a project must not publish advanced animation that needs a pause, stop, hide or disable mechanism until it has decided and documented, in its project documentation referenced from the [adoption record](#project-adoption-record):

1. Which animations need a control and why (WCAG 2.2.2 content; non-essential interaction motion under the internal 2.3.3 policy).
2. The mechanism: per-element control, a global motion setting, or both.
3. The initial state relative to `prefers-reduced-motion` (a reduced-motion preference starts with motion off) and the persistence and scope of any user setting.
4. Keyboard operation, accessible names and state announcement.

Verification: the control exists, is operable by keyboard, and actually stops the running engine rather than only hiding it. When the decision requires a shared signal, one signal consumed by the animated features is preferred over per-component duplication; do not build it before the decision needs it.

## Performance

General data, rendering and resource rules stay in [performance](performance.md). Additional animation requirements:

- Prefer `transform` and `opacity` where appropriate, without assuming every such animation is cheap: promoted layers cost memory and can still be expensive on large or numerous elements.
- Do not continuously animate properties that force layout or costly paint (`width`, `height`, `top`, `left`, margins, large `box-shadow`/`filter`/`backdrop-filter`) when an alternative exists.
- Do not apply `will-change` permanently or broadly; apply it only around an animation that benefits and remove it afterward.
- No redundant `requestAnimationFrame` loops, scroll listeners or observers. Reuse one mechanism per section where practical; do not create a central registry for this.
- Pause or release work for offscreen sections and hidden tabs (for example with `IntersectionObserver`, library visibility options, or pause APIs) and verify the library actually stops its work.
- Limit simultaneous animations, scroll effects and memory use on mobile and low-capability devices; test with CPU throttling and on representative devices.
- Reserve dimensions for every animated element (explicit size or aspect ratio on canvas, SVG, Lottie containers and pinned sections) to avoid layout shift.
- Measure in production builds and keep four kinds of evidence distinct; none substitutes for another ([performance](performance.md#measurement-and-verification)):
  1. Public Core Web Vitals thresholds: the external reference for "good" (LCP up to 2.5 s, INP up to 200 ms, CLS up to 0.1, assessed at the 75th percentile of real page loads).
  2. Project baseline: a documented production-build measurement taken before the animation (device and network profile, throttling, number of runs). Project budgets derive from it; none is implied by this template.
  3. Measured regressions: before/after deltas against that baseline under the same conditions, over repeated runs, reported with spread rather than a single value.
  4. Real-user (field) data: the only evidence for statements about user experience or threshold compliance. Without it, report field compliance as unverified.
- A single Lighthouse run is a diagnostic and never proof of compliance or of absence of regression. A default page-load lab run does not exercise interactions, so it cannot establish INP; measure interaction-driven animation at the interaction level.
- For each advanced animation, record in the change summary: route JavaScript/CSS/WASM delta using the bundle analysis the installed Next.js version documents; the baseline, the delta and the conditions and number of runs; behavior during the animation (long tasks, frame stability, memory after repeated navigation); and which of the four evidence kinds exist.

## SEO and progressive enhancement

Extends [landing SEO](ui.md#landing-page-seo).

- The semantic main content, headings, links and calls to action are in the generated HTML.
- Animation must not: replace main text with canvas-only content; hide titles or calls to action until JavaScript runs; unexpectedly move important content; prevent reading, navigation or interaction when a dependency fails; or break under reduced motion.
- Heavy decorative assets get a static-image fallback. Storytelling provides a readable sequence that does not depend on the animation.
- Hidden-until-animated initial states are not allowed for critical content (primary heading and copy, calls to action, navigation, LCP candidates). They are acceptable only for decorative elements whose fallback state remains visible without JavaScript.

## Acceptance criteria

A change adding Tier 2-4 animation, or any [browser-dependent animation](#real-browser-validation), passes all of the following before it is reported complete. Other Tier 1 transitions only need the reduced-motion check and the general gates; do not require extensive end-to-end tests for each trivial transition.

| Criterion                                                                            | Verification                                                                                                                                                                               |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Production build succeeds for the selected profile; typecheck, lint, formatting pass | Existing scripts ([README](../README.md)); report actual results                                                                                                                           |
| No relevant hydration errors                                                         | Production run console and Strict Mode component tests                                                                                                                                     |
| Critical content present without JavaScript                                          | Inspect built HTML (extend [smoke checks](../scripts/smoke.mjs) when applicable); real-browser test with JavaScript disabled for browser-dependent animation                               |
| Reduced motion works                                                                 | Component test with a mocked `matchMedia` for branch logic; real-browser `emulateMedia({ reducedMotion: 'reduce' })` for browser-dependent animation                                       |
| Keyboard and touch operation, visible focus, pause controls where WCAG 2.2.2 applies | Motion-controls decision recorded (blocks release when required); component keyboard tests plus manual keyboard/touch check; report unexecuted assistive-technology coverage as unverified |
| Resources released after navigation and unmount                                      | Tests asserting the library teardown ran (`revert`, `destroy`, `cancel`, `disconnect`, listener removal); repeated-navigation check                                                        |
| No duplicate animations or listeners after remount                                   | Strict Mode and explicit unmount/remount tests                                                                                                                                             |
| Fallback when the animated module fails to load                                      | Test with a rejected dynamic import verifying the static fallback                                                                                                                          |
| No unjustified Core Web Vitals regression; bundle cost reviewed                      | Baseline, before/after production measurement and bundle analysis recorded per [performance evidence](#performance); a single Lighthouse run is diagnostic, never proof of compliance      |
| Representative devices and browsers                                                  | Real-device or documented emulation checks; report what was not run                                                                                                                        |

### Real-browser validation

Animation is browser-dependent when its correctness depends on scroll position or scroll-linked state, viewport size or intersection, hydration timing, or a critical interaction (navigation, form, primary call to action, or a control required by [motion controls](#motion-controls)). For such animation, tests in a real browser engine against a production build are required. Mocks (jsdom, mocked `matchMedia`, `IntersectionObserver` or ScrollTrigger) remain valid for unit-level logic and teardown assertions but do not substitute.

As applicable, the real-browser tests assert that: content is visible and no hydration errors occur after load; the animation reaches a readable end state at the relevant scroll positions and viewport sizes, including a mobile viewport with touch; reduced-motion emulation takes the reduced path; a JavaScript-disabled load shows the critical content; pause, stop or disable controls work by keyboard and stop the running animation; and navigating away and back leaves no duplicated animations, pin spacers or listeners.

Playwright is the documented tool and stays out of the template's initial dependencies ([verification](verification.md#verification)); the project adopts it, or another real-browser runner with the same assertions, before publishing such animation. If these tests cannot run, report them as unverified and do not report the change as accepted. They are not required for declarative transitions without these dependencies, and extensive end-to-end suites are not required per trivial transition. Automation does not establish WCAG conformance.

## Pending decisions

- Specific libraries, versions and bundle strategy per project.
- Numeric performance budgets after baselines exist.
- Template-level design of motion controls (pause, stop, hide, disable); a per-project decision is mandatory before publishing animation that needs them.
- Choice of real-browser runner (Playwright is documented) and the device/browser matrix per project.
- Whether any smooth-scroll mechanism is acceptable; none is approved.
- Browser-support baseline for native scroll-driven animation per project.

## References

Reviewed 2026-10-17. Verify against installed versions.

- WCAG 2.2.2 Pause, Stop, Hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- WCAG 2.3.1 Three Flashes or Below Threshold: https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
- WCAG 2.3.3 Animation from Interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- CSS scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
- Core Web Vitals thresholds: https://web.dev/articles/vitals
- Next.js lazy loading: https://nextjs.org/docs/app/guides/lazy-loading
- Motion bundle size: https://motion.dev/docs/react-reduce-bundle-size
- Motion accessibility: https://motion.dev/docs/react-accessibility
- GSAP with React: https://gsap.com/resources/React/
- GSAP accessibility: https://gsap.com/resources/a11y
- GSAP license: https://gsap.com/standard-license
- dotLottie React: https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-react/
- Playwright emulateMedia: https://playwright.dev/docs/api/class-page#page-emulate-media

## Portfolio motion decision (2026-10-17)

Historical initial CSS-entry decision; the later real-portfolio amendment below supersedes the hero-entry and per-section-control details.

The portfolio hero uses Tier 1 only: two finite, transform-only entrance durations (700/950 ms) and hover/focus transitions. Shared values and keyframes live in `src/styles/tokens.css`. Content is visible at every frame, including with JavaScript unavailable. `motion-safe:` gates entries and the document reduced-motion rule disables animation and transitions. No scroll pinning, observers, timers, looping decoration, or additional dependency is required. Numeric evidence is displayed immediately in a Server Component instead of counting through intermediate values. No motion-specific pause control is needed for these sub-second entries; the template motion-control decision remains pending for other animation.

Browser acceptance and performance measurement are tracked in [the portfolio review](portfolio-review.md). Do not treat development-preview inspection as production animation acceptance.

## Career-story adoption and motion controls (2026-10-17)

- Functional need: a multi-stage SVG illustration changes alongside three server-rendered career chapters. Native sticky layout preserves ordinary scrolling; there is no ScrollTrigger pinning or scroll-jacking. Simple entrance/hover effects remain CSS-owned, on different elements/properties.
- Native CSS transitions cannot synchronize this staged sequence with reading progress. Native scroll timelines were considered; no cross-browser support matrix has been accepted. Existing GSAP core, ScrollTrigger and the official React lifecycle integration fit the choreography without installing another library or building a custom scroll engine.
- Installed `@gsap/react` 2.1.2 declares React >=17 and GSAP ^3.12.5 peers, covering installed React 19.3.1 and GSAP 3.15.0. Next 16.4.2 server and export builds are verified separately. Targeted browser checks and remaining limits are recorded in [the review](portfolio-review.md).
- License text reviewed on 2026-10-17: [GSAP Standard License](https://gsap.com/community/standard-license/). This personal portfolio displays animation; it does not provide a visual animation-building product. The license's permitted website use fits this scope. It is not an unrestricted permissive license.
- Maintenance/intake: use existing pinned packages only, no CDN or third-party runtime assets, no new dependency and no player/WASM. The previous production dependency audit reported no known vulnerabilities; that does not establish future security or production performance.
- Loading/isolation: only `career-story.client.tsx` and `education-gallery.client.tsx` import GSAP and ScrollTrigger. The server page/shell/narrative/metrics/project summaries remain server-owned. The reference explorer does not import the career engine. Both CSS entrance and SVG animation are retained because they own independent properties and only the SVG needs a timeline.
- Lifecycle exception: `useGSAP` scopes selectors to one component and uses `revertOnUpdate`. Its returned matchMedia cleanup reverts the active sequence on toggle, live media change, Strict Mode cleanup and unmount. React preference subscriptions remove their listeners. No application-owned scroll listener, frame loop or observer is added. Scoped lifecycle tests exercise disposal, disable/re-enable and live reduced-motion replacement.
- Controls: the shared footer checkbox is keyboard-operable, controls both sequences and persists a local user preference. OS reduced motion always wins and starts static; viewports below 768 CSS pixels also use the readable static illustration and compact chapter flow. There is no continuous/autoplay loop. Disabling tears down the timeline and restores static SVG attributes rather than hiding the region.
- Fallback: narrative text and a complete decorative SVG exist in HTML. No text, link or photo depends on animation progress. Module/runtime-failure and JavaScript-disabled browser scenarios remain explicit acceptance checks, not inferred solely from unit tests.
- Performance: SVG transforms/opacity and four short dashed paths are the only changing properties; the small path paint is deliberate, while layout remains native. Route bundle footprint is recorded in the review; full baseline/delta CWV, frame and memory measurements remain pending. Do not report field compliance or full animation-policy acceptance from a single browser run.

## Vertical-to-horizontal education gallery amendment (2026-10-17)

The user explicitly requested horizontal photo movement driven by downward page scrolling. `education-gallery.client.tsx` therefore adopts a bounded ScrollTrigger pin with automatic spacing and a scrubbed transform on one inner track. The start is below the sticky header; photo height is bounded by the viewport, images reserve their dimensions, and `invalidateOnRefresh` recalculates the horizontal distance. The document keeps native wheel, touch, keyboard and anchor behavior. This is a pinned visual sequence, not a smooth-scroll replacement or wheel interception mechanism.

The gallery consumes shared motion preferences through `src/lib/reduced-motion.client.ts`. The unobtrusive footer accessibility checkbox controls both sequences; no technical enable/disable buttons appear inside sections. Reduced motion always starts/keeps manual mode. Disabling reverts the tween, overflow styles and pin spacer; native horizontal scrolling and keyboard-focusable previous/next controls remain. Without JavaScript the native region is readable and scrollable. Previous/next in animated mode move native page scroll to the relevant chapter position; in manual mode they move the native horizontal viewport immediately. No timed autoplay is present.

This is a second documented `useGSAP` lifecycle exception: CSS transitions cannot coordinate the requested pin and vertical reading progress across the unselected scroll-timeline browser matrix. The official integration owns teardown and replacement with `revertOnUpdate`. Scoped tests keep real GSAP context/style restoration under Strict Mode; production checks verify actual translation and pin removal. Both feature engines share the existing GSAP bundle and use independent scoped targets; neither competes with CSS on an animated property.

## Real-portfolio motion UI amendment (2026-10-17)

This is the user's actual portfolio, not a template demonstration. Per-section animation/debug controls were removed at the user's request. A single unobtrusive footer checkbox, “Reduce motion” / “Reducir movimiento”, is the accessibility mechanism for both scroll sequences. The explicit user preference persists under `portfolio-reduced-motion`; if browser storage rejects writes, the session preference still works. OS reduced motion always wins and cannot be overridden by this control. The server snapshot is static/reduced until hydration determines the preference. Subscriptions release media/storage/custom-event listeners on disposal.

Checking the footer option reverts the career timeline and gallery tween/pin/overflow styles. The static illustration, all text and native horizontally scrollable photos remain. Unchecking it restores the effects only when the OS permits. The choice is not presented as a demo control. Hero entry movement and hover translation were removed so a persisted reduced-motion choice does not leave separate CSS movement running. Color/focus feedback remains native CSS. Meaningful regression tests cover shared teardown, preference replacement and storage rejection.
