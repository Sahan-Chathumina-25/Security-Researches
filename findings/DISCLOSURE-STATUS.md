# Disclosure Status

Status of every finding with respect to vendor coordination, as recorded in
the research archive. **No finding has been submitted to any vendor yet.**
This page is the authoritative statement of what is safe to publish and why.

## Status summary

| Project | Vendor report | Submitted | Suggested channel | Date prepared |
| --- | --- | --- | --- | --- |
| PHP | `REPORT-main.md` + per-finding sub-reports | **No** | GitHub security advisory process (GHSA → PHP CNA) | 2026-10-24 |
| OpenSSL | CCM-1 vendor report (marked CONFIDENTIAL, NOT SUBMITTED) | **No** | OpenSSL security policy (openssl-security@ per official policy page) | 2026-11-05 |
| OpenSSH | Disclosure phases 9–12 pending; report content ready in findings | **No** | OpenSSH security contact | pending |
| xrdp | Vendor disclosure draft (excludes already-fixed family) | **No** | xrdp maintainer security contact / mailing list | November 2026 |
| Node.js | HackerOne-style report draft | **No** | Node.js security-interest lane (per Node SECURITY.md) | 2026-11-14 |

## Per-finding status

| ID | Upstream status | Public report | Redaction |
| --- | --- | --- | --- |
| PHP-V1 | Unpatched at audited commit | [redacted](reports/PHP-V1.md) | PoC one-liner and trigger byte sequences withheld |
| PHP-V2 | Unpatched at audited commit | [redacted](reports/PHP-V2.md) | PoC scripts and trigger construction withheld |
| PHP-V3 | Unpatched (partially confirmed) | [redacted](reports/PHP-V3.md) | trigger inputs withheld |
| PHP-V4 | Unpatched at audited commit | [redacted](reports/PHP-V4.md) | exact trigger call withheld |
| PHP-V5 | Static-only observation | [redacted](reports/PHP-V5.md) | code path detail summarized |
| SSL-CCM-1 | Unpatched at audited commit | [redacted](reports/SSL-CCM-1.md) | PoC sources and build recipe withheld; class and component described |
| SSL-D-1 / SSL-Q-1 / SSL-ASN-1 | Probable | [redacted](reports/SSL-D-1.md) [SSL-Q-1](reports/SSL-Q-1.md) [SSL-ASN-1](reports/SSL-ASN-1.md) | analysis-level only |
| SSL-K-1 | Unconfirmed | [redacted](reports/SSL-K-1.md) | analysis-level only |
| OSSH-001 | Unpatched at audited tag | [redacted](reports/OSSH-001.md) | race-simulation harness details withheld |
| OSSH-002 | Unpatched at audited tag | [redacted](reports/OSSH-002.md) | macro-expansion proof summarized |
| XRDP-001 / XRDP-002 | **Fixed upstream** (CVE-2026-79928/-79936/-81169 family, commit `de20a7e4`) | [published](reports/XRDP-001.md) [published](reports/XRDP-002.md) | none required — upstream fixed and CVEs public |
| XRDP-003..XRDP-007 | Unpatched at audit time | [redacted](reports/XRDP-003.md) | harness packet constructions and exact field values withheld |
| NODE-FIND-001 | Unpatched; residual of CVE-2026-48934/58040 cluster | [redacted](reports/NODE-FIND-001.md) | reproduction script and fixture setup withheld |
| NODE-FIND-002 | N/A (false positive) | [published](reports/NODE-FIND-002.md) | none required |

## Rules applied

1. **No exploitation material for unpatched issues** — PoC code, trigger
   inputs, harness packet constructions, and step-by-step reproduction
   commands are withheld from public reports.
2. **No invented outcomes** — no CVE numbers are claimed, no vendor
   acknowledgements, patches, or disclosure results are asserted, and
   severity is always labeled "proposed / vendor triage pending".
3. **Preserved evidence** — the complete research record (PoCs, sanitizer
   logs, harnesses, vendor report drafts) is maintained in the private
   research archive and is available to vendors during coordination.
4. **Upgrade path** — full reports are published after upstream fixes ship
   or advisories are issued.

## Planned sequence

1. Submit each vendor report through the official security policy of the
   respective project (see [../RESEARCH-ROADMAP.md](../RESEARCH-ROADMAP.md)).
2. Coordinate a publication window per finding.
3. Update `DISCLOSURE-STATUS.md` and the individual reports to reflect the
   vendor's triage outcome and any assigned identifiers, with links to
   published advisories.
