# XRDP-006 — audin: formatchange message uses client index unchecked as array index

| Field | Value |
| --- | --- |
| Finding ID | XRDP-006 (candidate CB-06) |
| Status | **Confirmed** (ASan + Valgrind) |
| Affected software | xrdp |
| Affected version | v0.10.6.1 @ `80c52879fead585d6347df5b3c587718adf8f5a5` |
| Affected component | `sesman/chansrv/audin.c` — `audin_process_format_change()` (≈lines 356–368) → `audin_send_open()` (≈lines 199–215) |
| Classification | CWE-129 improper array index validation → CWE-125/476 out-of-bounds dereference |
| Proposed severity | Low (availability, session-scoped) — CVSS v4 vector proposed: AV:N/AC:L/AT:N/PR:L/UI:N/VC:N/VI:N/VA:L/SC:N/SI:N/SA:N |
| Upstream status | Present in upstream master at audit time; not fixed |
| Disclosure status | Vendor report prepared; **not submitted** — details redacted |

> **Redaction notice.** Public, redacted version. The harness sequence and
> index values are withheld while the issue is unpatched.

## Technical summary

The audio-input channel stores a client-supplied 32-bit format index from a
format-change message without validating it against the negotiated format
array. Later, when the server sends its open message, that index is used
directly to dereference the client-format table — an out-of-bounds pointer
dereference (negative values are possible because the 32-bit value is
decoded into a signed integer).

The source comment claims the referenced fields "were checked when the
format was received", which is incorrect for the format-change path.

## Reachability and impact

- Requires the audio-input virtual channel; the attacker is the RDP client
  on its own session.
- Out-of-bounds dereference crashes the session's chansrv; when the deref
  lands on readable memory, bogus fields are echoed into the open message
  on the same session.

## Verification methodology

1. ASan-instrumented audio-input harness driving a format negotiation
   followed by a crafted format-change message and a re-send of formats;
   ASan reports a heap-buffer-overflow read inside the open-message builder.
2. Independent Valgrind memcheck cross-check (invalid read; process
   segfaulted as expected).
3. Research hardening patch validated: the index is validated into a local
   and applied only when in range; the post-patch harness shows the message
   rejected and the global state not poisoned; unit suite passes (213/213).

## Proposed remediation

Validate the format index against the negotiated format count before any
use, and reject out-of-range format-change messages.

## References

- Original research record: `xrdp/reports/findings/XRDP-006.md` (private archive)
