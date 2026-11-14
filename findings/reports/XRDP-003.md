# XRDP-003 — cliprdr: capability-set length used for unchecked stream skip

| Field | Value |
| --- | --- |
| Finding ID | XRDP-003 (candidate CB-03) |
| Status | **Confirmed** (ASan) |
| Affected software | xrdp |
| Affected version | v0.10.6.1 @ `80c52879fead585d6347df5b3c587718adf8f5a5` |
| Affected component | `sesman/chansrv/clipboard.c` — `clipboard_process_clip_caps()` (≈lines 1374–1418) |
| Classification | CWE-125 out-of-bounds read / CWE-129 unvalidated pointer offset |
| Proposed severity | Low (availability, session-scoped) — CVSS v4 vector proposed: AV:N/AC:L/AT:N/PR:L/UI:N/VC:N/VI:N/VA:L/SC:N/SI:N/SA:N |
| Upstream status | Present in upstream master at audit time (verified at the `de20a7e4` state); not fixed |
| Disclosure status | Vendor report prepared; **not submitted** — details redacted |

> **Redaction notice.** Public, redacted version. The harness packet
> construction and exact field values are withheld while the issue is
> unpatched.

## Technical summary

In the clipboard capability-set parser, a client-supplied 16-bit capability
length is added to the stream pointer as an arbitrary skip distance after
parsing each capability set. There is no validation that the moved position
stays within the packet; the next loop iteration then parses from an
attacker-chosen in-buffer or out-of-buffer address.

## Reachability and impact

- Reachable by the RDP client on its own session's clipboard channel.
- Consequence: chansrv crash or repeatable over-read within the clipboard
  process. Availability, session-scoped.

## Verification methodology

1. ASan-instrumented clipboard harness replaying a crafted capability-set
   message; ASan reports an out-of-bounds read inside the capability parser
   on the second iteration.
2. Research hardening patch validated: crafted input is cleanly rejected,
   legitimate capability traffic still parses, and the unit suite passes
   (213/213).

## Proposed remediation

Reject capability-set lengths shorter than the fixed header or longer than
the remaining packet bytes before applying the skip.

## References

- Original research record: `xrdp/reports/findings/XRDP-003.md` (private archive)
