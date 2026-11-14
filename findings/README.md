# Findings

This directory indexes the security-relevant results of the five completed
research projects. Every observation is categorized by its verification
status as recorded in the original research archive — confirmed, potential,
informational, or cleared as a false positive — and statuses are never
upgraded without new evidence.

## Contents

| File | Contents |
| --- | --- |
| [../FINDINGS-INDEX.md](../FINDINGS-INDEX.md) | Master index across all projects |
| [VERIFIED-FINDINGS.md](VERIFIED-FINDINGS.md) | Confirmed findings with proposed severity vectors |
| [POTENTIAL-FINDINGS.md](POTENTIAL-FINDINGS.md) | Probable, unconfirmed, and static-review findings |
| [INFORMATIONAL.md](INFORMATIONAL.md) | Verified defects without established security impact, and cleared false positives |
| [DISCLOSURE-STATUS.md](DISCLOSURE-STATUS.md) | Per-finding disclosure status and redaction policy |
| [reports/](reports/) | Individual finding reports (redacted while unpatched) |

## Redaction policy

Because **none** of the findings has been submitted to a vendor yet, the
public reports in `reports/` deliberately omit exploitation material:

- No proof-of-concept code, trigger inputs, or step-by-step reproduction
  commands for unpatched issues.
- No harness sources or packet constructions for unpatched issues.
- Root cause, affected component, impact scope, verification methodology,
  and proposed severity are described, because that information supports
  defensive understanding and vendor triage.

Full reports will be published after upstream fixes ship or advisories are
issued. The complete, unreproducible-public research record (PoC sources,
sanitizer logs, harnesses) is preserved in the private research archive.
