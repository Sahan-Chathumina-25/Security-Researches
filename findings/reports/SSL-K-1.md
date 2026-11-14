# SSL-K-1 — `OPENSSL_assert` on key length can abort the process with a custom provider

| Field | Value |
| --- | --- |
| Finding ID | SSL-K-1 (recorded as K-1) |
| Status | **Unconfirmed** (not reproduced) |
| Affected software | OpenSSL |
| Affected version | upstream master @ `5dbd6501ee6c07c8a397df5c979743c05d775603` (4.2.0-dev) |
| Affected component | libcrypto — `crypto/evp/p5_crpt2.c` |
| Classification | Config-dependent local availability (assert abort) |
| Proposed severity | Low (~2.1, config-dependent) |
| Upstream status | Unpatched at the audited commit |
| Disclosure status | Documented in the research archive; verification pending |

## Technical summary

The PBKDF2-adjacent key-derivation path contains an internal invariant
assertion on the derived key length. An application that accepts untrusted
provider configurations could have a custom provider return a key length
that violates the invariant, making the assertion (an abort, not an error
return) reachable.

## Impact

- Availability of the calling process, in configurations that accept
  custom provider configurations; not reachable through default provider
  paths based on the audit's screening.

## Verification status

- **Unconfirmed.** No runtime reproduction was performed; verifying requires
  a custom provider setup that exceeds the invariant, plus a check whether
  any default provider path can produce an oversized key.

## Proposed remediation

Replace the internal assert with a proper error return and add fuzz/CI
coverage for provider-driven key-length inputs.

## References

- Original research record: `OpenSSL/research/findings/unconfirmed/K-1-p5crpt2-assert-abort.md` (private archive)
