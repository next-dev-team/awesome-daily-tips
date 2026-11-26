# Project-specific verification profiles

Select every applicable profile and add product-specific acceptance cases from approved requirements. Do not impose requirements unrelated to the deliverable. Use actual production components in authorized environments; clearly mark any missing environment or evidence. The universal SKILL.md remains mandatory.

| Project | Additional verification |
|---|---|
| Frontend / web / SPA / SSR | Route/auth guards, real APIs, cache invalidation, loading/error/empty states, form validation, race conditions, hydration, accessibility, responsive UI, browser support, production bundle, no exposed secrets or fake live UI. |
| Backend / REST / GraphQL / RPC | Contract/schema, real database and integrations, authorization, transaction boundaries, pagination, validation, concurrency, idempotency, rate limits, timeout/retry, observability and migrations. |
| Mobile / PWA | Actual device or labeled emulator, permissions, lifecycle, resume, offline/sync, touch, safe areas, deep links, notifications if supported, install/update, signing/config and release build. |
| Desktop / Electron / Tauri / native | Actual packaged application, IPC allowlist, filesystem permissions, sidecar lifecycle, install/uninstall/update, local DB recovery, OS/GPU support, crash handling, resource cleanup, no embedded secrets. |
| AI / LLM / RAG / agent | Real provider/tool calls, model/config validity, grounded retrieval and citations, factual eval set, prompt injection, approval and sandbox boundaries, error/fallback behavior, streaming, cancellation, cost limits, privacy, deterministic checks where possible and human evaluation for subjective output. |
| Media / video / audio / 3D | Inspect produced files, codec/duration/resolution, timestamp/audio sync, scene continuity, character consistency, actual render and playback, artifact completeness, GPU/CPU usage, long jobs, cancellation, retries, missing asset behavior and quality review against agreed rubric. |
| POS / ecommerce / finance | Independent calculations, rounding/currency, tax and discount rules, permissions, inventory, payment webhook verification, idempotency, refunds, reconciliation, audit trail, transactional consistency and recovery. Use test transactions only. |
| Multiplayer / game / real-time | Approved game rules, physics/invariants, independent real clients, authoritative shared state, synchronized outcomes, ordering/duplicates, reconnection, latency/jitter, anti-cheat, result persistence and performance. |
| Offline / local-first | Local authoritative persistence, recovery, conflict resolution when sync exists, migration, export/import, no unnecessary online dependency, clear offline indicators. |
| CLI / SDK / library | Public API and compatibility, input/output contracts, exit codes, error handling, installation, supported versions, reproducible examples, deterministic tests, packaging and documentation. |
| Infrastructure / DevOps | Config validation, least privilege, network/secrets, reproducible plan/build, health/rollout/rollback, monitoring, backup/restore, safe dry-run or staging validation. No live mutation without permission. |
| Data pipeline / ETL | Schema/grain, quality, lineage, validation, completeness, duplicates, nulls, freshness, idempotent backfill, drift, privacy, downstream output reconciliation and recovery. |
| Embedded / IoT | Real hardware when available, timing/resource limits, protocol integrity, power loss, firmware update/rollback, safe failure, device identity and hardware-in-loop testing; mark missing hardware unverified. |

## Detailed online 8-ball pool profile

First establish approved rules and variants; if missing, propose an independently verified current WPA ruleset as a reference, not as a silently imposed requirement. Document break, call-pocket, foul and disconnect variations.

- Rules: rack, legal/illegal break, open table, solids/stripes assignment, first contact, cushion/pocket requirement, scratch, ball-in-hand bounds and overlap, turn continuation/switch, called shots where required, legal/illegal 8-ball outcomes, simultaneous events, timeout/forfeit, match completion, rematch/reset. Test both positive and negative cases, including combinations of foul and pocket.
- Physics: reproducible initial layouts and shot vectors; ball/rail/pocket collisions, momentum, friction/restitution, spin if supported, overlap/tunneling, boundary escape, bounded steps and stop detection. Compare to independent analytic or validated reference fixtures with justified tolerances. Verify outcomes across render rates and client clocks; do not demand bitwise identical cross-platform floats unless promised. Validate aim guides against simulation.
- Multiplayer: two separately authenticated real clients and actual backend, same match/turn, shot legality, authoritative settled ball states, foul and result agreement, ordering/duplicate/stale inputs, replay, reconnect while balls move, snapshot/resync, deadline, disconnect/restart policy, rematch and persisted result. Test controlled latency/jitter/transport interruption and record conditions. Bots/mock sockets are not proof.
- Security: deny unauthorized room access, out-of-turn/duplicate shots, invalid force/coordinates, forged results, client clock/state changes and double settlement. Keep shared match/ranking/reward authority with trusted backend; local prediction and visuals are valid.
- UX: actual mobile portrait/landscape as supported, POV and table coverage, cue/aim alignment, touch/shot power, ball-in-hand, turn/foul feedback, safe areas, reconnection, result screens and desktop controls. Capture real screenshots/video.
- Performance: frame times, physics cost, network traffic, server response, cleanup, sustained games and representative load. Use real measured budgets.

For other games, replace the rule and physics details with approved domain invariants. For an offline-only game, server/multiplayer checks are N/A only when the agreed requirements genuinely exclude online play.
