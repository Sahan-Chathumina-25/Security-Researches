# Verified Findings

Findings independently verified during research: reproduced at runtime under
a sanitizer (AddressSanitizer, MemorySanitizer, or Valgrind memcheck), or
proven statically where the runtime path is not reachable on the audit
platform. Severity values are the researcher's proposals for vendor triage —
no CVSS score on this page is authoritative and no CVE identifier is claimed.

## PHP (php-src 8.7.0-dev, @ `251fe7729`, 2026-10-24)

| ID | Title | Class | Proposed severity | Upstream status | Report |
| --- | --- | --- | --- | --- | --- |
| PHP-V1 | OOB read in `mb_regex_substitute()` reached via `mb_ereg_replace()` / `mb_eregi_replace()` | Out-of-bounds read / uninitialized info leak | High (7.5 proposed) | Unpatched at audited commit | [report](reports/PHP-V1.md) |
| PHP-V2 | RFC 3986 recomposition integer wrap with suppressed `uriToStringA` failure → `zend_string` of length `INT_MAX` returned uninitialized | Integer overflow + uninitialized info leak + release-build UB | High (5.9–7.4 proposed, config-dependent) | Unpatched at audited commit | [report](reports/PHP-V2.md) |
| PHP-V4 | `bcround()` / `BcMath\Number->round()` with `precision = PHP_INT_MIN` → uncatchable ~9.2 EB allocation fatal | Availability (DoS) | Low (3.7 proposed) | Unpatched at audited commit | [report](reports/PHP-V4.md) |

Both verification builds (debug+ASan and release+ASan) reproduced the
runtime findings; details in the reports.

## OpenSSL (4.2.0-dev master, @ `5dbd6501e`, 2026-11-04/05)

| ID | Title | Class | Proposed severity | Upstream status | Report |
| --- | --- | --- | --- | --- | --- |
| SSL-CCM-1 | CCM provider IV parameter getters copy caller-buffer-size bytes from a fixed 16-byte IV array | Out-of-bounds heap read / info disclosure | Medium (~5.9 proposed) | Unpatched at audited commit | [report](reports/SSL-CCM-1.md) |

Verified with two independent ASan reproductions (different buffer sizes),
patch-validated, and the full official test suite passes after the patch.

## OpenSSH (Portable V_10_6_P1, @ `a8c72b842`, November 2026)

| ID | Title | Class | Proposed severity | Upstream status | Report |
| --- | --- | --- | --- | --- | --- |
| OSSH-002 | `fstatat()` fallback macro expands to `lstat(path, buf)` — stats the wrong variable on platforms without `fstatat(3)` | Wrong-variable macro expansion; latent uninitialized-pointer use | Low / correctness | Unpatched at audited tag | [report](reports/OSSH-002.md) |

Confirmed statically via forced-macro compilation and preprocessor expansion
proofs; not runtime-testable on Linux (the path requires a platform without
`fstatat(3)`).

## xrdp (v0.10.6.1, @ `80c52879f`)

| ID | Title | Class | Upstream status | Report |
| --- | --- | --- | --- | --- |
| XRDP-001 | rdpsnd_rec unbounded capture-formats parse | OOB read | **Fixed upstream** (`de20a7e4`; CVE-2026-79928 family) | [report](reports/XRDP-001.md) |
| XRDP-002 | rdpsnd_rec unchecked memcpy from client packet + unbounded FIFO | OOB read + unbounded resource | **Fixed upstream** (CVE-2026-79936/-81169 family) | [report](reports/XRDP-002.md) |
| XRDP-003 | cliprdr capability-set length used for unchecked stream skip | OOB read | Unpatched at audit time | [report](reports/XRDP-003.md) |
| XRDP-004 | Static-channel 8-byte header read without bounds check | OOB read | Unpatched at audit time | [report](reports/XRDP-004.md) |
| XRDP-005 | drdynvc reassembly buffer allocated from unbounded client length | Unbounded resource | Unpatched at audit time | [report](reports/XRDP-005.md) |
| XRDP-006 | audin formatchange client index used unchecked as array index | Improper index validation → OOB deref | Unpatched at audit time | [report](reports/XRDP-006.md) |
| XRDP-007 | cliprdr file-contents request size drives direct allocation | Unbounded resource | Unpatched at audit time | [report](reports/XRDP-007.md) |

All seven were confirmed with mechanical reproducers (ASan primary; Valgrind
cross-check for XRDP-001, XRDP-004, XRDP-006). Impact is bounded to
per-connection or per-session scope under xrdp's process model; no
cross-session or pre-auth RCE was identified.

## Node.js (HEAD `67e45e4a`, v28.0.0-pre; comparison on v24.19.0)

| ID | Title | Class | Proposed severity | Upstream status | Report |
| --- | --- | --- | --- | --- | --- |
| NODE-FIND-001 | https Agent silently drops per-request `checkServerIdentity` overrides on session reuse when the agent itself carries a checker | TLS identity-policy isolation bypass | High (8.1 proposed, vendor triage pending) | Unpatched; residual of the July 2026 CVE-2026-48934/58040 fix cluster | [report](reports/NODE-FIND-001.md) |

Reproduced on the HEAD ASan build with a control experiment demonstrating
correct behavior without an agent-level checker.
