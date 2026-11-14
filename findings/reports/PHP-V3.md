# PHP-V3 — WHATWG `context` validation property uses unbounded `strlen()` on interior pointers

| Field | Value |
| --- | --- |
| Finding ID | PHP-V3 |
| Status | Potential (partially confirmed) |
| Affected software | PHP (php-src) |
| Affected version | 8.7.0-dev upstream master @ `251fe77296acf8c689d2a657fa3805371dc506b1` (2026-10-24) |
| Affected component | `ext/uri` — WHATWG URL parser validation error reporting |
| Source location | `ext/uri/uri_parser_whatwg.c` (≈lines 161–176 and 1150–1160) |
| Classification | Incorrect disclosure surface / latent OOB `strlen` |
| Proposed severity | Low (hardening) |
| Upstream status | Unpatched at the audited commit |
| Disclosure status | Documented in the vendor report set; not yet submitted |

## Technical summary

The WHATWG parser's validation-error helper writes a `context` property
describing the component in which the error occurred. The helper derives the
context by scanning from an interior component pointer with `strlen()`
instead of a bounded span, so an emitted context can cover the wrong range
of the input.

## Root cause

- The context value is computed from a pointer into the middle of the input
  without a length bound tied to the component's actual extent.

## Observed behavior (partial confirmation)

- Wrong-range contexts were observed at runtime in validation-error output —
  i.e. the observable validation data can be corrupted.
- No memory-safety violation was demonstrated; whether a hostile input can
  push the scan past a buffer boundary depends on NUL-termination
  guarantees of the surrounding parser state, which remains to be analyzed
  across all validation classes.

## Verification methodology

- Runtime observation of validation-error output on the built parser for
  inputs that trigger error reporting (details withheld while unpatched).
- Static review of the helper and its call sites.

## Proposed remediation

Compute the `context` property from the component's bounded span rather
than an unbounded `strlen()` over an interior pointer.

## Upstream / disclosure status

Not fixed at the audited commit. Documented as a hardening finding in the
prepared vendor report set; reachability across all validation classes is
pending further analysis.

## References

- Original research record: `PHP/V3-V5-minor/whatwg-context/` (private archive)
