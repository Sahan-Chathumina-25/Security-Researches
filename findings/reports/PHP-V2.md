# PHP-V2 — RFC 3986 recomposition integer wrap + suppressed engine error → uninitialized `zend_string`

| Field | Value |
| --- | --- |
| Finding ID | PHP-V2 |
| Status | Confirmed (runtime) |
| Affected software | PHP (php-src) |
| Affected version | 8.7.0-dev upstream master @ `251fe77296acf8c689d2a657fa3805371dc506b1` (2026-10-24) |
| Affected component | `ext/uri` — RFC 3986 parser glue (`uri_parser_rfc3986.c`) and the bundled uriparser engine (`UriRecompose.c`) |
| Source location | `ext/uri/uri_parser_rfc3986.c` (≈lines 751–758) and `ext/uri/uriparser/src/UriRecompose.c` |
| Classification | CWE-190 integer overflow / CWE-908 uninitialized information disclosure / release-build UB |
| Proposed severity | High — CVSS 3.1 proposed 5.9–7.4 depending on configuration (requires `memory_limit=-1` runtime conditions) |
| Upstream status | Unpatched at the audited commit; vendor report prepared, not yet submitted |
| Disclosure status | Confidential vendor report prepared; not submitted |

> **Redaction notice.** This is a public, redacted version of a vendor-ready
> report. The PoC scripts, trigger construction, and exact runtime commands
> are withheld because the issue is unpatched. The full report is preserved
> in the private research archive.

## Technical summary

Two interacting defects in the URI recomposition path:

1. **Integer wrap** — `uriToStringCharsRequiredA()` computes the required
   output size with an incrementing counter that wraps when the composition
   length reaches `INT_MAX`.
2. **Suppressed engine error** — the `uriToStringA()` failure return is
   swallowed behind `ZEND_ASSERT`, which compiles away in release builds via
   `__builtin_unreachable`, producing undefined behavior instead of an
   error path.

Net effect: a `zend_string` of length `INT_MAX` (2,147,483,647) can be
returned to userland with **zero bytes written by the engine** — completely
uninitialized memory.

## Root cause

- The glue code trusts the required-length computation and treats engine
  failure as impossible (assert-only handling), inconsistent with release
  builds where asserts vanish.
- The wrapped counter then sizes the destination `zend_string` at
  `INT_MAX`; the copy loop never executes because the engine reported
  failure, and the failure is never propagated.

## Security impact

- A userland caller can obtain a fully uninitialized multi-gigabyte PHP
  string, disclosing heap memory across the process.
- Requires a very large memory budget (`memory_limit=-1` and several GB of
  RAM), which is a mitigating but documented-possible configuration
  (e.g. batch processing environments).
- In release builds the suppressed error additionally introduces
  undefined behavior (unreachable assert path).

## Verification methodology

1. Release NTS + AddressSanitizer build of the pinned commit.
2. Runtime confirmation with two independent PoCs:
   an exact-wrap case demonstrating a result of length 2,147,483,647 with
   no engine-written bytes, and a partial-count case demonstrating the
   silent fall-through with a short uninitialized result.
3. Verbatim timestamped runtime outputs archived with the finding.

## Proposed remediation

- Validate the required-length computation against overflow before sizing
  the destination.
- Propagate `uriToStringA` failures as real errors instead of asserting them
  away in release builds.

## Upstream / disclosure status

- Not fixed at the audited commit; vendor report prepared for the PHP
  security advisory process. No CVE identifier is claimed or reserved.

## References

- Original research record: `PHP/V2-uri-rfc3986-intwrap/` (private archive)
- RFC 3986 (URI generic syntax) — recomposition semantics context
