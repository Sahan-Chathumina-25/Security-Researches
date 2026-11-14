---
layout: default
permalink: /findings/
title: Findings
---

# Findings

All security-relevant results, categorized by verification status as
recorded in the research archive. Because no finding has been submitted to
a vendor yet, public reports are redacted: root cause, impact scope, and
verification methodology are described; PoC code, trigger inputs, and
reproduction steps for unpatched issues are withheld. See the
[disclosure status](https://github.com/{{ site.github_username }}/Security-Researches/blob/main/findings/DISCLOSURE-STATUS.md)
in the repository.

## Confirmed findings (11)

| ID | Project | Finding | Class | Proposed severity |
| --- | --- | --- | --- | --- |
| PHP-V1 | PHP | OOB read in `mb_ereg_replace()` replacement walk | OOB read / info leak | High (7.5) |
| PHP-V2 | PHP | RFC 3986 recomposition int wrap → uninitialized `INT_MAX` string | Integer overflow / info leak | High (5.9–7.4) |
| PHP-V4 | PHP | `bcround()` `PHP_INT_MIN` → uncatchable ~9.2 EB alloc | Availability | Low (3.7) |
| SSL-CCM-1 | OpenSSL | CCM IV parameter getters OOB heap read | OOB heap read | Medium (~5.9) |
| OSSH-002 | OpenSSH | `fstatat()` fallback macro stats wrong variable | Portability correctness | Low |
| XRDP-001 | xrdp | rdpsnd_rec unbounded capture-formats parse | OOB read | Low — **fixed upstream** |
| XRDP-002 | xrdp | rdpsnd_rec unchecked memcpy + unbounded FIFO | OOB read + resource | Low — **fixed upstream** |
| XRDP-003 | xrdp | cliprdr caps length unchecked stream skip | OOB read | Low |
| XRDP-004 | xrdp | static-channel header read unchecked | OOB read | Low |
| XRDP-005 | xrdp | drdynvc reassembly alloc unchecked | Unbounded resource | Medium |
| XRDP-006 | xrdp | audin formatchange index unchecked | OOB deref | Low |
| XRDP-007 | xrdp | cliprdr file-contents size drives alloc | Unbounded resource | Medium |
| NODE-FIND-001 | Node.js | Agent drops per-request `checkServerIdentity` on session reuse | TLS policy isolation bypass | High (8.1) |

XRDP-003..007 are five findings; with XRDP-001/002 the xrdp total is seven
confirmed. Severity values are researcher proposals subject to vendor
triage; no CVSS score here is authoritative and no CVE is claimed.

## Potential findings (5)

Root cause documented from code; not runtime-verified (or only partially):

- **PHP-V3** — WHATWG `context` property unbounded `strlen()` (partially
  confirmed)
- **PHP-V5** — `url_scanner_ex.c` cross-allocation guard (static only)
- **SSL-D-1** — DTLS 1.3 L-bit-clear record mis-framing (probable)
- **SSL-Q-1** — QUIC assert off-by-one drops legal 20-byte DCID (probable)
- **SSL-ASN-1** — `ASN1_STRING_copy` ownership-flag leak (probable)

Plus one unconfirmed item (SSL-K-1, custom-provider assert abort).

## Informational observations

- **OSSH-001** — uninitialized/stale `struct stat` after ENOENT
  fall-through in OpenSSH `agent_cleanup_stale()` (verified under Valgrind
  and MemorySanitizer; no established security impact).

## False positives eliminated

Negative results are retained as part of the evidence chain: 17 OpenSSL
candidates cleared with rationale; 43 scan-build null-deref reports triaged
as path-power false positives; OpenSSH analyzer reports triaged benign
(cppcheck 42, clang CSA 60, GCC 17); and Node.js FIND-002 (key-recycling
hypothesis) refuted before reproduction.

## Per-finding reports

Individual redacted reports live in
[findings/reports/](https://github.com/{{ site.github_username }}/Security-Researches/tree/main/findings/reports)
in the repository, with the full categorization in the
[findings index](https://github.com/{{ site.github_username }}/Security-Researches/blob/main/FINDINGS-INDEX.md).
