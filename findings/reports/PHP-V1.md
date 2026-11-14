# PHP-V1 — Out-of-bounds read in `mb_regex_substitute()` (`mb_ereg_replace()`)

| Field | Value |
| --- | --- |
| Finding ID | PHP-V1 |
| Status | Confirmed (runtime, two build configurations) |
| Affected software | PHP (php-src) |
| Affected version | 8.7.0-dev upstream master @ `251fe77296acf8c689d2a657fa3805371dc506b1` (2026-10-24) |
| Affected component | `ext/mbstring` — `mb_regex_substitute()`, reached via `mb_ereg_replace()` / `mb_eregi_replace()` |
| Source location | `ext/mbstring/php_mbregex.c` (replacement-string walk, ≈lines 735–740) |
| Classification | CWE-125 out-of-bounds read / CWE-908 uninitialized information disclosure |
| Proposed severity | High — CVSS 3.1 proposed 7.5 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N) |
| Upstream status | Unpatched at the audited commit; vendor report prepared, not yet submitted |
| Disclosure status | Confidential vendor report prepared; not submitted |

> **Redaction notice.** This is a public, redacted version of a vendor-ready
> report. Because the issue is unpatched and not yet coordinated, the
> reproduction one-liner, trigger byte sequences, and grooming details are
> withheld. The full report is preserved in the private research archive.

## Technical summary

In `mb_regex_substitute()`, the replacement-string walk consults the
mbfl character-length table of the current regex encoding to decide how many
bytes belong to the next character. When a replacement string ends in a
**truncated multi-byte lead byte**, the computed character length exceeds the
remaining buffer, and the copy helper appends that many bytes past the end of
the replacement `zend_string` into the function result.

Notably, the subject argument's encoding is validated by the calling
`mb_ereg_replace()` implementation, but the **replacement argument is never
encoding-validated**.

The over-read bytes are copied directly into userland-visible output, making
this an information leak with attacker-chosen, groomable contexts.

## Root cause

- The loop copies `clen` bytes where `clen` comes from
  `php_mb_mbchar_bytes(p, enc)` without clamping to the end of the
  replacement string (`eos`).
- The guard condition only treats an ASCII backslash specially; any
  non-backslash byte — including a truncated multi-byte lead byte at the
  buffer tail — is copied with the table-derived length.
- This is the same defect class as a then-recent upstream mbstring over-read
  fix, but here the over-read bytes flow into the return value.

## Security impact

- Heap bytes beyond the replacement string are disclosed in the function
  result; content depends on heap layout and is influenceable via grooming.
- Reachable from pure userland PHP in default builds with mbstring enabled.
- Reproduced in both a debug+ASan build and a release NTS+ASAN build
  (matching distro shipping semantics), so it is not a debug-only artifact.

## Verification methodology

1. Built php-src from the pinned commit twice: debug with AddressSanitizer
   and release NTS with AddressSanitizer (gcc 16.2).
2. Confirmed the defect at runtime: a 1-byte replacement input produced a
   result longer than the input, containing uninitialized bytes past the
   allocation.
3. Verified under ASan that the read is out of bounds of the replacement
   buffer, and that the result contains non-input bytes.
4. Evidence (verbatim timestamped runtime outputs) archived with the finding.

## Proposed remediation

Clamp the copy length to the remaining buffer in the replacement walk, and
encoding-validate the replacement argument at the call boundary, consistent
with the subject validation.

## Upstream / disclosure status

- Not fixed at the audited commit; no public advisory known to the research
  at audit time.
- The complete vendor report (with PoC, sanitizer evidence, and proposed
  CVSS vector) is prepared for submission through the PHP security advisory
  process once coordination begins.
- No CVE identifier is claimed or reserved.

## References

- Original research record: `PHP/V1-mbregex-oob-read/` (private archive)
- Related upstream fix class: mbstring over-read fix in php-src history
  (referenced in the full report)
