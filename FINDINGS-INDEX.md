---
layout: default
permalink: /findings/
title: Findings Index
---

# Findings Index

Every security-relevant observation from the five completed research
projects, categorized by its verification status as recorded in the research
archive. Statuses are as of the close of each project (2026-10-24 through
2026-11-14). None of the findings below has been submitted to a vendor yet —
see [DISCLOSURE-STATUS.md](findings/DISCLOSURE-STATUS.md). Public reports are redacted
and do not include exploitation material for unpatched issues.

Status legend:

- **Confirmed** — reproduced at runtime under a sanitizer, or proven
  statically when the runtime path is not reachable on the audit platform.
- **Potential** — root cause argued from code; runtime verification pending.
- **Informational** — verified defect without established security impact.
- **False positive** — screened and cleared; retained for auditability.

## Confirmed findings

| ID | Project | Title (abridged) | Class | Proposed severity | Upstream status | Report |
| --- | --- | --- | --- | --- | --- | --- |
| PHP-V1 | PHP 8.7.0-dev | OOB read in `mb_regex_substitute()` (`mb_ereg_replace()`) | OOB read / info leak | High (proposed 7.5) | Unpatched at audited commit | [report](findings/reports/PHP-V1.md) |
| PHP-V2 | PHP 8.7.0-dev | RFC 3986 recomposition integer wrap + suppressed `uriToStringA` error → uninitialized `zend_string` | Integer overflow / uninit info leak | High (proposed 5.9–7.4) | Unpatched at audited commit | [report](findings/reports/PHP-V2.md) |
| PHP-V4 | PHP 8.7.0-dev | `bcround()` with `PHP_INT_MIN` precision → uncatchable ~9.2 EB allocation fatal | Availability (DoS) | Low (proposed 3.7) | Unpatched at audited commit | [report](findings/reports/PHP-V4.md) |
| SSL-CCM-1 | OpenSSL 4.2.0-dev | CCM provider IV parameter getters perform OOB heap read | OOB heap read / info disclosure | Medium (proposed ~5.9) | Unpatched at audited commit | [report](findings/reports/SSL-CCM-1.md) |
| OSSH-002 | OpenSSH V_10_6_P1 | `fstatat()` fallback macro stats the wrong variable | Portability correctness / latent uninit use | Low | Unpatched at audited tag | [report](findings/reports/OSSH-002.md) |
| XRDP-001 | xrdp v0.10.6.1 | rdpsnd_rec unbounded capture-formats parse | OOB read | Low (availability) | **Fixed upstream** (CVE-2026-79928 family, commit `de20a7e4`) | [report](findings/reports/XRDP-001.md) |
| XRDP-002 | xrdp v0.10.6.1 | rdpsnd_rec unchecked memcpy from client packet + unbounded FIFO | OOB read + unbounded resource | Low | **Fixed upstream** (CVE-2026-79936/-81169 family) | [report](findings/reports/XRDP-002.md) |
| XRDP-003 | xrdp v0.10.6.1 | cliprdr capability-set length used for unchecked stream skip | OOB read | Low (availability) | Unpatched at audit time | [report](findings/reports/XRDP-003.md) |
| XRDP-004 | xrdp v0.10.6.1 | Static-channel 8-byte header read without bounds check | OOB read | Low (availability) | Unpatched at audit time | [report](findings/reports/XRDP-004.md) |
| XRDP-005 | xrdp v0.10.6.1 | drdynvc reassembly buffer allocated from unbounded client length | Unbounded resource | Medium (availability) | Unpatched at audit time | [report](findings/reports/XRDP-005.md) |
| XRDP-006 | xrdp v0.10.6.1 | audin formatchange client index used unchecked as array index | Improper index validation → OOB deref | Low (availability) | Unpatched at audit time | [report](findings/reports/XRDP-006.md) |
| XRDP-007 | xrdp v0.10.6.1 | cliprdr file-contents request size drives direct allocation | Unbounded resource | Medium (availability) | Unpatched at audit time | [report](findings/reports/XRDP-007.md) |
| NODE-FIND-001 | Node.js HEAD `67e45e4a` | https Agent silently drops per-request `checkServerIdentity` overrides on session reuse when an agent-level checker exists | TLS identity-policy isolation bypass | High (proposed 8.1, vendor triage pending) | Unpatched; residual of the CVE-2026-48934/58040 fix cluster | [report](findings/reports/NODE-FIND-001.md) |

Severity values are the researcher's proposals with stated reasoning; they
are explicitly subject to vendor triage. No CVSS score here is authoritative
and no CVE identifier is claimed.

## Potential findings

Root cause documented from code analysis; runtime verification pending.

| ID | Project | Title (abridged) | Class | Status | Report |
| --- | --- | --- | --- | --- | --- |
| PHP-V3 | PHP 8.7.0-dev | WHATWG `context` property uses unbounded `strlen()` on interior pointers | Incorrect disclosure surface / latent OOB | Partially confirmed (wrong-range contexts observed) | [report](findings/reports/PHP-V3.md) |
| PHP-V5 | PHP 8.7.0-dev | `url_scanner_ex.c` cross-allocation guard comparison | Potential OOB read | Static review only | [report](findings/reports/PHP-V5.md) |
| SSL-D-1 | OpenSSL 4.2.0-dev | DTLS 1.3 unified header with L bit clear mis-frames record length | Protocol conformance / availability | Probable (not runtime-verified) | [report](findings/reports/SSL-D-1.md) |
| SSL-Q-1 | OpenSSL 4.2.0-dev | QUIC release-build assert off-by-one drops legal 20-byte DCID | Availability | Probable (deterministic from code) | [report](findings/reports/SSL-Q-1.md) |
| SSL-ASN-1 | OpenSSL 4.2.0-dev | `ASN1_STRING_copy` propagates DATA_NOT_OWNED flag onto owned data | Internal API hygiene / leak | Probable (no attacker path today) | [report](findings/reports/SSL-ASN-1.md) |

Unconfirmed (not reproduced): SSL-K-1 — `p5_crpt2.c` `OPENSSL_assert` abort
reachable with a custom provider (est. Low/config-dependent); requires
custom-provider setup to verify — see [INFORMATIONAL.md](findings/INFORMATIONAL.md).

## Informational observations

| ID | Project | Title (abridged) | Verification | Report |
| --- | --- | --- | --- | --- |
| OSSH-001 | OpenSSH V_10_6_P1 | Uninitialized/stale `struct stat` consumed after ENOENT fall-through in `agent_cleanup_stale()` | Valgrind memcheck + clang MSan; patched-sim clean | [report](findings/reports/OSSH-001.md) |
| SSL-K-1 | OpenSSL 4.2.0-dev | `OPENSSL_assert` on keylen aborts with custom PBKDF2 cipher provider | Unconfirmed | [report](findings/reports/SSL-K-1.md) |

Plus three xrdp hardening-only observations (documented in the xrdp project
notes, not raised as findings): `read_entire_packet` length trust,
`xrdp_tconfig` off-by-one defensive check, chansrv drdynvc `chan_id` range
check.

## False positives eliminated

Documented negative results are kept as part of the evidence chain:

- **OpenSSL** — 17 candidates cleared with per-item rationale
  (CCM set-IV underflow, ASN.1 BIT STRING handling, name-constraint URI,
  punycode/EAI, indefinite-length EOC, CMS staged decrypt, PEM header parser,
  PKCS12/PBKDF2 arithmetic, EVP base64, BIO hostname, KDF param concat,
  PQ import ranges, TLS padding/CBC rotation, QUIC wire parsing, and 43
  scan-build null-deref path-power reports triaged as false positives out of
  337 total reports).
- **OpenSSH** — cppcheck 42/42 triaged benign; clang CSA 60/60 triaged
  benign; GCC 17/17 warnings benign.
- **Node.js** — FIND-002 (WeakMap key "recycling" hypothesis) refuted before
  reproduction: the id source is a monotonic counter, so keys cannot collide.
  [report](findings/reports/NODE-FIND-002.md)

## Disclosure status

All vendor reports are prepared and **not yet submitted**. Public reports
here are redacted accordingly. Full status per finding:
[DISCLOSURE-STATUS.md](findings/DISCLOSURE-STATUS.md).
