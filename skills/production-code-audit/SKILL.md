---
name: production-code-audit
description: Independently audit, fix, and verify any AI-generated or human-written software for production readiness. Use for whole-repository audits, feature completeness, fake or hardcoded production behavior, real integration, data authority, business logic, security, performance, reliability, regression testing and release decisions across web, mobile, desktop, backend, games, AI agents, CLI tools, libraries and infrastructure.
---

# Production Code Audit v2.0

Act as an independent senior software architect, domain engineer, QA lead, security reviewer and reliability engineer. Prove that the implementation satisfies its real requirements, not merely that it builds, looks complete, or was claimed complete by an AI agent. This skill is language-, framework-, and architecture-neutral. Read the applicable sections in [project profiles](references/project-profiles.md) and the [release policy](references/release-policy.md).

## Scope and operating modes

- AUDIT_ONLY (default): inspect, run safe local tests, write audit artifacts; no application code changes.
- AUDIT_FIX_VERIFY: fix evidenced defects when explicitly authorized, add regression tests, and independently reverify.
- RELEASE_VERIFY: assess a pinned release candidate, no implementation changes or deployment.
- Scope: whole repository by default; feature/diff audit when requested, including impacted callers, integrations and regression paths. Do not present a partial audit as a full audit.
- Respect repository instructions, existing architecture and product boundaries. Preserve unrelated edits. Discover related repositories and external services; do not invent their contents.
- Use existing package manager, lockfiles, frameworks and safe local/test services. Do not push, deploy, trigger remote CI, use paid APIs, modify live data, or run destructive tests without explicit authorization. Do not install unapproved infrastructure or rewrite the project to satisfy this skill. Read-only access to a dependency is not evidence that it works.
- Offline-first, client-only, embedded, libraries and prototypes can be valid products. Judge them against the agreed target, not an assumed client/server architecture. Never call a prototype production-ready for an unimplemented product.

## Non-negotiable evidence policy

1. Never invent files, symbols, dependencies, requirements, API endpoints, schemas, test results, logs, metrics, screenshots or citations.
2. Pin the inspected revision, dirty state and relevant environment. Every material claim must reference actual file:line/symbol, reproducible command or observed runtime artifact. Static inspection proves only what can be established statically.
3. Establish expected outcomes independently from approved specs, contracts, authoritative standards, invariants or user decisions. Implementation comments and prior AI summaries are hypotheses, not independent acceptance criteria. Record ambiguity or missing requirements; do not silently invent business rules.
4. A successful build, HTTP 200, green unit suite, rendered screen, connected socket or job submission is not proof of end-to-end behavior. Verify effects, persistence and downstream results. Inspect test counts, skips, assertions, environment and actual dependencies. Mocks, simulations and real integrations must be labeled separately.
5. Record exact commands, tool/runtime versions, test inputs, expected and observed outputs, timestamps, exit status, artifacts and limitations. Redact secrets and personal data. Never generate fake evidence or fill missing logs.
6. Never weaken tests, change expected values to fit bugs, add fake fallback data, suppress errors, skip failures or manipulate quality scores to pass. Critical tests need negative cases and, where safe, a controlled fault or failing-before/passing-after regression to demonstrate sensitivity.
7. Verify the actual output: files open, exports contain correct data, rendered screens are usable, messages arrive, jobs finish, transactions persist, and error paths behave correctly as applicable.
8. Report actual scope, uncertainty and blockers. Do not claim zero bugs, guaranteed security or certification. A requirement that cannot be verified is NOT_VERIFIED, not a pass.

Use only these statuses: VERIFIED_PASS, VERIFIED_FAIL, PARTIALLY_VERIFIED, NOT_VERIFIED, NOT_IMPLEMENTED, NOT_APPLICABLE. A required missing capability is NOT_IMPLEMENTED; N/A requires written justification.

## 1. Discover and establish baseline

- Read repository instructions, specs, ADRs, requirements, acceptance criteria, manifests, lockfiles, entry points, build/test commands, environment schemas and deployment configuration. Record Git revision, dirty changes, tooling and environment without exposing secrets.
- Identify deliverable type(s), users, roles, product boundaries, production vs demo/test modes, data stores, external dependencies and high-risk workflows. Select relevant profiles; combine profiles for full-stack projects.
- Inventory routes/screens, APIs, jobs, event handlers, CLI commands, IPC, storage, modules and public interfaces. Trace each critical path from input through validation, authorization, business logic, external dependencies, state changes and final output. Identify orphaned UI, unreachable implementations and missing integration.
- Create a requirements matrix before judging results. For each requirement record source, expected outcome, criticality, applicable environment, verification method and status. Record conflicting specs and proposed acceptance criteria separately.
- Run discovered baseline build, type checks, lint and tests when available; record real failures, skips and missing tooling. Do not invent commands or treat absence of tests as success.

## 2. Detect fake, incomplete and hardcoded production behavior

Search all relevant reachable code, runtime configuration and production artifacts for mock/demo/fixture imports, TODO/FIXME, stubs, empty handlers, unconditional success, timers pretending to be real operations, fake users/metrics/balances/results, hardcoded credentials or endpoints, disabled validation, random fake outcomes, fake AI responses, swallowed errors, fallback-to-success, placeholder UI, inaccessible routes and undocumented feature flags.

Trace each suspect from origin to runtime consumer and production build path, including error and offline branches. Search hits are leads, not automatic defects. Classify:
- legitimate constants, standards or intentional configurable defaults;
- properly isolated dev/test fixtures;
- legitimate cache, preferences, presentation state, local-first authority or deterministic simulation;
- deliberately labeled demo/offline functionality;
- actual production defect, deception, missing integration or security risk.

Do not blindly move all constants into config, prohibit local storage, remove valid defaults or ban mocks in tests. Verify environment separation, configuration validation and production behavior when services fail. A simulated feature must never silently impersonate a live feature.

## 3. Verify functional and domain correctness

- Validate critical journeys end to end, including happy paths, invalid inputs, boundaries, empty data, cancellation, timeouts, duplicates, retries, ordering, concurrency, state transitions, partial failure and recovery where relevant.
- Test domain-specific invariants independently: calculations, precision, timezone/locale, lifecycle, limits, authorization, state-machine legality, idempotency and cross-component contracts. Use seeded/reproducible inputs and independent expected values.
- Exercise real integration across actual required components in a safe environment. Verify final persisted effects or produced artifacts independently; do not infer completion from UI success messages or accepted jobs.
- Test real user interactions and output quality when applicable: browser/device, keyboard/touch, accessibility, visual correctness, loading/error states and supported platforms. Capture actual screenshots or videos where appropriate; never infer UX from code alone.
- Where external systems are inaccessible, verify the contract locally but mark end-to-end behavior NOT_VERIFIED.

## 4. Verify data ownership and integrity

Build a matrix: data/entity, authoritative owner, client/cache copy, validation, persistence, lifecycle, access controls, versioning, recovery and abuse risk.

- Verify the correct source of truth for the architecture; server authority for shared sensitive online state, local authority for explicitly local-first products, documented conflict resolution for sync.
- Trace reads and writes from input to storage and back. Verify real persistence, restart/reload, transaction boundaries, consistency, uniqueness, duplicate protection, stale-cache handling, isolation, migration safety and backup/restore where applicable.
- Verify money/credits/entitlements, permissions and other sensitive business state cannot be forged by untrusted callers. Do not impose remote storage on local-only apps.
- Verify secrets, sensitive data retention/deletion and storage/access policies; no credentials in reports, logs or bundled clients. Distinguish preferences and caches from authoritative state.

## 5. Security and abuse resistance

Use authorized local/staging fixtures. Verify applicable authentication, authorization at the resource/action/tenant level, validation, injection risks, SSRF, unsafe deserialization, path traversal, file handling, secret management, dependency risks, session expiry, replay, rate limits, least privilege, sandbox/IPC/tool permissions, logging redaction and race conditions.

Exercise negative cases with separate roles/identities. Test that untrusted client inputs, modified state, forged identifiers or malicious document/tool output cannot bypass policy. For AI products check prompt injection, data leakage, tool approval and untrusted output handling. Document threat model, affected boundary and evidence. Do not perform destructive or unauthorized live testing.

## 6. Performance, stability and maintainability

- Measure applicable latency (including tails), throughput, frame times, CPU/GPU/RAM, network, query cost, startup, artifact size, resource cleanup and sustained workloads. Record actual hardware, versions, dataset, sample count, load and duration. Compare with agreed budgets; propose missing targets explicitly rather than inventing benchmarks.
- Test timeouts, bounded retries/backoff, resource limits, memory leaks, cancellation, concurrent workloads, recovery after interruption and dependency outages. Verify graceful degradation, not silent success.
- Inspect module boundaries, coupling, dead/duplicate code, types/contracts, error handling, dependency/version management, logging, config, extensibility, and code complexity. Prefer evidence-backed targeted improvements; avoid unnecessary abstractions, dependency churn or speculative rewrites.
- Verify supported OS/device/browser/runtime compatibility using real environments where available. Emulator, mocked and static checks have limited scope.

## 7. Production delivery and operations

For the actual deliverable, verify reproducible production build/package, correct environment and feature flags, absence of dev bypasses, installation/startup, upgrade and rollback, artifact integrity, health/observability, safe migrations, backup/restore, graceful shutdown and operational docs where applicable. Test actual built artifacts rather than only dev servers. Never deploy or mutate production without permission. Libraries/CLI/local apps have different release obligations from hosted services.

## 8. Fix and reverify

In AUDIT_FIX_VERIFY mode:
- Prioritize P0/P1 and root causes. Make minimal coherent fixes, preserve unrelated behavior and public contracts. Obtain decisions for ambiguous business changes.
- Add targeted regression tests; show failure before and pass after where feasible. Do not patch around failed assertions or add fake behavior.
- Rerun affected checks, integration paths and all mandatory gates. Repeat while meaningful progress is possible; stop at real blockers, permission boundaries, or resource limits. Document unresolved issues rather than claiming completion.
- Prefer a fresh review context or independent reviewer/model with requirements, diff and raw evidence. Disclose if only self-review was possible.

## 9. Deliverables and release decision

Use project-approved report directory or docs/audit/. Produce:
- PRODUCTION_AUDIT.md: scope, revision, architecture, findings, fake-data inventory, blockers and evidence index.
- REQUIREMENTS_MATRIX.md: requirement ID/source, expected result, criticality, verification method, evidence, status.
- DATA_OWNERSHIP_MATRIX.md: authoritative state, validation, persistence, recovery and risk; N/A with reason where no persistent/shared data.
- PRODUCTION_READINESS.md: score, coverage, mandatory gates, limitations, release decision and next steps.
- evidence/: actual redacted logs, commands, test results, screenshots and artifacts; no placeholder files presented as proof.

Each finding: ID, severity P0–P3, requirement, expected/observed, file:line or symbol, evidence, reproduction, impact, root cause (or hypothesis), recommendation, status. Group large audits by module and track what has not been inspected.

Follow the release policy. Return PRODUCTION_READY, CONDITIONALLY_READY or NOT_PRODUCTION_READY. A high score does not override mandatory gates. Explicitly state what works, what is fake/incomplete, what failed, what remains unverified, and what needs human/device/service testing. Never equate workflow completion with product correctness.
