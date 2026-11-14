# XRDP-007 — cliprdr file transfer: client-requested size drives a direct allocation

| Field | Value |
| --- | --- |
| Finding ID | XRDP-007 (candidate CB-07) |
| Status | **Confirmed** (ASan) |
| Affected software | xrdp |
| Affected version | v0.10.6.1 @ `80c52879fead585d6347df5b3c587718adf8f5a5` |
| Affected component | `sesman/chansrv/clipboard_file.c` — `clipboard_process_file_request()` (≈lines 612–641) → `clipboard_send_file_data()` (≈lines 495–577) |
| Classification | CWE-770 unbounded resource + CWE-190 integer-overflow corner |
| Proposed severity | Medium (availability) — CVSS v4 vector proposed: AV:N/AC:L/AT:N/PR:L/UI:N/VC:N/VI:N/VA:H/SC:N/SI:N/SA:N |
| Upstream status | Present in upstream master at audit time; not fixed |
| Disclosure status | Vendor report prepared; **not submitted** — details redacted |

> **Redaction notice.** Public, redacted version. The harness construction
> and exact request values are withheld while the issue is unpatched.

## Technical summary

In the clipboard file-contents request path, a client-supplied 32-bit
requested size is used directly to size an internal stream buffer, with no
cap and no limit on request repetition. A client can drive very large
allocations repeatedly, exhausting the memory of the session's chansrv.

There is also an integer-overflow corner: for requested values near the
maximum signed range, the buffer-size computation (size plus fixed header)
overflows negative; the allocator then skips the allocation and the
subsequent read uses a NULL buffer. In the audited release the read fails
safely (the OS rejects the NULL-buffer read), so no corruption was
demonstrated from that corner.

## Reachability and impact

- Reachable by the RDP client on its own session's clipboard channel.
- Availability: memory exhaustion of the session's chansrv, controlled by
  the client in size and repetition. Demonstrated under a sanitizer
  allocation cap with an attacker-chosen multi-hundred-megabyte request.

## Verification methodology

1. ASan-instrumented clipboard harness sending a file-contents request with
   an oversized requested size; ASan reports allocation-size-too-big at the
   direct allocation site.
2. Research hardening patch validated: oversized requests receive the
   protocol failure response, legitimate small reads still work, and the
   unit suite passes (213/213).

## Proposed remediation

Cap the requested size at a sane maximum and respond with the protocol
failure status for larger requests; also make the buffer-size computation
overflow-safe.

## References

- Original research record: `xrdp/reports/findings/XRDP-007.md` (private archive)
