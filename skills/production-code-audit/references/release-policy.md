# Evidence-based release policy

## Mandatory gates (apply to agreed scope)

1. Scope and critical requirements established, all applicable mandatory requirements VERIFIED_PASS.
2. Actual required production paths and integrations work end to end; no fake live functionality or unsafe dev fallback.
3. Correct authoritative data ownership, persistence and integrity wherever applicable.
4. Critical security/privacy/permission and failure-recovery controls verified.
5. Production build/package and representative runtime verification successful.
6. Regression tests and relevant performance/compatibility budgets satisfied.
7. No unresolved P0/P1 findings, no critical NOT_VERIFIED, PARTIALLY_VERIFIED or NOT_IMPLEMENTED requirements.
8. Evidence and limitations documented, report tied to the actual candidate. Release/deployment remains a separate authorization.

For a genuinely inapplicable gate, record specific scope evidence and justification. Never reclassify a mandatory but blocked gate as N/A.

## Suggested scoring

| Category | Weight |
|---|---:|
| Functional and domain correctness | 25 |
| Real integration and data integrity | 20 |
| Security and privacy | 15 |
| Reliability and recovery | 10 |
| Performance and compatibility | 10 |
| Tests and reproducible evidence | 10 |
| Architecture and maintainability | 5 |
| Production delivery and UX/output | 5 |

Before testing, define independently checkable criteria and allocate category points across them. VERIFIED_PASS earns its allocated points; all other applicable statuses earn zero. Exclude only justified N/A criteria and normalize remaining applicable points to 100. Publish earned/eligible points, unrounded score, applicable requirement count, verified coverage (PASS + FAIL / applicable), and pass coverage separately. Do not change weights after seeing results or round upward to pass. A score without a defensible criterion matrix is unavailable, not an estimated pass.

Default release threshold: 90/100, all applicable mandatory gates passed, zero unresolved P0/P1, no unknown critical requirement. Project-specific stricter thresholds may be agreed in advance. This is an internal suggested gate, not industry certification.

- PRODUCTION_READY: all release conditions met for the verified scope and candidate.
- CONDITIONALLY_READY: mandatory gates and threshold satisfied but noncritical residual risks need explicit human acceptance before release. Record acceptance owner and conditions. Not a release authorization.
- NOT_PRODUCTION_READY: any mandatory failure/unknown, unresolved P0/P1, missing threshold/score, or insufficient evidence.

## Report scaffold

Revision / dirty status / date / environment / scope / excluded areas:
Requirements and acceptance sources:
Actual architecture, entry points, critical journeys:
Selected profiles and dependencies:
Baseline commands and outcomes:
Fake-data inventory and classification:
Findings (ID, severity, expected/actual, code ref, reproduction, evidence, impact, fix, status):
Requirements matrix (ID, source, criticality, expected, method, evidence, status):
Data ownership matrix:
Performance budgets vs observed:
Gate table (gate, applicability, status, evidence, blocker):
Score / applicable points / verification coverage / pass coverage:
Unverified areas and limitations:
Verdict and required next actions:

## Severity
P0: catastrophic security, safety, integrity or availability failure; P1: serious core functionality/security/release blocker; P2: significant noncritical defect; P3: minor issue. Justify severity from impact and likelihood, not file count.

Evidence files should preserve observed outputs and exact commands with redaction. A machine-readable or written report is not proof by itself: reviewers must inspect underlying evidence and verify that tests actually exercise real behavior.
