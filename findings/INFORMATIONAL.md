# Informational Observations and Cleared Candidates

## Informational findings

Verified defects without established security impact. Classification follows
the analysis in each report — these are robustness/correctness issues, not
claimed vulnerabilities.

| ID | Project | Title | Verification | Report |
| --- | --- | --- | --- | --- |
| OSSH-001 | OpenSSH V_10_6_P1 | Uninitialized/stale `struct stat` consumed after ENOENT fall-through in `agent_cleanup_stale()` (`misc-agent.c`) | Valgrind memcheck + clang MemorySanitizer on extracted harness; patched-simulation runs clean | [report](reports/OSSH-001.md) |
| SSL-K-1 | OpenSSL 4.2.0-dev | `p5_crpt2.c` `OPENSSL_assert` abort with custom PBKDF2 provider (unconfirmed) | Not reproduced; config-dependent | [report](reports/SSL-K-1.md) |

Additional hardening-only observations recorded during the xrdp audit
(documented in project notes, not raised as findings):

- `read_entire_packet` length/total trust (guarded by the xrdp-mm forwarder
  in the audited release).
- `xrdp_tconfig` off-by-one defensive check.
- chansrv drdynvc `chan_id` range check.

## False positives eliminated

Negative results are part of the evidence chain and are retained.

### OpenSSL — cleared candidates (17 with rationale)

CCM set-IV underflow (`ivlen = 15 - sz` — caught by range validation);
ASN.1 BIT STRING unused-bits handling (mathematically bounded); name-
constraints URI NULL hostname (copy chain fails closed); punycode/EAI path
(WPACKET-bounded); `ASN1_get_object` long arithmetic (INT_MAX>>7 bound
honored); indefinite-length EOC nesting (cap + guard); CMS staged decrypt
key length (new check adequate); PEM header parser (bounds intact);
PKCS12/PBKDF2 length arithmetic (negative iter rejected); EVP base64
encode/decode incl. AVX2 (destination-size contract met); BIO mem/buff/addr
hostname (bounded); KDF param concat (two-pass WPACKET); PQ import ranges
(compile-time constants); TLS 1.3 padding/CBC rotation (indexing strictly
bounded); QUIC wire parsing (vlint bounded, ACK ranges guarded); scan-build
43 "null deref" reports (path-power false positives out of 337 triaged);
dead assign/increment noise.

### OpenSSH — analyzer reports triaged benign

- cppcheck: 42/42 reports triaged benign.
- Clang static analyzer (`clang --analyze`): 60/60 reports triaged benign.
- GCC `-Wall -Wextra`: 17/17 warnings benign.

### Node.js — refuted hypothesis

- **NODE-FIND-002** — hypothesis that https Agent TLS-policy object ids
  (SafeWeakMap + counter) could be "recycled" after garbage collection,
  enabling cross-policy session key collisions. Refuted before any
  reproduction: the id source is a module-level monotonic counter
  (`id = ++tlsPolicyObjectId`), so ids are never reused and the key string is
  collision-free for the process lifetime. [report](reports/NODE-FIND-002.md)

### PHP — no false-positive record

No candidates were raised and cleared in the PHP project record; the five
findings (V1–V5) were each taken to their documented status directly.
