# Project 01 — PHP (php-src) 8.7.0-dev

## Project overview

A full source-audit project against the PHP interpreter's upstream
development tree, with runtime verification of every major finding on two
locally built binaries. The research ran against upstream master
`251fe77296acf8c689d2a657fa3805371dc506b1` (PHP 8.7.0-dev, 2026-10-24) and
produced three runtime-confirmed defects, one partially confirmed hardening
observation, and one static-review observation, plus a vendor-ready
disclosure report set.

## Software description

PHP is one of the most widely deployed server-side languages; php-src
contains the interpreter core, bundled extensions (mbstring, bcmath, the new
URI extension), and vendored third-party engines (uriparser).

## Audited version and commit

| Item | Value |
| --- | --- |
| Tree | php-src upstream master |
| Commit | `251fe77296acf8c689d2a657fa3805371dc506b1` |
| Version string | PHP 8.7.0-dev |
| Audit date | 2026-10-24 |

## Research objectives

- Audit recently expanded and newly integrated surfaces (the `ext/uri`
  engine integration, mbstring regex replacement, bcmath rounding APIs).
- Verify candidate defects at runtime on shipping-equivalent builds, not
  just debug builds.
- Produce a complete, self-contained vendor disclosure report set.

## Research scope

`ext/mbstring` (regex replacement path), `ext/uri` (RFC 3986 and WHATWG
parsers), `ext/bcmath` (rounding), `ext/standard/url_scanner_ex.c`; build
and verification infrastructure for both build configurations.

## Architecture overview

- The new `ext/uri` extension glues two parsing engines (RFC 3986 and
  WHATWG) behind PHP value objects; glue code translates between zend
  strings and engine buffers, an error-prone boundary.
- mbstring's regex layer wraps oniguruma with its own encoding-aware
  replacement walk.
- bcmath exposes arbitrary-precision numbers with size computations in C
  integers.

## Attack-surface analysis

- **Userland → C boundary in extensions**: every audited defect was
  reachable from plain userland PHP with no extension loading — the
  intended, documented API surface.
- **Encoding vs length mismatches** in multi-byte string handling (mbstring,
  uri) where character-table lengths are trusted over buffer bounds.
- **Release vs debug build semantics** (`ZEND_ASSERT` compiled away) as a
  security-relevant configuration difference.

## Research methodology

Source audit of the pinned tree; two verification builds (debug + ASan;
release NTS + ASan, `ZEND_DEBUG 0` to match distro shipping semantics);
runtime PoC execution for each candidate; root-cause write-ups; preparation
of `REPORT-main.md` plus standalone sub-reports per finding.

## Tools and environment

GCC 16.2 with AddressSanitizer (debug and release builds); CLI SAPI for PoC
execution; configure/make logs recorded. Environment details:
[../../TOOLS-AND-ENVIRONMENT.md](../../TOOLS-AND-ENVIRONMENT.md).

## Security findings

| ID | Title | Status | Severity (proposed) | Report |
| --- | --- | --- | --- | --- |
| V1 | OOB read in `mb_regex_substitute()` (`mb_ereg_replace()`) | Confirmed (runtime) | High 7.5 | [report](../../findings/reports/PHP-V1.md) |
| V2 | RFC 3986 recomposition int wrap + suppressed engine error → uninitialized `INT_MAX` string | Confirmed (runtime) | High 5.9–7.4 | [report](../../findings/reports/PHP-V2.md) |
| V3 | WHATWG `context` property unbounded `strlen()` | Partially confirmed | Low | [report](../../findings/reports/PHP-V3.md) |
| V4 | `bcround()` `PHP_INT_MIN` → uncatchable ~9.2 EB alloc fatal | Confirmed (runtime) | Low 3.7 | [report](../../findings/reports/PHP-V4.md) |
| V5 | `url_scanner_ex.c` cross-allocation guard | Potential (static only) | Low | [report](../../findings/reports/PHP-V5.md) |

## Technical achievements

- Confirmed V1 and V2 at runtime on **both** debug and release-equivalent
  sanitizer builds, demonstrating they are not debug-build artifacts.
- Identified the V2 root cause as an interaction between integer wrap and
  release-build assert semantics.
- Produced a complete vendor report set (`REPORT-main.md` + V1/V2
  sub-reports) ready for the GHSA process.

## Testing and verification

- Both verification builds completed with recorded configure/make logs.
- All PoCs executed locally with verbatim timestamped runtime outputs
  archived per finding.
- No upstream test suite runs were part of this project's record; patches
  were not the focus (findings documented for vendor remediation).

## Remediation and upstream status

All findings were unpatched at the audited commit. Remediation approaches
are proposed per finding report. No researcher patches were validated
against upstream tests in this project.

## Responsible disclosure status

Vendor report set prepared and **not yet submitted**. Recommended channel:
GitHub security advisory process (GHSA → CVE via the PHP CNA) for V1 and V2.
Details: [../../findings/DISCLOSURE-STATUS.md](../../findings/DISCLOSURE-STATUS.md).

## References

- php-src repository: <https://github.com/php/php-src>
- PHP security policy: <https://github.com/php/php-src/security/policy>
