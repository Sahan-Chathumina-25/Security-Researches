---
description: "Node.js HEAD audit: residual https Agent TLS-policy isolation bypass confirmed on a freshly built HEAD binary with a control experiment."
layout: default
permalink: /projects/nodejs/
title: Node.js HEAD (v28.0.0-pre)
eyebrow: Project 05
lede: Audit of the Node.js https Agent TLS-policy isolation machinery confirming a residual verification bypass.
---

**Audit of the Node.js `https` Agent TLS-policy isolation machinery that
confirmed a residual verification bypass in a shipped security-fix
cluster.**

| Field | Value |
| --- | --- |
| Version audited | HEAD `67e45e4a` (v28.0.0-pre), comparison on v24.19.0 |
| Confirmation runs | 2026-11-13 / 2026-11-14 |
| Status | Audit, mechanism reproduction on HEAD, severity assessment |
| Confirmed findings | 1 (High, proposed) + 1 refuted hypothesis |
| Vendor report | Draft prepared, not submitted |

## Scope

`lib/https.js` Agent session keying and reuse conditions,
`lib/internal/tls/wrap.js` identity verification on resume, and the
documented behavior contract in `doc/api/https.md`.

## Findings

| ID | Finding | Status | Proposed severity |
| --- | --- | --- | --- |
| FIND-001 | https Agent silently drops per-request `checkServerIdentity` overrides on session reuse when the agent itself carries a checker — strict requests run over sessions validated under the agent's (possibly lenient) policy | **Confirmed** (HEAD ASan build + control experiment) | High (8.1 proposed, triage pending) |
| FIND-002 | TLS-policy object key "recycling" hypothesis | **False positive** — refuted before reproduction (monotonic id counter cannot collide) | — |

## Root cause (summary)

The fix cluster for the July 2026 advisories (CVE-2026-48934 /
CVE-2026-58040) keys sessions by object identity of the policy options —
but the per-request checker override uses a presence-only guard: when the
agent itself has a `checkServerIdentity`, the request-level checker never
becomes a key component nor the verifying callback, so a distinct identity
policy inherits sessions validated under the agent's policy with no
re-validation.

## Verification highlights

- Reproduced on a freshly built HEAD binary (ASan build), not just a
  released build — the residual is present in the current development
  line.
- **Control experiment**: without an agent-level checker, the same strict
  per-request overrides are correctly enforced — isolating the defect to
  the presence-only guard.
- Variant matrix: trust-policy keying (CA change) is correctly isolated;
  identity-policy keying is not.
- Honest dedup analysis: positioned as a residual of the public CVE chain,
  with an explicit scope-ruling request to triage.

## Upstream status

Unpatched at the audited HEAD. Two remediation options recorded
(equality-based eligibility; checker-on-resume). Draft report prepared for
the Node.js security lane, held pending authorization and submission.

## Details in the repository

[projects/05-nodejs](https://github.com/{{ site.github_username }}/Security-Researches/tree/main/projects/05-nodejs)
·
[FIND-001 report](https://github.com/{{ site.github_username }}/Security-Researches/blob/main/findings/reports/NODE-FIND-001.md)
