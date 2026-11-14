---
layout: default
permalink: /projects/openssh/
title: OpenSSH V_10_6_P1
---

# OpenSSH Portable V_10_6_P1

**Comprehensive, evidence-driven audit of OpenSSH Portable combining manual
review, multiple static analyzers, sanitizer builds, and finding-level
dynamic verification.**

| Field | Value |
| --- | --- |
| Version audited | Tag `V_10_6_P1` @ `a8c72b842423f0774f542d3c2197247c3dd28d74` (tag signature verified) |
| Audit period | November 2026 |
| Status | Phases 1–8 complete; disclosure preparation (phases 9–12) pending |
| Findings | 1 Low (statically proven) + 1 verified informational |
| Vendor report | Content ready, not submitted |

## Scope

Packet framing (AEAD/CBC), key exchange, authentication, channel/monitor
dispatch, ssh-agent process messages and the new 10.6 file-manager
integration, session agent-listener integration, sftp-server and sftp-client
10.x deltas.

## Findings

Both defects are in the 10.6-new `misc-agent.c` agent socket manager:

| ID | Finding | Status | Severity |
| --- | --- | --- | --- |
| OSSH-001 | Uninitialized/stale `struct stat` consumed after the ENOENT fall-through in `agent_cleanup_stale()` — nondeterministic socket cleanup | Verified (Valgrind memcheck + clang MSan; patched-sim clean) | Informational (robustness) |
| OSSH-002 | `fstatat()` fallback macro expands to `lstat(path, buf)` — stats the wrong variable on platforms without `fstatat(3)` | Confirmed statically (macro-expansion proof) | Low |

Neither is claimed as an exploitable vulnerability; classifications and
limitations are documented in the reports.

## Verification highlights

- OSSH-001 flagged by **two independent tools** with origin tracking,
  including the stale-reuse artifact across directory entries.
- Upstream hardening analysis: `-ftrivial-auto-var-init=zero` masks only
  the uninitialized form of OSSH-001, not the stale-reuse form.
- **Upstream regression suite: 489/489 passed**; ASan builds exercised over
  real agent protocol flows with zero sanitizer reports.
- Static analysis fully triaged: cppcheck 42/42, clang CSA 60/60, GCC
  warnings 17/17 — all benign, recorded.

## Upstream status

Researcher patches archived for both findings; not fixed upstream at the
audited tag. Planned: report as informational/low robustness items; no CVE
requested.

## Details in the repository

[projects/03-openssh](https://github.com/{{ site.github_username }}/Security-Researches/tree/main/projects/03-openssh)
·
[OSSH-001 report](https://github.com/{{ site.github_username }}/Security-Researches/blob/main/findings/reports/OSSH-001.md)
