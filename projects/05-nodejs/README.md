# Project 05 — Node.js HEAD (v28.0.0-pre)

## Project overview

An audit of the Node.js core `https` Agent TLS-policy isolation machinery
that discovered and confirmed a residual verification bypass in the fix
cluster shipped for the July 2026 CVE-2026-48934 / CVE-2026-58040 advisories.
The mechanism was reproduced on a freshly built HEAD binary (ASan build,
v28.0.0-pre) with a control experiment proving the behavior is isolated to
the affected configuration branch.

## Software description

Node.js is the JavaScript runtime; the `https` Agent pools TLS connections
and keys cached sessions/sockets on the identity and trust policy so that a
resumed session always carries the policy that validated it.

## Audited version and commit

| Item | Value |
| --- | --- |
| Tree | nodejs/node upstream master |
| Commit | `67e45e4a` (v28.0.0-pre) |
| Base import window | 2026-10-04 |
| Comparison build | system Node v24.19.0 (pre-fix-cluster) |
| Confirmation runs | 2026-11-13 / 2026-11-14 |

## Research objectives

- Audit the TLS policy keying introduced/extended by recent identity-policy
  fixes (CVE-2026-123877 class; the July 2026 cluster).
- Search for residuals: configurations where the shipped fixes still allow
  cross-policy session reuse.

## Research scope

`lib/https.js` (Agent keying, session reuse conditions, per-request
override assignment), `lib/internal/tls/wrap.js` (identity verification on
resume), and the documentation contract in `doc/api/https.md`. Sibling
policies (`rejectUnauthorized`, `servername`, per-request CSI without
agent-level CSI) were checked and found correctly isolated.

## Architecture overview

- TLS identity verification is skipped for resumed sessions by design; the
  Agent must therefore key pooled sessions on every policy dimension.
- Session/socket keys are built from object-identity-derived option keys
  stabilized by monotonic counters.
- Per-request `checkServerIdentity` overrides use a counter-symbol marker
  assigned only under a presence-based guard.

## Attack-surface analysis

- Identity-policy isolation at the Agent session-reuse boundary.
- Documented-behavior contract (per-request pinning) versus the actual
  eligibility check.
- Out of scope (trusted app code): the checker implementations themselves.

## Research methodology

Phased research (00–09): project management; reconnaissance (architecture,
build system, repository overview); attack-surface mapping; source-code
audit (memory-safety and access-control notes); static analysis; existing
research/known-issues review; root-cause analysis; validation (ASan build +
validation scripts); vulnerability reporting; final severity assessment.

## Tools and environment

Full source build of HEAD with AddressSanitizer (Release build);
JavaScript validation scripts driving local TLS servers with test-fixture
certificates; comparison runs on v24.19.0. Details:
[../../TOOLS-AND-ENVIRONMENT.md](../../TOOLS-AND-ENVIRONMENT.md).

## Security findings

| ID | Title | Status | Severity (proposed) | Report |
| --- | --- | --- | --- | --- |
| FIND-001 | https Agent silently drops per-request `checkServerIdentity` overrides on session reuse when an agent-level checker exists | **Confirmed** (HEAD ASan build + control experiment) | High — 8.1 proposed, vendor triage pending | [report](../../findings/reports/NODE-FIND-001.md) |
| FIND-002 | TLS-policy object key "recycling" hypothesis | **False positive** (refuted pre-reproduction) | — | [report](../../findings/reports/NODE-FIND-002.md) |

## Technical achievements

- Identified a residual of a *shipped* security fix cluster: the fix keys
  sessions by object identity, but a presence-only guard keeps the
  effective checker identical to the agent's, so the key never diverges.
- Confirmed the mechanism on a freshly built HEAD binary, not just a
  released build — demonstrating the residual is present in the current
  development line.
- Control experiment isolating the defect to the agent-CSI-present branch,
  and a variant matrix showing the trust-policy keying (CA change) is
  correctly isolated while identity-policy keying is not.
- Honest dedup analysis against the public CVE chain, with an explicit
  scope-ruling request to triage (security issue vs documented-behavior
  issue).

## Testing and verification

- Validation scripts: lenient-agent scenario (strict requests succeed via
  reuse where they must fail), control scenario (correct rejections), and a
  variant matrix (CA keying works; CSI keying does not).
- Reproduced identically on v24.19.0 and HEAD v28.0.0-pre ASan build.
- Severity assessment document with CVSS reasoning and the
  deployment-prevalence caveat recorded.

## Remediation and upstream status

Two remediation options recorded: equality-based eligibility (minimal) and
running the effective checker on session resume (robust). Unpatched at the
audited HEAD.

## Responsible disclosure status

Report draft prepared for the Node.js security lane and **not submitted**
(reporter-anonymity and authorization notes recorded in the research
archive). Position: residual follow-up of the July 2026 cluster, adjacent
to the parent advisories. Details:
[../../findings/DISCLOSURE-STATUS.md](../../findings/DISCLOSURE-STATUS.md).

## References

- Node.js repository: <https://github.com/nodejs/node>
- Node.js security policy: <https://github.com/nodejs/node/blob/main/SECURITY.md>
- Related advisories: CVE-2026-48934, CVE-2026-58040
