---
layout: default
permalink: /projects/openssl/
title: OpenSSL 4.2.0-dev
---

# OpenSSL 4.2.0-dev

**Parallel deep audit of the OpenSSL upstream development tree across the
main parsing and cryptography surfaces, with a patch-validated confirmed
defect.**

| Field | Value |
| --- | --- |
| Version audited | 4.2.0-dev master @ `5dbd6501ee6c07c8a397df5c979743c05d775603` |
| Research period | 2026-11-04 → 2026-11-05 |
| Status | Audit, PoC verification, patch validation, full test-suite run complete |
| Confirmed findings | 1 (Medium, patch-validated) |
| Vendor report | Prepared (CONFIDENTIAL), not submitted |

## Scope

Reviewed in depth: ASN.1/X.509 parsing (incl. RFC 3779, name constraints),
TLS/DTLS record layer (incl. DTLS 1.3), QUIC RX and validation, EVP and
provider parameters, BIO, PEM, CMS, PKCS12, OCSP, TS, and CLI apps.

## Findings

| ID | Finding | Status | Proposed severity |
| --- | --- | --- | --- |
| SSL-CCM-1 | CCM provider IV parameter getters copy caller-buffer-size bytes from a fixed 16-byte IV array → OOB heap read | **Confirmed** (ASan ×2, patch-validated) | Medium (~5.9) |
| SSL-D-1 | DTLS 1.3 unified header with L bit clear mis-frames record length | Probable | Low |
| SSL-Q-1 | QUIC release-build assert off-by-one silently drops legal 20-byte DCID packets | Probable | Low |
| SSL-ASN-1 | `ASN1_STRING_copy` propagates not-owned flag onto owned data (cleanse bypass) | Probable | Low |
| SSL-K-1 | `p5_crpt2.c` assert abort with a custom provider | Unconfirmed | Low |

17 additional candidates were cleared as false positives with per-item
rationale; 337 scan-build reports were triaged.

## Verification highlights

- Two independent ASan reproductions of SSL-CCM-1 through the documented
  public API, with different buffer sizes.
- Two-line candidate fix validated: PoCs clean **and** the full official
  `make tests` suite PASS on the patched tree.
- No duplicate found against known advisories; explicitly not claimed as a
  zero-day.

## Upstream status

CCM-1 unpatched at the audited commit; vendor report prepared under the
OpenSSL security policy and held for coordination. No CVE claimed.

## Details in the repository

[projects/02-openssl](https://github.com/{{ site.github_username }}/Security-Researches/tree/main/projects/02-openssl)
·
[CCM-1 report](https://github.com/{{ site.github_username }}/Security-Researches/blob/main/findings/reports/SSL-CCM-1.md)
