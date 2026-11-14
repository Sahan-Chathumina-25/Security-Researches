# SSL-CCM-1 — CCM provider IV parameter getters perform out-of-bounds heap read

| Field | Value |
| --- | --- |
| Finding ID | SSL-CCM-1 (recorded as CCM-1 / C-1 in the research archive) |
| Status | **Confirmed** (ASan, two independent reproductions; patch-validated) |
| Affected software | OpenSSL |
| Affected version | upstream master @ `5dbd6501ee6c07c8a397df5c979743c05d775603` (4.2.0-dev, retrieved 2026-11-04) |
| Affected component | libcrypto — default provider, CCM cipher parameter getters (`ossl_ccm_get_ctx_params()`) |
| Source location | `providers/implementations/ciphers/ciphercommon_ccm.c` (IV/UPDATED_IV parameter blocks) |
| Classification | CWE-125 out-of-bounds read / CWE-908 information disclosure |
| Proposed severity | Medium — CVSS 3.1 proposed ≈5.9 (AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N); CVSS v4 estimate 6.9 |
| Upstream status | Unpatched at the audited commit; vendor report prepared, **not submitted** |
| Disclosure status | CONFIDENTIAL vendor report prepared; not submitted |

> **Redaction notice.** This is a public, redacted version of a
> confidential vendor report. The PoC sources, build recipe, and sanitizer
> logs are withheld while the issue is unpatched; the class, component, and
> impact are described to support defensive understanding and vendor triage.

## Technical summary

The CCM provider's IV and UPDATED_IV parameter getters validate that the
*actual* IV length fits inside the caller's buffer, but then copy **the
caller's buffer size** — not the IV length — out of a fixed 16-byte IV array
embedded in the provider context. For caller buffers larger than the
provider context allocation (416 bytes on x86-64, as measured), the copy
reads past the end of the heap allocation, disclosing heap-adjacent memory
into the application buffer.

## Root cause

- The copy length argument in the IV/UPDATED_IV parameter blocks is
  `p.iv->data_size` (caller buffer size) where the sibling GCM and generic
  cipher implementations pass `ctx->ivlen` — a consistent-inconsistency
  indicating a coding mistake rather than an API design decision.
- The preceding length check constrains the IV, not the copy.

## Attacker-influenced path

- Reachable through the documented public API
  (`EVP_CIPHER_CTX_get_original_iv()` / `EVP_CIPHER_CTX_get_updated_iv()`):
  any application retrieving the current IV with a defensive buffer larger
  than 16 bytes triggers the defect; buffers larger than the provider
  context allocation are heap reads beyond the allocation.
- The attacker does not control the buffer size; exploitation therefore
  depends on the application's buffer-size choice, which is reflected in the
  proposed complexity rating.
- Not reachable through the TLS record layer itself (record AEADs do not
  call these getters).

## Security impact

- Confidentiality: heap-adjacent memory beyond the provider context is
  copied into the application buffer; adjacent allocations can include other
  cryptographic contexts (keys, plaintexts), depending on heap layout.
- Availability: not a crash in release builds; fault-prone under hardened
  allocators/sanitizers.

## Verification methodology

1. ASan+UBSan build (gcc 16.2, no-asm) from the exact audited commit.
2. Two independent ASan reproductions through the public EVP API, with
   different caller buffer sizes (4096 and 262144 bytes), both reporting a
   heap-buffer-overflow READ originating in the CCM parameter getters, with
   the 416-byte provider context allocation identified as the source.
3. **Patch validation**: applying the proposed two-line fix (copy length =
   actual IV length in both parameter blocks) made both PoCs run clean, and
   the focused EVP test families passed on the sanitizer build; the full
   official `make tests` suite passed on the patched tree.
4. ASan logs archived with the finding.

## Proposed remediation

Two-line change: pass the provider's actual IV length as the copy length in
both the IV and UPDATED_IV parameter blocks. The candidate patch is archived
with the vendor report.

## Novelty and disclosure status

- No matching historical advisory identified during the audit's duplicate
  screening; status recorded as **undisclosed candidate**, explicitly *not*
  claimed as a zero-day and to be re-checked against upstream advisories
  before disclosure.
- The vendor report is marked CONFIDENTIAL / NOT SUBMITTED. Earliest
  affected released branch still needs maintainer-side version tracing.
- No CVE identifier is claimed or reserved.

## References

- Original research record: `OpenSSL/research/findings/confirmed/CCM-1-oob-read-get-iv-params.md` (private archive)
