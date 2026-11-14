# SSL-Q-1 — QUIC release-build assert off-by-one silently drops legal 20-byte DCID packets

| Field | Value |
| --- | --- |
| Finding ID | SSL-Q-1 (recorded as Q-1) |
| Status | **Potential** (probable — code-logic confirmed, not reproduced end-to-end) |
| Affected software | OpenSSL |
| Affected version | upstream master @ `5dbd6501ee6c07c8a397df5c979743c05d775603` (4.2.0-dev) |
| Affected component | QUIC record reception (`ssl/quic/quic_record_rx.c`) |
| Classification | Availability (release builds); assertion failure (debug builds) |
| Proposed severity | Low |
| Upstream status | Unpatched at the audited commit |
| Disclosure status | Documented in the research archive; runtime reproduction pending |

## Technical summary

The record-reception path validates the first-connection-ID match with
`ossl_assert(first_dcid->id_len < QUIC_MAX_CONN_ID_LEN)`. The maximum legal
QUIC connection ID length is 20 bytes (RFC 9000 §5.1), and
`QUIC_MAX_CONN_ID_LEN` is 20 — so the comparison should be `<=`. With the
strict `<`, a legal DCID of exactly 20 bytes fails the assertion.

In release builds (`NDEBUG`), `ossl_assert` degrades to a branch that simply
returns failure, so every coalesced packet in a datagram whose first packet
carries a 20-byte DCID is **silently dropped**; debug builds abort via the
assertion.

## Root cause

- Off-by-one in the comparison operator; a sibling code path (the qlog
  module) correctly uses `<=` for the same class of check, confirming the
  inconsistency.

## Impact

- Availability: a conforming remote peer using 20-byte DCIDs cannot
  communicate (all packets dropped) in release builds.

## Verification status

- Deterministic from code reading; not reproduced end-to-end (requires a
  QUIC handshake harness with a 20-byte DCID).

## Proposed remediation

Change the comparison to `<=` for the connection-ID length check.

## References

- RFC 9000 — QUIC transport (connection IDs, §5.1)
- Original research record: `OpenSSL/research/findings/probable/Q-1-quic-dcid-20byte-drop.md` (private archive)
