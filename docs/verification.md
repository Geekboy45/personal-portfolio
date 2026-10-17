# Verification and security

Read when choosing or executing checks, or changing security-sensitive behavior.

These are accepted project rules, except items explicitly marked pending. Start with [AGENTS.md](../AGENTS.md) for the shared constraints and task routing.

## Verification

- Use TypeScript with strict checking.
- Provide automated validation and a test suite for meaningful scenarios. Use the pinned Vitest, Testing Library and MSW suite; meaningful regression scenarios live beside their owners.
- Start with automated checks. Preserve a documented path for adding Playwright flow tests later; do not install or require Playwright by default. Advanced animation that depends on scroll, viewport, hydration or critical interaction requires real-browser tests that mocks cannot replace ([real-browser validation](animations.md#real-browser-validation)); a project adopts Playwright, or an equivalent runner, for that case, while the template itself still does not install it.
- Include applicable [accessibility verification](ui.md#accessibility) against the WCAG 2.2 AA reference target. Keep automated results distinct from keyboard/assistive-technology coverage; report unexecuted checks and never infer full conformance from automation.

### Security checks and secure implementation

- Include automated SAST for TypeScript/JavaScript and applicable workflow/configuration code in the verification pipeline, alongside dependency vulnerability analysis (SCA) and secret scanning. These are different checks; lint/type checks or a dependency audit alone do not constitute SAST. Tool selection, rule set, and runner integration remain pending, but the requirement is approved and must be implemented before claiming the template's security validation is ready.
- Once configured, CI must run the selected checks on changes, retain actionable results, and block release/integration on new unresolved high/critical security findings under the selected tool's documented severity mapping. Analyzer failure must not be reported as a clean scan. Review false positives/suppressions explicitly with a narrow scope, reason, owner, and review date; do not silence a rule globally or introduce unexplained baselines to obtain a passing result.
- Cover dangerous JS/DOM execution and data-to-code sinks: eval/new Function, untrusted innerHTML/outerHTML/insertAdjacentHTML, dangerouslySetInnerHTML, unsafe script/JSON-LD serialization, and unvalidated navigation/resource URLs. Prefer React text rendering and context-appropriate encoding; do not manually concatenate untrusted HTML or claim that input validation alone prevents XSS. If rendering external rich HTML is required, introduce a reviewed maintained sanitizer and an explicit allowed-content policy, never a regex sanitizer. Keep any sanitizer configuration centrally owned by that integration.
- Validate URL protocols and destinations according to their context; prevent javascript: navigation and unsafe redirect targets. Server-side fetch/proxy/file integrations must restrict destinations and review SSRF/redirect behavior rather than accepting arbitrary client-supplied URLs. Keep uploaded/remote content untrusted even if the frontend checked its extension or MIME type.
- Define and verify relevant browser security headers, including a deliberate Content Security Policy where applicable. Account for Next.js hydration/scripts and the selected deployment profile; static hosts own static response headers, while per-request nonces require an actual server strategy. Do not weaken CSP broadly to make an integration work, and do not present CSP as a replacement for safe rendering/sanitization.
- Evaluate CSRF protection for cookie-authenticated state changes and server integration endpoints; JWT terminology alone does not determine CSRF exposure. Validate authentication/authorization at the responsible server boundary. CORS is neither authorization nor CSRF protection by itself. Keep secrets out of NEXT_PUBLIC values, generated assets, logs, and source-map publication, following the existing privacy rules.
- Add targeted automated security regression scenarios at real data-to-render/URL boundaries: malicious HTML must remain inert in text, allowed rich HTML must be sanitized, unsafe URLs must be rejected, and serialized script-breaking content must remain data. Include API errors and imported/external content, not only form inputs. Tests must exercise the actual consumer boundary; do not infer XSS safety from a regex search or sanitizer unit test alone.
- Include the approved cross-user/tenant cache-isolation cases in security verification. Add authorization failure, private-data exposure, redirect, and file-validation scenarios when those capabilities exist. The backend remains responsible for its own injection/authorization testing; do not label a frontend scan as a backend security audit.
- Start with SAST/SCA/secret checks and applicable unit/component/integration tests. Record actual coverage limits. Browser execution/DOM-XSS and broader dynamic testing can be expanded with Playwright or appropriate authorized tooling later; static analysis and passing tests do not prove absence of vulnerabilities. Do not run penetration scans against external systems without authorization.

Security references (reviewed 2026-10-16):

- https://owasp.org/www-community/Source_Code_Analysis_Tools
- https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

## Regression gates

- Both server and static build/smoke checks, independent strict typecheck, lint and formatting are gates even for visual changes. Do not weaken checks or update expected output to hide a regression.
- Exercise corrupt/expired browser drafts, rejected storage writes, actual resource identity, alternate-form species references, truncated catalogs, simultaneous toast timers and keyboard tab/dialog behavior. Side-effect regressions run under Strict Mode.
- Report actual executed checks. Local automated coverage does not establish real-device, assistive-technology, Docker, SAST or secret-scan results. Dedicated SAST and secret scanning remain unimplemented and must be selected before security readiness is claimed.
