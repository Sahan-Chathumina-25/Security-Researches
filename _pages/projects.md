---
description: "Five completed source-code audits: PHP, OpenSSL, OpenSSH, xrdp, and Node.js — versions audited, confirmed findings, and verification highlights."
layout: default
permalink: /projects/
title: Projects
eyebrow: Research projects
lede: Five completed research projects, each performed against a pinned upstream revision.
---

Five completed research projects. Each was performed against a pinned
upstream revision, verified dynamically where possible, and closed with a
prepared vendor report. Full project archives are in the
[repository](https://github.com/{{ site.github_username }}/Security-Researches/tree/main/projects).

## 01 — PHP (php-src)

- **Version audited:** 8.7.0-dev master @ `251fe7729` (2026-10-24)
- **Status:** audit, runtime confirmation, and disclosure report complete
- **Confirmed findings:** 3 (V1 High, V2 High, V4 Low) + 1 partially
  confirmed + 1 static-only
- **Highlights:** OOB read in `mb_ereg_replace()` replacement walk; RFC 3986
  recomposition integer wrap returning an uninitialized 2 GiB string;
  uncatchable bcmath allocation fatal
- [Project page]( {{ '/projects/php/' | relative_url }} )

## 02 — OpenSSL

- **Version audited:** 4.2.0-dev master @ `5dbd6501e` (2026-11-04)
- **Status:** audit, PoC verification, patch validation, full test-suite
  run complete
- **Confirmed findings:** 1 (CCM IV-parameter OOB heap read, Medium,
  patch-validated)
- **Highlights:** two independent ASan reproductions; two-line fix validated
  against the full official test suite; 17 false positives cleared
- [Project page]( {{ '/projects/openssl/' | relative_url }} )

## 03 — OpenSSH

- **Version audited:** Portable `V_10_6_P1` @ `a8c72b842` (November 2026)
- **Status:** phases 1–8 complete; disclosure preparation pending
- **Confirmed findings:** 1 Low (statically proven portability defect) + 1
  verified informational
- **Highlights:** defects found in the 10.6-new agent socket manager;
  upstream regression suite 489/489; defects verified under Valgrind and
  MemorySanitizer
- [Project page]( {{ '/projects/openssh/' | relative_url }} )

## 04 — xrdp

- **Version audited:** v0.10.6.1 @ `80c52879f`
- **Status:** full 12-phase audit; 213/213 unit tests before and after
  every patch
- **Confirmed findings:** 7 — two correspond to already-fixed upstream CVEs
  (CVE-2026-79928/-79936/-81169 family), five are new and still present
  upstream at audit time
- **Highlights:** validated research hardening patch (4 files); impact
  honestly bounded to per-connection/per-session scope
- [Project page]( {{ '/projects/xrdp/' | relative_url }} )

## 05 — Node.js

- **Version audited:** HEAD `67e45e4a` (v28.0.0-pre), comparison on v24.19.0
- **Status:** audit, mechanism reproduction on HEAD, severity assessment
- **Confirmed findings:** 1 (High — https Agent drops per-request
  `checkServerIdentity` overrides on session reuse when the agent carries a
  checker; residual of the CVE-2026-48934/58040 fix cluster)
- **Highlights:** reproduced on a freshly built HEAD binary with a control
  experiment; honest dedup analysis against the public CVE chain
- [Project page]( {{ '/projects/nodejs/' | relative_url }} )

---

Statistics and statuses are stated exactly as recorded in each project's
research documentation. See the
[findings overview]( {{ '/findings/' | relative_url }} ) for the
categorization rules.
