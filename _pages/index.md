---
layout: default
permalink: /
title: Security Research — Independent Security Research & Open-Source Software Auditing
---

# Security Research

**Independent Security Research & Open-Source Software Auditing**

This site presents the documentation portfolio of an independent security
research program focused on source-code auditing of widely deployed
open-source software. Every finding originates from a real, locally
performed research project on a pinned source revision, verified with
reproducible evidence. No finding is fictional; no severity or disclosure
outcome is claimed beyond what the research record supports.

## Research statistics

Statistics are derived strictly from the research records (audit dates
2026-10-24 through 2026-11-14):

| Metric | Count |
| --- | --- |
| Completed research projects | 5 |
| Confirmed findings | 11 |
| Potential findings | 5 |
| Informational observations | 3 |
| Findings already fixed upstream at audit time | 2 |
| Vendor reports prepared (not yet submitted) | 5 |
| CVE identifiers claimed | 0 |

*Completed projects* counts audits brought to a documented conclusion —
not a count of vulnerabilities. Each confirmed finding is documented
individually with its own evidence basis.

## Featured projects

| Project | Version audited | Confirmed findings |
| --- | --- | --- |
| [PHP]( {{ '/projects/php/' | relative_url }} ) | 8.7.0-dev master | 3 (2 High, 1 Low) |
| [OpenSSL]( {{ '/projects/openssl/' | relative_url }} ) | 4.2.0-dev master | 1 (Medium) |
| [OpenSSH]( {{ '/projects/openssh/' | relative_url }} ) | V_10_6_P1 | 1 Low + 1 informational |
| [xrdp]( {{ '/projects/xrdp/' | relative_url }} ) | v0.10.6.1 | 7 (2 already fixed upstream) |
| [Node.js]( {{ '/projects/nodejs/' | relative_url }} ) | HEAD v28.0.0-pre | 1 (High, proposed) |

## About the findings published here

None of the findings has been submitted to a vendor yet, so public reports
are deliberately redacted — root cause, impact scope, and verification
methodology are described, but exploitation material for unpatched issues
is withheld. See the [findings overview]( {{ '/findings/' | relative_url }} )
and the [methodology]( {{ '/methodology/' | relative_url }} ).

The complete documentation — per-finding reports, project archives, and
disclosure status — lives in the
[GitHub repository](https://github.com/{{ site.github_username }}/Security-Researches).
