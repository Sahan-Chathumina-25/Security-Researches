# Responsible Disclosure

This document explains how research findings from this portfolio are
handled with respect to the affected projects. The current status of every
finding is maintained in
[../findings/DISCLOSURE-STATUS.md](../findings/DISCLOSURE-STATUS.md).

## Current state (important)

**No finding has been submitted to any vendor yet.** Every project's vendor
report is prepared and held confidentially. Consequently:

- No CVE identifiers are claimed, reserved, or implied.
- No vendor acknowledgements, patches, or advisory outcomes are asserted.
- Severity values are researcher proposals, explicitly subject to vendor
  triage.
- Public documentation in this repository is redacted: it describes root
  cause, impact scope, and verification methodology, but withholds PoC
  code, trigger inputs, harness packet constructions, and step-by-step
  reproduction details for unpatched issues.

## Why redact before submission

Publishing exploitation material for an unpatched issue before the vendor
has a fix (or a coordinated timeline) endangers users of the affected
software and undermines the coordination process. The research record —
PoCs, sanitizer logs, harnesses, and full vendor reports — is preserved
privately and is available to vendors during coordination.

## Intended channels

| Project | Channel (per official security policy) |
| --- | --- |
| PHP | GitHub security advisory process (GHSA → CVE via the PHP CNA) |
| OpenSSL | OpenSSL security report process |
| OpenSSH | OpenSSH security contact |
| xrdp | Maintainer security contact / security mailing list |
| Node.js | Node.js security reporting lanes (per SECURITY.md) |

The channel address is verified against the official policy page at
submission time, never assumed.

## Post-coordination handling

After a fix ships or an advisory is issued, the corresponding public
finding report is updated to full detail, and the disclosure status table
is updated with the vendor's outcome (accepted, disputed, fixed, or
out-of-scope) — recorded honestly in either direction.

## What is *not* done

- No automatic submission tools.
- No public "deadline" threats or disclosure pressure.
- No monetization claims, bounty claims, or payout references.
- No invented CVE numbers or CVSS presentation as authoritative.
