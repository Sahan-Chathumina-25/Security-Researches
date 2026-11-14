# Potential Findings

Observations whose root cause is argued from source analysis but which are
**not** runtime-verified, or only partially confirmed. These are documented
exactly at their recorded confidence level and are never presented as
confirmed vulnerabilities. Verification plans are noted per item.

## PHP (php-src 8.7.0-dev, @ `251fe7729`)

| ID | Title | Class | Confidence | Report |
| --- | --- | --- | --- | --- |
| PHP-V3 | WHATWG parser `append_validation_error()` uses unbounded `strlen()` on interior component pointers for the `context` property | Incorrect disclosure surface / latent OOB `strlen` | Partially confirmed — wrong-range contexts observed at runtime; no memory-safety violation demonstrated | [report](reports/PHP-V3.md) |
| PHP-V5 | `url_scanner_ex.c` "preceding separator" guard compares pointers from two different allocations, defeating an underflow check | Potential OOB read | Static review only | [report](reports/PHP-V5.md) |

## OpenSSL (4.2.0-dev master, @ `5dbd6501e`)

| ID | Title | Class | Confidence | Report |
| --- | --- | --- | --- | --- |
| SSL-D-1 | DTLS 1.3 unified header with the L bit clear mis-frames the record length (includes header bytes) | Protocol conformance / availability | Probable — deterministic from code; needs a synthetic DTLS 1.3 peer to reproduce | [report](reports/SSL-D-1.md) |
| SSL-Q-1 | Release-build assert off-by-one (`<` vs `<=`) silently drops every packet in a datagram with a legal 20-byte DCID | Availability | Probable — code-logic confirmed; not reproduced end-to-end | [report](reports/SSL-Q-1.md) |
| SSL-ASN-1 | `ASN1_STRING_copy` propagates `DATA_NOT_OWNED` flag onto owned data, bypassing free/cleanse | Internal API hygiene / retained-memory leak | Probable — logic confirmed by trace; no attacker-influenced internal path today | [report](reports/SSL-ASN-1.md) |
| SSL-K-1 | `p5_crpt2.c` `OPENSSL_assert` can abort the process with a custom provider exceeding the key-length invariant | Config-dependent local availability | Unconfirmed — requires custom-provider setup | [report](reports/SSL-K-1.md) |

## Verification plans

- **SSL-D-1 / SSL-Q-1** — runtime reproduction requires a synthetic DTLS 1.3
  peer and a QUIC handshake harness respectively; the OpenSSL fuzzing
  harnesses exist but were not executed in-session.
- **SSL-ASN-1** — needs a third-party consumer of the not-owned string API to
  establish reachability.
- **SSL-K-1** — requires a custom provider configuration; also pending a
  check whether any default provider path can exceed the invariant.
- **PHP-V5** — reachability depends on `ini_set`-controlled separators in
  default configurations; requires a controlled runtime probe.
- **PHP-V3** — determine whether any validation class produces a context
  wide enough to constitute a memory-safety issue rather than data
  corruption.
