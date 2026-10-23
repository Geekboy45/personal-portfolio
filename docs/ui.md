# UI, accessibility, and landing SEO

Read the applicable sections when changing components, tokens, responsive behavior, or public metadata.

These are accepted project rules, except items explicitly marked pending. Start with [AGENTS.md](../AGENTS.md) for the shared constraints and task routing.

## UI and device support

- Use Tailwind CSS with the design-system ownership and naming rules below. The reference uses pinned Tailwind and Radix Dialog with replaceable demo tokens; project branding and theme selection remain project decisions.
- Define device support per project. Support responsive layouts and appropriate input methods where required; distinguish web mobile support from optional PWA/offline/native capabilities.
- Balance shared components with device-specific interactions without duplicating whole pages by default.

### Accessibility

- Use WCAG 2.2 AA as the reference target for components and pages. Apply relevant criteria and record remaining gaps; do not claim conformance from an automated score.
- Prefer semantic HTML and native controls. Verify accessible names, labels and descriptions, keyboard operation, visible focus, focus order/restoration, and announced validation/status messages where applicable.
- Check contrast across supported themes/states, zoom/reflow, target size, and accessible alternatives to dragging where applicable. Respect reduced-motion preferences and avoid conveying meaning through color alone.
- Include appropriate automated accessibility checks in component/page validation. Complement them with keyboard, focus, and relevant assistive-technology checks; tools do not cover every criterion. Until those checks run, report that coverage as unverified. This does not change the existing decision to leave Playwright optional.
- Prefer maintained accessible primitives for complex interactions such as dialogs, menus, or comboboxes when needed; verify the assembled behavior. Radix Dialog is selected; broader accessibility-analysis tooling remains pending. Reuse the agreed tokens and styling owners.

Reference: [W3C WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

### Motion and animation

- Animation defaults to CSS transitions/animations, Tailwind `motion-safe:`/`motion-reduce:` variants and the Web Animations API. Motion, GSAP + ScrollTrigger and dotLottie are optional approved tiers under the [animation policy](animations.md), which owns tier selection, dependency intake, reduced-motion and pause-control requirements, no-JavaScript fallbacks, and acceptance criteria.
- Global motion values (shared durations, easings, distances) come from the motion scales in `src/styles/tokens.css`; choreography-specific parameters may live beside their animation as defined in the [animation policy](animations.md#selection-hierarchy), without a duplicate global table in TSX. Feature-specific animation lives in its feature; `src/components/ui` primitives stay free of feature animations.
- Respecting reduced motion is mandatory and additional to WCAG 2.2 AA; it is not proof of conformance.

### Design-system configuration and AI handoff

- src/styles/tokens.css is the canonical editable source for design values: color roles, typography, spacing scales, radii, shadows, and motion scales when provided. It owns semantic CSS variables, optional primitive palette values, and scoped theme overrides. Keep source values and their Tailwind theme bindings here using the syntax supported by the selected Tailwind version; do not create a second independently maintained token configuration in TypeScript, JSON, or component styles.
- src/app/globals.css imports Tailwind and tokens.css once, in the required order for the installed version. It owns only shared base/document styles that are actually needed. The root layout imports globals.css; components must not import the global stylesheet again. Do not use globals.css as an accumulating collection of feature selectors or component recipes.
- When an AI receives a design system, first inspect existing tokens and UI primitives, map each supplied value to its semantic role, and edit tokens.css rather than embedding values in consuming components. Record unclear mappings or missing required values instead of silently guessing a brand's palette, contrast partner, or theme. Do not overwrite unrelated tokens.
- Within tokens.css, group and comment values by role (surfaces/text, actions/status, typography, spacing, shape/elevation, motion) and theme. If primitive palette values are needed, define each once and reference them from semantic roles. Components consume semantic roles instead of primitive palette names.
- Use the following semantic mapping as the integration reference. These are role examples, not approved brand values or an obligation to create every token before use:

| Supplied design value              | Canonical role                                   | Expected utility when bound in Tailwind  |
| ---------------------------------- | ------------------------------------------------ | ---------------------------------------- |
| Page background                    | --color-surface                                  | bg-surface                               |
| Main text                          | --color-foreground                               | text-foreground                          |
| Card/panel background              | --color-surface-raised                           | bg-surface-raised                        |
| Secondary text                     | --color-muted-foreground                         | text-muted-foreground                    |
| Primary action background          | --color-primary                                  | bg-primary                               |
| Text on primary action             | --color-primary-foreground                       | text-primary-foreground                  |
| Primary hover background           | --color-primary-hover                            | hover:bg-primary-hover                   |
| Secondary action background/text   | --color-secondary / --color-secondary-foreground | bg-secondary / text-secondary-foreground |
| Destructive action background/text | --color-danger / --color-danger-foreground       | bg-danger / text-danger-foreground       |
| Validation text                    | --color-error-foreground                         | text-error-foreground                    |
| Standard border                    | --color-border                                   | border-border                            |
| Keyboard focus indicator           | --color-focus                                    | focus-visible:ring-focus                 |
| Brand body font                    | --font-sans                                      | font-sans                                |
| Control corner radius              | --radius-control                                 | rounded-control                          |

- Add documented semantic roles when required, including hover/active/disabled states or other statuses. Do not assume a destructive button color is readable as small error text. Check foreground/background and focus contrast for each supported state/theme. Use spacing utilities from the agreed scale and document intentional exceptions.
- Theme differences override semantic variables in tokens.css under the chosen theme selector; do not duplicate each component's CSS or styling recipe for each brand/theme. Initial theme delivery and persistence must be designed before introducing a client theme provider. A provider is not required just to use CSS tokens.
- Use complete, statically detectable Tailwind classes in variant maps; do not build class names such as bg-${color}-500. If a shared UI package is later adopted, configure its CSS/class detection and versioned tokens explicitly instead of maintaining a local competing design system.

### Style ownership and duplication prevention

- UI primitives own their reusable appearance, interaction states, and typed visual variants in src/components/ui. Feature components compose them and own page/feature layout; they must not copy the primitive's background, typography, border, focus, and state recipe into each caller.
- Before adding styles, search for an existing token, primitive, or variant. Change the existing owner when appropriate. Extract a coherent repeated appearance into a reusable component/variant rather than copying classes to another screen. Repeating simple layout utilities such as flex or gap is acceptable and does not justify a generic wrapper by itself.
- Do not put brand hex/rgb/oklch values, duplicate palette declarations, or arbitrary per-screen theme overrides in TSX or component CSS. Dynamic runtime measurements may use inline styles or CSS variables when necessary; they must not become another source of design tokens.
- Do not create a CSS/CSS Module file per component by convention, use per-component style tags, or duplicate Tailwind utilities through @apply recipes. Custom CSS is allowed only for a concrete requirement not expressed adequately by the chosen utility system (for example, a third-party widget); scope it, colocate it with its owner, consume existing tokens, and keep one implementation of the rule. Never solve a styling conflict through escalating !important overrides.
- Prefer documented component variants over ad hoc className overrides of visual identity. A className extension may handle placement/layout; necessary appearance extensions belong in the primitive's variant API. Avoid boolean combinations that can request contradictory styles.

### Component names and variants

- Name reusable components by their UI role; name feature components by domain and purpose. Use PascalCase symbols and matching kebab-case filenames, preserving the explicit .client.tsx entry-boundary convention where applicable. Names must not encode a transient color, device size, or visual redesign generation.
- A visual variation of the same behavior is a typed prop on the same component, not a new component/file for each appearance. Keep independent dimensions separate: variant, size, and pending/disabled state. Button HTML type (button/submit/reset) is a separate semantic prop, not a visual variant.

| Need                                                  | Component/file convention                                                 | Example usage or distinction                                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Same button with different appearance                 | Button in button.tsx                                                      | <Button variant="primary" size="md">Save</Button>; variant="secondary", "outline", "ghost", or "danger" when required |
| Same button at different sizes                        | Same Button                                                               | size="sm", "md", or "lg"; no SmallButton file                                                                         |
| Same button while submitting                          | Same Button                                                               | pending/disabled state; no LoadingButton copy                                                                         |
| Icon-only button with distinct accessibility contract | IconButton in icon-button.tsx, when warranted                             | Require an accessible name; reuse the button styling owner rather than copying it                                     |
| Navigation styled as a button                         | LinkButton in link-button.tsx, when warranted                             | Preserve link semantics; share the button appearance, not a click handler that imitates a link                        |
| Stateful on/off control                               | ToggleButton in toggle-button.client.tsx, when warranted                  | Different interaction/pressed semantics, not merely another color                                                     |
| Domain action with confirmation/API coordination      | DeleteProjectButton in features/projects/delete-project-button.client.tsx | Compose shared Button/Dialog; feature owns behavior and calls                                                         |
| Domain display                                        | ProjectCard in features/projects/project-card.tsx                         | Compose shared visual primitives; keep project-specific logic local                                                   |

- Avoid names such as BlueButton, Button2, NewButton, MobileButton, or PrimaryButton/SecondaryButton files that only duplicate visual variants. A feature action component is justified by meaningful behavior/reuse, not just by changing a label or variant.
- These examples do not require generating all listed components or choosing a variant helper library. Use a small typed variant map initially; if sharing styling across semantic controls requires a sibling recipe file (for example, button.variants.ts), introduce it only when that responsibility exists.

## Landing-page SEO

- Apply this convention to public landing/marketing pages. Do not automatically make platform routes indexable. The actual public domain, brand/content, supported locales, and publication/indexing intent must be provided per project; do not invent them.
- Keep shared site identity and validated public SEO configuration in src/lib/site-config.ts when implemented: production canonical origin, site name, default description/social image, language, and explicit indexing policy. This module contains no credentials. Route-specific metadata stays with its route; do not create a central registry requiring edits for every page.
- Use Next.js Metadata APIs rather than manual head tags, client-side document.title updates, or a new SEO dependency. Root layout owns metadataBase, shared defaults/title template, and the correct html lang. Each indexable page owns its descriptive title, description, and self-canonical path. Use static metadata for fixed content and generateMetadata only when data-dependent; keep the metadata-owning page/layout a Server Component.
- Resolve canonical URLs against the configured production origin, not the incoming Host header or a preview URL. Standardize host, protocol, path/trailing-slash policy and remove tracking parameters from canonicals. Preserve parameters representing distinct indexable content when intentionally designed; canonical is a hint, not a substitute for an appropriate redirect. Reject missing/placeholder production origins before a public production release.
- Indexing is explicit per environment. Development/preview/staging deployments must emit noindex and should restrict access when confidentiality matters. Production landing pages emit indexable metadata only when approved for publication. Verify the served production response does not inherit preview noindex. Static metadata is baked into the artifact: promotion requires compatible public configuration or a rebuild; never assume a runtime toggle changes exported HTML.
- robots.txt controls crawling, not privacy or reliable exclusion from indexing. Do not treat Disallow as a substitute for authentication or noindex, and do not block a crawler from reading a noindex page when relying on that directive. Do not expose private URL inventories through robots or sitemaps.
- Use one implementation of each metadata artifact: src/app/robots.ts (or robots.txt), src/app/sitemap.ts (or sitemap.xml), favicon/icon, and opengraph-image/twitter-image conventions where appropriate. Do not duplicate route handlers, public files, and metadata exports for the same URL. Generated artifacts in static mode must be computable at build time; verify compatibility against the installed version.
- Sitemaps list only canonical, public, indexable, successful routes with absolute URLs. Exclude previews, tracking variants, private pages, redirects, and missing resources. Use lastModified only when a meaningful content change date is known; do not invent freshness on every build. Keep route discovery aligned with actual exported/published paths.
- Supply Open Graph and social-card metadata with accurate title/description, URL, and an accessible image URL. Configure image dimensions/alt text where supported; prefer static social assets for simple landings. Do not generate arbitrary brand artwork or promise social cards improve search ranking. Check inherited metadata so route overrides do not drop intended shared fields.
- Important landing content must be available in prerendered/server-produced HTML rather than requiring a click, animation completion, or a browser-only API request. Use semantic main/nav/header/footer structure, a descriptive main heading as the project convention, logical section headings, descriptive link text, real navigation links, and existing image accessibility/performance rules. Keep responsive versions consistent in meaning and content.
- Add JSON-LD only for an applicable documented schema that accurately describes visible/verifiable content. Do not fabricate ratings, reviews, prices, FAQ eligibility, or business details. Escape untrusted serialized values safely (including '<') before embedding scripts. Validate structured data with the relevant tools; do not promise rich-result eligibility or display.
- For multilingual landings, explicitly configure translated routes, html language, localized metadata, and reciprocal language alternates/hreflang (including x-default when appropriate) together. Do not emit alternate URLs for translations that do not exist. This does not select an internationalization library.
- Keep missing pages as real HTTP 404s; use appropriate permanent redirects for deliberately moved URLs. For static output, document/configure these behaviors at the host without assuming Next.js runtime support. Avoid returning a generic HTTP 200 landing for every unknown URL.
- When implementation exists, automate production-artifact checks for unique/descriptive route metadata, absolute canonicals, robots/indexing policy, sitemap consistency, social-image availability, main content/headings, and correct missing-route status. Run against exported files/static hosting for static, and real production responses for server; account for supported streamed metadata instead of relying on a simplistic head-only text search. Use Lighthouse for diagnostics rather than claiming that a score proves rankings or indexing. Search Console submission/verification is a project release task requiring actual site access, not a fabricated template result.
- Do not impose arbitrary title/description character limits, keyword-density targets, hidden keyword blocks, or a meta-keywords field as universal SEO requirements. Write useful, accurate content and evaluate performance with the existing measurement policy.

SEO references (reviewed 2026-10-16):

- https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/crawling-indexing/robots/intro
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

## Enforced component contracts

- Styling props must not implicitly remove headings, descriptions, focus behavior or dismissal. Use typed visual dimensions (such as Dialog size) without changing accessibility semantics. Dialogs retain a visible close action during loading, success and failure, alongside Escape/focus restoration.
- Tabs with tablist/tab/tabpanel roles implement roving focus, ArrowLeft/ArrowRight wrapping, Home/End, selected state and stable instance-unique relationships. Keep inactive panels hidden and provide a focusable active panel when its content needs it. Keyboard tests exercise the assembled widget.
- Shared primitives contain no demo brand names, feature-specific animations or duplicate implementations for standalone/provider use. Feature-specific colors are semantic domain tokens in tokens.css; TypeScript may map domain names to CSS variables but may not own palette values.
- Regression checks cover the actual error text, destructive action, muted text and focus contrast pairs. These checks do not certify every theme/state or WCAG conformance. Preserve a visible focus indicator on all interactive controls.
- Partial translations must not relabel the entire document. Persisted language preferences use useSyncExternalStore with an SSR snapshot and subscription cleanup instead of a hydration setState effect. Full multilingual SEO remains a separate project decision.

## Portfolio content and locale decision (2026-10-17)

Local editorial content in `src/data` is permitted: bilingual profile, career, education and public work summaries are frontend presentation data, not backend persistence or authoritative business rules. Keep English identifiers, typed locale fields, direct imports and one owning source. Feature-specific content may move beside its feature if this improves navigation; the illustrative folder layout is not a ban on local content modules. Never put credentials or implementation-confidential information in a public data module or asset.

The portfolio uses two static routes, `/` (English) and `/es/` (Spanish), with separate root layouts and one shared server shell/composition. Each root renders the correct `html lang`, localized content and metadata. Language controls are real links and work without JavaScript. A stored demo preference cannot override the route. Cross-root navigation intentionally reloads the document. Canonical/reciprocal language alternates are emitted only with an explicit production origin; no indexing activation is implied. The reference `/explore/` remains an English demo, not an advertised translated portfolio page.

Education uses a vertical-scroll-driven horizontal gallery with three large landscape slots. Its scoped ScrollTrigger pins only the gallery, reserves the required vertical spacing, translates the photo track and then releases normal document flow. No wheel/touch interception or custom scroll engine is used. The shared footer accessibility checkbox and OS reduced motion restore native manual overflow; previous/next controls work in both modes. Without JavaScript the labeled, focusable native scroll region remains usable and unhydrated buttons are disabled. There is no timer/autoplay. Empty slots are explicitly pending; replacement paths and accurate bilingual alt text belong to `src/data/education-gallery.ts`.
