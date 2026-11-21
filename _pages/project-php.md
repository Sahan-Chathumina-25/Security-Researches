---
description: "PHP (php-src) 8.7.0-dev audit: 3 confirmed findings (2 High, 1 Low); PHP-V2 disclosed as CVE-2026-129438 (Moderate, fixed in 8.5.13)."
layout: project
permalink: /projects/php/
title: PHP (php-src) 8.7.0-dev
eyebrow: Project 01
short_name: PHP
lede: Audit of the PHP interpreter's upstream development tree, with runtime verification on two locally built binaries.
---

**Audit of the PHP interpreter's upstream development tree, with runtime
verification on two locally built binaries.**

| Field | Value |
| --- | --- |
| Version audited | 8.7.0-dev upstream master @ `251fe77296acf8c689d2a657fa3805371dc506b1` |
| Audit date | 2026-10-24 |
| Status | Audit and runtime confirmation complete; PHP-V2 disclosed as **CVE-2026-129438** |
| Confirmed findings | 3 (2 High, 1 Low) + 1 partially confirmed + 1 static-only |
| Vendor report | PHP-V2 published ([GHSA-mg3p-mxj9-g2mm](https://github.com/php/php-src/security/advisories/GHSA-mg3p-mxj9-g2mm#event-1404536)); remaining reports prepared |

## Scope

`ext/mbstring` (regex replacement), `ext/uri` (RFC 3986 and WHATWG parsers),
`ext/bcmath` (rounding), and `ext/standard/url_scanner_ex.c` — all reachable
from plain userland PHP with no extension loading.

## Findings

| ID | Finding | Status | Proposed severity |
| --- | --- | --- | --- |
| PHP-V1 | OOB read in `mb_regex_substitute()` (`mb_ereg_replace()`) — truncated multi-byte lead byte in the replacement copies uninitialized heap bytes into the result | Confirmed (runtime); advisory [GHSA-hg3p-r5r9-76r6](https://github.com/php/php-src/security/advisories/GHSA-hg3p-r5r9-76r6) marked duplicate | High (7.5) |
| PHP-V2 | RFC 3986 recomposition integer wrap + suppressed `uriToStringA` failure (release-build UB) → `zend_string` of length `INT_MAX` returned completely uninitialized | Confirmed (runtime); disclosed as **CVE-2026-129438** (Moderate, CVSS 6.3, fixed in 8.5.13) | High (5.9–7.4) proposed |
| PHP-V3 | WHATWG `context` property uses unbounded `strlen()` on interior pointers | Partially confirmed | Low |
| PHP-V4 | `bcround()` with `PHP_INT_MIN` precision → uncatchable ~9.2 EB allocation fatal | Confirmed (runtime) | Low (3.7) |
| PHP-V5 | `url_scanner_ex.c` cross-allocation separator guard | Static review only | Low |

## Verification

Two builds of the pinned tree: debug + AddressSanitizer, and release NTS +
AddressSanitizer (`ZEND_DEBUG 0`, matching distro shipping semantics) —
confirming the defects are not debug-build artifacts. All PoCs executed
locally with verbatim timestamped outputs archived.

## Upstream status

PHP-V2 was submitted through the PHP security advisory process and
published on 2026-11-19 as
[GHSA-mg3p-mxj9-g2mm](https://github.com/php/php-src/security/advisories/GHSA-mg3p-mxj9-g2mm#event-1404536)
— **CVE-2026-129438**, Moderate (CVSS 6.3), CWE-190/CWE-252, affecting
PHP ≥ 8.5.0 and fixed in 8.5.13. The advisory filed for PHP-V1,
[GHSA-hg3p-r5r9-76r6](https://github.com/php/php-src/security/advisories/GHSA-hg3p-r5r9-76r6),
was marked duplicate. The remaining findings were unpatched
at the audited commit; their complete report set (`REPORT-main.md` plus
per-finding sub-reports) is prepared for the PHP security advisory
process (GHSA → CVE via the PHP CNA).

## Details in the repository

[projects/01-php](https://github.com/{{ site.github_username }}/Security-Researches/tree/main/projects/01-php)
·
[Finding reports](https://github.com/{{ site.github_username }}/Security-Researches/tree/main/findings/reports)
