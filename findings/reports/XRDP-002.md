# XRDP-002 — rdpsnd_rec: unchecked memcpy from client packet + unbounded FIFO (heap over-read)

| Field | Value |
| --- | --- |
| Finding ID | XRDP-002 (candidate CB-02) |
| Status | **Confirmed** (ASan) |
| Affected software | xrdp |
| Affected version | v0.10.6.1 @ `80c52879fead585d6347df5b3c587718adf8f5a5` |
| Affected component | `sesman/chansrv/sound.c` — `sound_process_input_data()` (≈lines 1745–1766) |
| Classification | CWE-125 out-of-bounds read + CWE-770 unbounded resource |
| Proposed severity | Low (availability + in-session exposure) — CVSS v4 vector proposed: AV:N/AC:L/AT:N/PR:L/UI:N/VC:L/VI:N/VA:L/SC:N/SI:N/SA:N |
| Upstream status | **Fixed upstream** — rdpsnd_rec removed in commit `de20a7e4` (CVE-2026-79936/-81169 family) |
| Disclosure status | Corresponds to an already-fixed, publicly coordinated issue; documented as an independently rediscovered member of that family |

## Technical summary

The recording-data handler copies a client-declared body size from the
packet into a FIFO buffer without validating that many bytes are actually
present in the packet — reading past the packet boundary by up to the
maximum body size. The copy over-read is delivered into the audio output
path of the same session. Additionally, a FIFO size cap present in the
source is compiled out, allowing unbounded FIFO growth.

## Reachability and impact

- Reachable by the RDP client on its own session.
- Heap over-read copied into the session's own audio path (in-session
  exposure) plus potential chansrv crash with far-overrun values, and
  memory-pressure growth from the FIFO.

## Verification methodology

1. ASan-instrumented harness replaying a crafted data message; ASan reports
   an out-of-bounds READ inside the copy path.
2. Upstream's removal patch validated post-patch (harness clean; unit suite
   213/213).

## Remediation and upstream status

- Fixed upstream by removing the rdpsnd_rec extension (commit `de20a7e4`).

## References

- CVE-2026-79936 / CVE-2026-81169 (rdpsnd_rec family)
- Original research record: `xrdp/reports/findings/XRDP-002.md` (private archive)
