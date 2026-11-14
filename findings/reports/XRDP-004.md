# XRDP-004 — libxrdp: static-channel header read without the bounds check

| Field | Value |
| --- | --- |
| Finding ID | XRDP-004 (candidate CB-04) |
| Status | **Confirmed** (ASan + Valgrind) |
| Affected software | xrdp |
| Affected version | v0.10.6.1 @ `80c52879fead585d6347df5b3c587718adf8f5a5` |
| Affected component | `libxrdp/xrdp_channel.c` — `xrdp_channel_process()` (≈lines 703–704) |
| Classification | CWE-125 out-of-bounds read |
| Proposed severity | Low (availability + chunk-tail exposure; typically pre-credential reachability during connection setup) — CVSS v4 vector proposed: AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:L/SC:N/SI:N/SA:N |
| Upstream status | Present in upstream master at audit time; the sibling dynamic-channel path has the check, the static path does not |
| Disclosure status | Vendor report prepared; **not submitted** — details redacted |

> **Redaction notice.** Public, redacted version. The harness construction
> is withheld while the issue is unpatched.

## Technical summary

The static virtual-channel processing path reads the 8-byte channel PDU
header directly from the stream without the remaining-bytes check that the
dynamic (drdynvc) path performs for the identical header. A truncated MCS
chunk causes up to 8 bytes to be read past the packet boundary; the values
flow into the channel callback as length/flags and can drive further
misparse.

## Reachability and impact

- Requires an established virtual-channel stage, typically reachable with
  pre-credential input during connection setup (the connection child).
- Practical impact is low: availability plus limited information exposure
  at chunk tails; no cross-session effect.

## Verification methodology

1. ASan-instrumented channel harness replaying a truncated static-channel
   payload; ASan reports an out-of-bounds read inside the header parse.
2. Independent Valgrind memcheck cross-check.
3. Research hardening patch validated: the same bounds check as the dynamic
   path rejects the input; post-patch harness clean and unit suite passes
   (213/213).

## Proposed remediation

Apply the same remaining-bytes check used by the dynamic-channel path
before reading the header.

## References

- MS-RDPBCGR — channel PDU header definition
- Original research record: `xrdp/reports/findings/XRDP-004.md` (private archive)
