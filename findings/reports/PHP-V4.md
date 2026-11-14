# PHP-V4 — `bcround()` with `PHP_INT_MIN` precision causes an uncatchable allocation fatal

| Field | Value |
| --- | --- |
| Finding ID | PHP-V4 |
| Status | Confirmed (runtime) |
| Affected software | PHP (php-src) |
| Affected version | 8.7.0-dev upstream master @ `251fe77296acf8c689d2a657fa3805371dc506b1` (2026-10-24) |
| Affected component | `ext/bcmath` — `bcround()` / `BcMath\Number->round()` |
| Source location | `ext/bcmath/libbcmath/src/round.c` (≈lines 70–76) with `init.c` (≈lines 40–50) |
| Classification | CWE-400 uncontrolled resource consumption (uncatchable DoS) |
| Proposed severity | Low — CVSS 3.1 proposed 3.7 |
| Upstream status | Unpatched at the audited commit; vendor report prepared, not yet submitted |
| Disclosure status | Confidential vendor report prepared; not submitted |

> **Redaction notice.** Public, redacted version. The exact trigger call is
> withheld while the issue is unpatched; the full report is preserved in the
> private research archive.

## Technical summary

Calling bcmath rounding with the minimum representable integer as the
precision argument causes the internal size computation to negate
`PHP_INT_MIN` and be interpreted as an enormous unsigned allocation request
(≈9.2 exabytes). The request exceeds the hard memory limit and triggers the
process-bailing fatal path.

## Root cause

- The precision handling negates the signed value without range validation;
  the negation of `PHP_INT_MIN` cannot be represented as a positive
  `zend_long` and flows into a `size_t` allocation size.
- The resulting allocation failure is handled by the hard memory-limit
  bailout, which is **not catchable** as an `ErrorException` after bailout —
  terminating the request.

## Security impact

- A single userland call reliably terminates the request with no catchable
  error path. Impact is limited to the calling context (application-level
  availability); multi-tenant hosts are affected only to the extent of the
  caller's own request.
- The exact behavior was observed on the locally built binary of the audited
  commit: the allocation attempt is reported at ~9.2 EB and the process
  bails out.

## Verification methodology

- Runtime confirmation on the built php-src binary from the pinned commit;
  verbatim runtime output archived with the finding.

## Proposed remediation

Validate the precision argument range before size computation and reject
out-of-range values with a proper exception.

## Upstream / disclosure status

- Not fixed at the audited commit; documented in the prepared vendor report
  set as a low-severity defect. No CVE identifier is claimed or reserved.

## References

- Original research record: `PHP/V3-V5-minor/bcmath-round-dos/` (private archive)
