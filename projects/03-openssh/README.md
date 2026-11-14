# Project 03 — OpenSSH Portable V_10_6_P1

## Project overview

A comprehensive, evidence-driven audit of OpenSSH Portable tag `V_10_6_P1`
(commit `a8c72b842423f0774f542d3c2197247c3dd28d74`) combining manual review,
multiple static analyzers, sanitizer builds, and finding-level dynamic
verification. Phases 1–8 are complete; disclosure preparation (phases 9–12)
is pending.

## Software description

OpenSSH is the reference implementation of the SSH protocol — client,
server, and agent. The 10.6 release introduced a new agent socket
file-manager integration (`misc-agent.c`), which proved to be the
highest-churn new attack surface.

## Audited version and commit

| Item | Value |
| --- | --- |
| Tree | openssh-portable |
| Tag | `V_10_6_P1` (cryptographically SSH-signed by the maintainer; signature verified) |
| Commit | `a8c72b842423f0774f542d3c2197247c3dd28d74` |
| Audit period | November 2026 |

## Research objectives

- Audit the 10.6 new integration surfaces end-to-end.
- Verify historical security fixes (10.0/10.6 releases) are correctly
  present in the audited tree.
- Run the complete upstream regression suite as a behavioral baseline.

## Research scope

Packet framing (AEAD/CBC), key exchange, authentication, channel/monitor
dispatch, ssh-agent process messages and file-manager integration,
`session.c` agent-listener integration, sftp-server and sftp-client 10.x
deltas. The audited source tree was kept pristine with VPATH-only builds.

## Architecture overview

Documented in three written analyses (Phase 3): architecture overview,
trust boundaries (privileged monitor, per-connection children, agent
process), and attack-surface map. The agent's socket-directory sweep is a
new, racy-by-design surface introduced in 10.6.

## Attack-surface analysis

- **Agent socket lifecycle**: concurrent creation/removal of sockets in
  user-owned directories; sweep logic interacting with the ENOENT race.
- **Portability fallback macros** compiled on platforms lacking
  `fstatat(3)`/`unlinkat(3)` — dormant on Linux, real elsewhere.
- **Privilege isolation invariants**: monitor dispatch and agent message
  handling verified consistent (no findings).

## Research methodology

Eight recorded phases: baseline & environment; architecture; historical and
patch analysis (verified Z_HUFFMAN_ONLY, PACKET_MAX_SIZE inflate cap,
seccomp mremap mask in tree; DSA removal confirmed); manual review; static
analysis; dynamic verification; upstream test suite.

## Tools and environment

GCC 16.2 / Clang 21.1.8 / Valgrind 3.27.1 / cppcheck 2.21.0. Three VPATH
build trees (normal, scan-build, ASan); direct `clang --analyze` (scan-build's
wrapper is incompatible with the project's clang flags); Valgrind memcheck +
clang MSan on extracted verbatim harnesses. Details:
[../../TOOLS-AND-ENVIRONMENT.md](../../TOOLS-AND-ENVIRONMENT.md).

## Security findings

| ID | Title | Status | Severity | Report |
| --- | --- | --- | --- | --- |
| OSSH-001 | Uninitialized/stale `struct stat` consumed after ENOENT fall-through in `agent_cleanup_stale()` | Verified (Valgrind + MSan; patched-sim clean) | Informational (robustness) | [report](../../findings/reports/OSSH-001.md) |
| OSSH-002 | `fstatat()` fallback macro stats the wrong variable | Confirmed statically (macro-expansion proof) | Low (portability correctness) | [report](../../findings/reports/OSSH-002.md) |

Both defects are in the 10.6-new `misc-agent.c` file-manager integration.
Neither is claimed as an exploitable vulnerability; classifications and
limitations are documented in the reports.

## Technical achievements

- OSSH-001 demonstrated under **two independent tools** (Valgrind memcheck
  with origin tracking; clang MemorySanitizer), including the stale-reuse
  behavioral artifact across entries, with a patched-simulation run proving
  the fix concept clean.
- OSSH-002 proven via forced-macro compile probe and preprocessor expansion
  evidence — invisible to `-Wuninitialized` because of a later write.
- Explicit hardening-flag analysis: upstream's
  `-ftrivial-auto-var-init=zero` masks only the uninitialized form of
  OSSH-001, not the stale-reuse form.
- Historical security fixes (10.0/10.6 releases) verified present with line
  references; seven review hypotheses (PA1–PA7) all passed.

## Testing and verification

- **Upstream regression suite: 489/489 passed** (t-exec 332, hostkeys 18,
  match 7, misc 108, servconf 6, crypto 18).
- ASan-instrumented binaries exercised over real agent protocol flows with
  zero sanitizer reports.
- Static analysis triage: cppcheck 42/42 benign, clang CSA 60/60 benign,
  GCC 17/17 warnings benign — all triaged and recorded.

## Remediation and upstream status

Researcher patches for both findings are archived (ENOENT symmetry + stat
reset for OSSH-001; named-macro-parameter forwarding for OSSH-002). Neither
is fixed upstream at the audited tag.

## Responsible disclosure status

Phases 9–12 pending. Plan: report both findings through the OpenSSH
security contact as informational/low robustness items with harness and
tool artifacts attached; no CVE requested. Details:
[../../findings/DISCLOSURE-STATUS.md](../../findings/DISCLOSURE-STATUS.md).

## References

- openssh-portable: <https://github.com/openssh/openssh-portable>
- OpenSSH reporting: <https://www.openssh.com/report.html>
