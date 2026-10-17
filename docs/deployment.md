# Deployment profiles

Read when selecting a deployment profile or changing builds, runtime configuration, or delivery.

These are accepted project rules, except items explicitly marked pending. Start with [AGENTS.md](../AGENTS.md) for the shared constraints and task routing.

## Deployment

- Profile selection is mandatory before project implementation. Record DEPLOYMENT_PROFILE as exactly server or static in the project's documented build configuration and README, alongside its reason, rendering/data-fetching strategy, and server/client boundaries. CI and next.config.ts must use the same explicit selection; fail validation for a missing/unknown value rather than silently falling back or inspecting a hostname. The template's current architecture-definition stage does not itself select a profile for a future project.
- Keep profile selection separate from development/production environment selection: deployment-dev.yml and deployment-prd.yml use the project's same selected profile. A profile change is an architectural change requiring a compatibility review, not merely a different deployment destination.
- Provide GitHub Actions workflows named deployment-dev.yml and deployment-prd.yml under .github/workflows when deployment is implemented.
- Cover static artifact deployment and include a Dockerfile for projects that require a Next.js server.
- Keep deployment provider-neutral: define a static artifact profile and a portable container profile for a Next.js server. Do not depend on a vendor's functions, serverless APIs, App Service configuration, or named container service in the base template. A managed container platform can consume the container artifact through a project-specific deployment integration.
- Workflows must separate validation/build artifact creation from the target-specific publication step. Keep credentials, registry/hosting destinations, and environment identifiers external to application code. Do not insert a fictitious successful deployment step while no deployment target exists.
- Container execution must document the startup command, port, configuration/secrets, health checks, shutdown, and any runtime cache/write needs when implemented. Static assets do not require a server container. Never bake runtime secrets into the image or public frontend bundle.
- Hosting targets, workflow triggers, environment configuration, and release/promotion policies remain pending. Do not invent deployment credentials or publish infrastructure while these are undefined.

### Profile capabilities

| Capability                                              | server                                                  | static                                                            |
| ------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| Build output                                            | Portable Node.js server container; output: 'standalone' | output: 'export'; publish out/                                    |
| Server Components                                       | Build time or request time as designed                  | Build time only                                                   |
| Request-time rendering and server cookies/headers       | Available when needed                                   | Unavailable                                                       |
| Server Actions, Proxy, request-dependent Route Handlers | Available subject to frontend-only scope and security   | Unavailable at runtime                                            |
| API calls after deployment                              | Server or browser according to the integration          | Browser to external APIs                                          |
| Image optimization                                      | Runtime optimizer or compatible external strategy       | External loader or preoptimized/unoptimized assets                |
| Incremental Static Regeneration                         | Available when explicitly designed                      | Unavailable; rebuild to update generated content                  |
| Hosting rules such as redirects/security headers        | Configure appropriate server/ingress behavior           | Configure the static host; no Next.js request-time implementation |

- Availability is not a requirement to use a capability. The server profile still delegates business logic and persistence to the external backend. Server Actions/Route Handlers are optional frontend integration boundaries, not authorization to add a business backend.
- Static export can remain interactive and call external APIs; it is not restricted to noninteractive HTML. Browser authentication must be compatible with the selected integration, and cannot rely on a Next.js runtime session endpoint. Never embed user-specific/private fetched data in exported HTML, payloads, or static JSON.
- In static mode, pre-enumerate exported dynamic paths with generateStaticParams as required by Next.js. A build-generated GET Route Handler may emit a static file, but it must not be described as a live endpoint. Browser APIs still require browser-safe access because client code can be prerendered during the build.
- Build-time credentials must remain confined to the build process and must never leak through generated artifacts. Public API origins and other public values embedded in browser assets need per-environment builds unless an explicit safe runtime-public-configuration mechanism exists. A server container does not make browser-bundled variables runtime-configurable automatically.
- Do not bypass export restrictions by hiding dynamic imports or pretending a static-host rewrite creates Next.js server capabilities. If a required feature conflicts with the selected profile, report it and resolve the profile/feature decision before implementing that feature.

### Required profile checks when implemented

- Both profiles: validate explicit profile selection and configuration, run formatting/lint/type checks and applicable automated tests, and perform a real production build. CI must fail on a failed prerequisite instead of continuing to publish. next dev alone is not deployment verification.
- static: build with output: 'export'; verify the expected out/ HTML/assets and enumerate required routes. Serve the artifact with a static-only server (no Next.js runtime), then check a direct nested URL load, refresh, an unknown URL/404, asset/image paths, and external API configuration where applicable. Validate the route/extension/trailing-slash assumptions of the target host. Check forbidden request-time dependencies through config/code validation plus the actual export build; text search alone is insufficient.
- server: build the standalone output and the container image. Include public and .next/static in the runtime image when used; standalone output does not copy them automatically. Start the built image and verify startup, health response, representative routes/static assets, and graceful shutdown; verify runtime configuration and request-time features only where implemented. Do not substitute a development server for this check.
- Keep these checks scriptable for CI without requiring Playwright initially. Browser interaction/flow tests can be added later under the existing testing policy. Do not claim a smoke check proves authentication or full user-flow correctness.
- Maintain minimal profile fixtures/examples so template-level changes to shared configuration can build and smoke-test both modes. Verify fixtures independently, without reusing stale output from the other profile. Derived projects do not need to implement both application variants.

Deployment references (check against the pinned version):

- https://nextjs.org/docs/app/guides/static-exports
- https://nextjs.org/docs/app/guides/self-hosting
- https://nextjs.org/docs/app/api-reference/config/next-config-js/output

## Metadata export verification

- Metadata route handlers intended for export (including sitemap and robots) explicitly declare build-time generation using the installed Next version's supported configuration. Verify a real static build, not only a server build that happens to prerender routes.
- Run build then smoke for each profile sequentially; do not test stale output from the other profile. Smoke checks must include metadata routes as well as HTML, assets, noindex policy and 404 handling.
