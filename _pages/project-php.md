---
layout: default
permalink: /projects/php/
title: PHP (php-src) 8.7.0-dev
---

# PHP (php-src) 8.7.0-dev

**Audit of the PHP interpreter's upstream development tree, with runtime
verification on two locally built binaries.**

| Field | Value |
| --- | --- |
| Version audited | 8.7.0-dev upstream master @ `251fe77296acf8c689d2a657fa3805371dc506b1` |
| Audit date | 2026-10-24 |
| Status | Audit, runtime confirmation, and disclosure report complete |
| Confirmed findings | 3 (2 High, 1 Low) + 1 partially confirmed + 1 static-only |
| Vendor report | Prepared, not yet submitted |

## Scope

`ext/mbstring` (regex replacement), `ext/uri` (RFC 3986 and WHATWG parsers),
`ext/bcmath` (rounding), and `ext/standard/url_scanner_ex.c` — all reachable
from plain userland PHP with no extension loading.

## Findings

| ID | Finding | Status | Proposed severity |
| --- | --- | --- | --- |
| PHP-V1 | OOB read in `mb_regex_substitute()` (`mb_ereg_replace()`) — truncated multi-byte lead byte in the replacement copies uninitialized heap bytes into the result | Confirmed (runtime) | High (7.5) |
| PHP-V2 | RFC 3986 recomposition integer wrap + suppressed `uriToStringA` failure (release-build UB) → `zend_string` of length `INT_MAX` returned completely uninitialized | Confirmed (runtime) | High (5.9–7.4) |
| PHP-V3 | WHATWG `context` property uses unbounded `strlen()` on interior pointers | Partially confirmed | Low |
| PHP-V4 | `bcround()` with `PHP_INT_MIN` precision → uncatchable ~9.2 EB allocation fatal | Confirmed (runtime) | Low (3.7) |
| PHP-V5 | `url_scanner_ex.c` cross-allocation separator guard | Static review only | Low |

## Verification

Two builds of the pinned tree: debug + AddressSanitizer, and release NTS +
AddressSanitizer (`ZEND_DEBUG 0`, matching distro shipping semantics) —
confirming the defects are not debug-build artifacts. All PoCs executed
locally with verbatim timestamped outputs archived.

## Upstream status

All findings were unpatched at the audited commit. The complete report set
(`REPORT-main.md` plus per-finding sub-reports) is prepared for the PHP
security advisory process (GHSA → CVE via the PHP CNA).

## Details in the repository

[projects/01-php](https://github.com/{{ site.github_username }}/Security-Researches/tree/main/projects/01-php)
·
[Finding reports](https://github.com/{{ site.github_username }}/Security-Researches/tree/main/findings/reports)
