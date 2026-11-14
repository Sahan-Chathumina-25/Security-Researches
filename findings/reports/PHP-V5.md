# PHP-V5 — `url_scanner_ex.c` cross-allocation separator guard (static review)

| Field | Value |
| --- | --- |
| Finding ID | PHP-V5 |
| Status | Potential (static review only — not runtime-confirmed) |
| Affected software | PHP (php-src) |
| Affected version | 8.7.0-dev upstream master @ `251fe77296acf8c689d2a657fa3805371dc506b1` (2026-10-24) |
| Affected component | `ext/standard` — URL rewriter (`url_scanner_ex.c`) |
| Source location | `ext/standard/url_scanner_ex.c` (≈lines 1301, 1315–1324) |
| Classification | Potential OOB read (CWE-125 candidate) |
| Proposed severity | Low (hardening) |
| Upstream status | Unpatched at the audited commit |
| Disclosure status | Documented in the vendor report set; not yet submitted |

## Technical summary

The "preceding separator" guard in the URL rewriter compares memory that
lives in **two different allocations** — the rewriter's own state buffer and
the `arg_separator.output` INI string. The underflow check preceding a
backwards `memcmp` is vacuously satisfied because the compared regions do
not share an allocation, so the backwards read can occur before the rewrite
buffer when the separator string is multi-byte.

## Root cause

- The guard assumes both pointers address the same buffer; `arg_separator
  .output` is `ini_set`-controllable (`PHP_INI_ALL`), so a multi-byte
  separator makes the length used for the backwards comparison larger than
  the region actually available in the state buffer.

## Why this is not confirmed

- Static review only: no runtime reproduction was performed, and the
  reachability of a harmful backwards read depends on buffer layout and the
  rewrite-path state at the guard. It is documented as a hardening note at
  its recorded confidence level.

## Proposed remediation

Validate the separator length against the region actually available within
the state buffer before any backwards comparison, or copy the separator into
the state's own allocation.

## Upstream / disclosure status

Not fixed at the audited commit. Documented in the prepared vendor report
set as a hardening observation.

## References

- Original research record: `PHP/V3-V5-minor/url_scanner-guard/` (private archive)
