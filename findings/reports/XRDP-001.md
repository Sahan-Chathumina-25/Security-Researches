# XRDP-001 — rdpsnd_rec: unbounded capture-formats parse (heap over-read)

| Field | Value |
| --- | --- |
| Finding ID | XRDP-001 (candidate CB-01) |
| Status | **Confirmed** (ASan + Valgrind) |
| Affected software | xrdp |
| Affected version | v0.10.6.1 @ `80c52879fead585d6347df5b3c587718adf8f5a5` |
| Affected component | `sesman/chansrv/sound.c` — `sound_process_input_formats()` (≈lines 1630–1673) |
| Classification | CWE-125 out-of-bounds read |
| Proposed severity | Low (availability, session-scoped) — CVSS v4 vector proposed: AV:N/AC:L/AT:N/PR:L/UI:N/VC:N/VI:N/VA:L/SC:N/SI:N/SA:N |
| Upstream status | **Fixed upstream** — rdpsnd_rec removed in commit `de20a7e4` (CVE-2026-79928 family, which also cites CVE-2026-79936 and CVE-2026-81169) |
| Disclosure status | Corresponds to an already-fixed, publicly coordinated issue; documented as an independently rediscovered member of that family |

## Technical summary

The audio-input (recording) side of the chansrv sound channel parses the
client's format-negotiation message by iterating over a client-supplied
format count, reading fixed-size format records plus a variable tail with
**no bounds check against the end of the packet**. A crafted message causes
chansrv to read past the end of the heap buffer; the crash or adjacent-heap
exposure stays within the session user's own chansrv process.

## Reachability

- Reachable by the RDP client on its own session (the chansrv helper runs
  per-session as the logged-in user). Availability impact is session-scoped;
  no cross-session or pre-auth impact.

## Verification methodology

1. ASan-instrumented harness linking the unmodified vulnerable translation
   unit, replaying attacker-crafted wire-format packets.
2. Independent Valgrind memcheck cross-check on a statically linked build.
3. Upstream's removal patch was re-applied and validated: harness clean
   post-patch and the full unit suite passed (213/213).
4. ASan and Valgrind logs archived with the finding.

## Remediation and upstream status

- Upstream removed the rdpsnd_rec protocol entirely (commit `de20a7e4`),
  which is the correct resolution for this family.
- The fix was independently applied and validated during this research as
  part of Phase 9.

## References

- CVE-2026-79928 / CVE-2026-79936 / CVE-2026-81169 (rdpsnd_rec family)
- Original research record: `xrdp/reports/findings/XRDP-001.md` (private archive)
