# SSL-ASN-1 — `ASN1_STRING_copy` propagates the not-owned flag onto owned data

| Field | Value |
| --- | --- |
| Finding ID | SSL-ASN-1 (recorded as ASN-1) |
| Status | **Potential** (probable — logic confirmed by code trace; no attacker path today) |
| Affected software | OpenSSL |
| Affected version | upstream master @ `5dbd6501ee6c07c8a397df5c979743c05d775603` (4.2.0-dev) |
| Affected component | libcrypto — ASN.1 string handling (`crypto/asn1/asn1_lib.c`) |
| Classification | Internal API hygiene / retained-memory leak (cleanse bypass) |
| Proposed severity | Low |
| Upstream status | Unpatched at the audited commit |
| Disclosure status | Documented in the research archive |

## Technical summary

`ASN1_STRING_copy(dst, src)` first materializes the source data inside the
destination (a freshly allocated, owned buffer), then copies the source's
flags — including `ASN1_STRING_FLAG_DATA_NOT_OWNED`. The resulting string
has owned data flagged as non-owned: the free paths treat the data pointer
as borrowed and never free or cleanse it, so the buffer (which can contain
sensitive content such as certificate serial numbers or CMS signer
identifiers) is retained in heap memory.

## Root cause

- The ownership state is not reconciled after the copy: the data is copied
  into owned storage while the non-owned flag from the source is preserved.

## Impact

- Confidentiality hygiene: sensitive contents may persist in heap beyond
  the intended lifetime, bypassing the cleanse-on-free path.
- Availability: none.
- Reachability: requires a source string produced via the not-owned string
  constructor; no internal library caller currently produces such a source
  in an attacker-influenced path. Reachable by third-party consumers of the
  newer API or future internal use.

## Verification status

- Confirmed by code trace (ownership/flag flow); no runtime exploitation
  path exists today, so the finding is documented as probable.

## Proposed remediation

Reconcile the ownership flag in copy/duplicate: either clear
`DATA_NOT_OWNED` when the destination owns freshly allocated data, or
re-own/duplicate the source data when the flag is present.

## References

- Original research record: `OpenSSL/research/findings/probable/ASN-1-string-copy-owned-flag-leak.md` (private archive)
