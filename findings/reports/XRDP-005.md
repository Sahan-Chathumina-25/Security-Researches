# XRDP-005 — libxrdp: drdynvc reassembly buffer allocated from unbounded client length

| Field | Value |
| --- | --- |
| Finding ID | XRDP-005 (candidate CB-05) |
| Status | **Confirmed** (ASan) |
| Affected software | xrdp |
| Affected version | v0.10.6.1 @ `80c52879fead585d6347df5b3c587718adf8f5a5` |
| Affected component | `libxrdp/xrdp_channel.c` — `xrdp_channel_process_drdynvc()` first-chunk handling (≈lines 562–586) |
| Classification | CWE-770 unbounded resource allocation (memory-exhaustion DoS); potential CWE-476 if the allocator later behaves unrecoverably |
| Proposed severity | Medium (availability) — CVSS v4 vector proposed: AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:H/SC:N/SI:N/SA:N |
| Upstream status | The audited release allocates the client-supplied length unchecked; upstream master's dechunker moves this into a checked failure mode but still allocates the declared total size unchecked |
| Disclosure status | Vendor report prepared; **not submitted** — details redacted |

> **Redaction notice.** Public, redacted version. The harness construction
> and exact field values are withheld while the issue is unpatched.

## Technical summary

When a dynamic virtual-channel message arrives split across chunks, the
first chunk declares a 32-bit total length that is used directly to size the
reassembly buffer — with no cap. A client can therefore request an
arbitrarily large allocation per connection. In the audited release a
subsequent remaining-bytes check prevents a NULL-pointer write, so the
consequence is memory exhaustion: the connection child pins the oversized
buffer until the next first chunk or teardown, and on multi-session hosts
the pressure scales with concurrent connections.

## Reachability and impact

- Pre-auth reachability (connection child, no credentials required).
- Demonstrated under a sanitizer allocation cap: an attacker-chosen
  multi-hundred-megabyte allocation is driven directly by the declared
  total length.

## Verification methodology

1. ASan-instrumented channel harness sending a first-chunk message with an
   oversized declared total; ASan reports allocation-size-too-big at the
   allocation site.
2. Research hardening patch validated: oversized totals are rejected, and
   the unit suite passes (213/213).

## Proposed remediation

Cap the declared total length at a sane maximum and verify allocation
success before use.

## References

- Original research record: `xrdp/reports/findings/XRDP-005.md` (private archive)
