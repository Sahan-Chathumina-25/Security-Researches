---
description: "xrdp v0.10.6.1 full 12-phase audit: 7 confirmed findings (2 corresponding to already-fixed upstream CVEs) with validated fixes."
layout: project
permalink: /projects/xrdp/
title: xrdp v0.10.6.1
eyebrow: Project 04
short_name: xrdp
lede: Full 12-phase defensive source audit of the xrdp RDP server, producing seven validation-backed findings.
---

**Full 12-phase defensive source audit of the xrdp RDP server, producing
seven confirmed, validation-backed findings and validated fixes.**

| Field | Value |
| --- | --- |
| Version audited | v0.10.6.1 @ `80c52879fead585d6347df5b3c587718adf8f5a5` |
| Status | Full 12-phase audit complete; disclosure draft prepared |
| Confirmed findings | 7 (2 already fixed upstream, 5 new) |
| Vendor report | Prepared, not yet submitted |

## Scope

The complete network data path: transport → channel protocol → chansrv
protocol modules (sound/rdpsnd_rec, clipboard, audio-input, dynamic virtual
channels), across the listener, per-connection child, and per-session
helper.

## Findings

| ID | Component | Finding | Reachability | Upstream status |
| --- | --- | --- | --- | --- |
| XRDP-001 | chansrv/rdpsnd_rec | Unbounded capture-formats parse (OOB read) | session-user | **Fixed** (`de20a7e4`; CVE-2026-79928 family) |
| XRDP-002 | chansrv/rdpsnd_rec | Unchecked memcpy from client packet + unbounded FIFO | session-user | **Fixed** (CVE-2026-79936/-81169 family) |
| XRDP-003 | chansrv/cliprdr | Capability-set length used for unchecked stream skip | session-user | Not fixed |
| XRDP-004 | libxrdp/channel | Static-channel 8-byte header read without bounds check | pre-auth (connection child) | Not fixed |
| XRDP-005 | libxrdp/channel | drdynvc reassembly buffer from unbounded client length | pre-auth (connection child) | Not fixed |
| XRDP-006 | chansrv/audin | Formatchange client index unchecked as array index | session-user | Not fixed |
| XRDP-007 | chansrv/cliprdr | File-contents request size drives direct allocation | session-user | Not fixed |

## Verification highlights

- All seven confirmed with mechanical reproducers (ASan primary; Valgrind
  cross-check for three).
- Baseline unit suite green (213/213) before any audit work and after every
  patch; 0 compiler warnings.
- Research hardening patch (4 files) validated with functional sanity
  tests proving no legitimate behavior regressed; tree restored to pristine
  and re-verified (Phase 10).
- Impact honestly bounded: per-connection or per-session scope; no
  cross-session or pre-auth RCE identified.

## Upstream status

The rdpsnd_rec family corresponds to already-fixed upstream CVEs (the
removal fix was re-applied and validated during this research). The other
five findings are new and still present upstream at audit time; the
hardening patch is planned as an upstream PR if maintainers respond.

## Details in the repository

[projects/04-xrdp](https://github.com/{{ site.github_username }}/Security-Researches/tree/main/projects/04-xrdp)
·
[Finding reports](https://github.com/{{ site.github_username }}/Security-Researches/tree/main/findings/reports)
