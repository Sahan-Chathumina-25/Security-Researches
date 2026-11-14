# SSL-D-1 — DTLS 1.3 unified header with L bit clear mis-frames the record length

| Field | Value |
| --- | --- |
| Finding ID | SSL-D-1 (recorded as D-1) |
| Status | **Potential** (probable — deterministic from code, not runtime-verified) |
| Affected software | OpenSSL |
| Affected version | upstream master @ `5dbd6501ee6c07c8a397df5c979743c05d775603` (4.2.0-dev) |
| Affected component | DTLS 1.3 record layer (`ssl/record/methods/dtls_meth.c`) |
| Classification | Protocol conformance / availability |
| Proposed severity | Low |
| Upstream status | Unpatched at the audited commit |
| Disclosure status | Documented in the research archive; runtime reproduction pending |

## Technical summary

When a DTLS 1.3 unified header has the L (length) bit clear, RFC 9147 §4.2
defines the record as consuming the entire rest of the datagram. The record
layer instead assigns the length of the *entire datagram held in the read
buffer*, including the bytes consumed by the record header itself.
Downstream length arithmetic then computes a positive residual for
additional bytes, so the receiver attempts to pull further bytes from the
read BIO — consuming or blocking on the next datagram into an already
oversized record, which then fails authentication and is dropped.

## Root cause

- In the L-bit-clear branch the length assignment takes the full buffer
  length rather than subtracting the header length before the record
  framing math.
- OpenSSL's own send side always sets the L bit, so the defect affects
  interop with conforming peers that omit the length field.

## Impact

- Interoperability and availability: a conforming peer's record can cause
  the following datagram to be consumed or the connection to stall; the
  failed record is discarded.

## Verification status

- Root cause confirmed from code reading; **not runtime-verified**.
  Reproduction requires a synthetic DTLS 1.3 peer that sends L-bit-clear
  records (the built-in test peers always set the L bit).

## Proposed remediation

Compute the record length for L-bit-clear headers as the remaining datagram
length minus the header length, keeping the downstream framing arithmetic
consistent.

## References

- RFC 9147 — DTLS 1.3 (unified header, §4.2)
- Original research record: `OpenSSL/research/findings/probable/D-1-dtls13-lbit-record-framing.md` (private archive)
