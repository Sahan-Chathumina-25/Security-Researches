# Project 02 — OpenSSL 4.2.0-dev

## Project overview

A parallel deep-audit project against OpenSSL's upstream development tree
covering the main parsing and cryptography surfaces, with a confirmed,
ASan-verified, patch-validated memory-safety defect as the headline result.
Research period: 2026-11-04 → 2026-11-05.

## Software description

OpenSSL is the dominant TLS/crypto library; the audit targeted libcrypto
(ASN.1/X.509 parsing, EVP/provider parameters, BIO, PEM, CMS, PKCS12, OCSP,
TS) and the TLS/DTLS/QUIC layers of libssl.

## Audited version and commit

| Item | Value |
| --- | --- |
| Tree | OpenSSL upstream master |
| Commit | `5dbd6501ee6c07c8a397df5c979743c05d775603` |
| Version string | OpenSSL 4.2.0-dev |
| Retrieved | 2026-11-04 |

## Research objectives

- Audit recently expanded feature surfaces (DTLS 1.3, QUIC RX, provider
  cipher parameter handling) where integration slips are most likely.
- Use canonical-sibling comparison across provider implementations as a
  defect-finding signal.
- Achieve full patch validation against the official test suite for any
  confirmed finding.

## Research scope

Reviewed in depth: `crypto/asn1`, `crypto/x509` (incl. RFC 3779 and name
constraints), `ssl/record` (incl. DTLS 1.3), `ssl/statem`, `ssl/quic` RX and
validation, EVP and provider parameters, BIO, PEM, CMS, PKCS12, OCSP, TS,
and CLI apps (dgst, ca, s_client, s_server, speed). Scan-only: QUIC TXP
internals, FIPS module internals beyond registrations, ACVP tooling,
engines.

## Architecture overview

- The EVP/provider parameter system passes caller-supplied buffers and
  lengths into provider implementations — the boundary where the confirmed
  defect lives.
- DTLS 1.3 and QUIC are recent large feature surfaces with conformance-
  sensitive framing rules (RFC 9147, RFC 9000).

## Attack-surface analysis

- Public EVP APIs accepting application buffer sizes into provider
  parameter getters.
- Network-facing record parsing (TLS/DTLS/QUIC) driven by peer-controlled
  framing.
- ASN.1/X.509 decoding of untrusted certificates.

## Research methodology

Parallel deep audits of the main parsing/crypto surfaces; canonical-sibling
comparisons across provider implementations; clang scan-build triage (337
reports); ASan+UBSan builds; PoC reproduction through the public API; and
patch validation against the full official test suite.

## Tools and environment

GCC 16.2 (normal + ASan/UBSan builds, no-asm), clang 21 scan-build, gdb,
Valgrind available (not needed for the confirmed finding), OpenSSL official
test harness. Details: [../../TOOLS-AND-ENVIRONMENT.md](../../TOOLS-AND-ENVIRONMENT.md).

## Security findings

| ID | Title | Status | Severity (proposed) | Report |
| --- | --- | --- | --- | --- |
| SSL-CCM-1 | CCM provider IV parameter getters OOB heap read | **Confirmed** (ASan ×2, patch-validated) | Medium ~5.9 | [report](../../findings/reports/SSL-CCM-1.md) |
| SSL-D-1 | DTLS 1.3 L-bit-clear record mis-framing | Potential (probable) | Low | [report](../../findings/reports/SSL-D-1.md) |
| SSL-Q-1 | QUIC assert off-by-one drops legal 20-byte DCID | Potential (probable) | Low | [report](../../findings/reports/SSL-Q-1.md) |
| SSL-ASN-1 | `ASN1_STRING_copy` ownership-flag propagation leak | Potential (probable) | Low | [report](../../findings/reports/SSL-ASN-1.md) |
| SSL-K-1 | `p5_crpt2.c` assert abort with custom provider | Unconfirmed | Low (config-dependent) | [report](../../findings/reports/SSL-K-1.md) |

False-positive record: 17 candidates cleared with per-item rationale; 43
scan-build null-deref reports triaged as path-power false positives out of
337 triaged reports. Duplicate check: none identified against known
advisories.

## Technical achievements

- Reached a genuine memory-safety defect through the documented public API
  (`EVP_CIPHER_CTX_get_*_iv`) and demonstrated it deterministically under
  ASan with two independent buffer sizes.
- Produced a two-line candidate fix and validated it: PoCs clean **and** the
  full official `make tests` suite PASS on the patched tree.
- Re-screened several previously-CVE'd classes and confirmed the current
  tree is correctly bounded against them (recorded false-positive list).

## Testing and verification

- Normal (gcc) and sanitizer (ASan+UBSan) builds from the exact audited
  commit.
- Focused EVP test families PASS on the sanitizer patched build; full
  official suite PASS on the patched tree.
- ASan logs for the confirmed finding archived with the vendor report.

## Remediation and upstream status

- CCM-1: two-line patch proposed and validated; earliest affected released
  branch pending maintainer version tracing.
- D-1/Q-1: runtime reproduction harnesses to be built (synthetic DTLS 1.3
  peer; QUIC handshake harness).

## Responsible disclosure status

Vendor report for CCM-1 prepared, marked CONFIDENTIAL, **not submitted**.
Channel: OpenSSL security policy. No CVE identifiers reserved or invented;
no findings published publicly beyond the redacted documentation here.
Details: [../../findings/DISCLOSURE-STATUS.md](../../findings/DISCLOSURE-STATUS.md).

## References

- OpenSSL repository: <https://github.com/openssl/openssl>
- OpenSSL security policy: <https://openssl-library.org/policies/general/security-policy/>
