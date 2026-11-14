# References

External references used or cited across the research records. This list
contains only links verified against the research documentation.

## Projects audited

- PHP (php-src): <https://github.com/php/php-src>
- OpenSSL: <https://github.com/openssl/openssl>
- OpenSSH (Portable): <https://github.com/openssh/openssh-portable>
- xrdp: <https://github.com/neutrinolabs/xrdp>
- Node.js: <https://github.com/nodejs/node>

## Security policies (disclosure channels)

- PHP security process: <https://github.com/php/php-src/security/policy>
- PHP security advisories (submission): <https://github.com/php/php-src/security/advisories/new>
- OpenSSL security policy: <https://openssl-library.org/policies/general/security-policy/>
- OpenSSH reporting: <https://www.openssh.com/report.html>
- xrdp security policy: <https://github.com/neutrinolabs/xrdp/blob/master/SECURITY.md>
- Node.js security policy: <https://github.com/nodejs/node/blob/main/SECURITY.md>

## Standards and specifications referenced in the research

- RFC 3986 — URI generic syntax (PHP ext/uri RFC 3986 parser)
- RFC 9147 — DTLS 1.3 record layer (OpenSSL D-1 analysis)
- RFC 9000 — QUIC transport (connection ID rules, OpenSSL Q-1 analysis)
- MS-RDPBCGR — Remote Desktop Protocol (xrdp channel protocol analysis)

## Related public advisories examined during the research

- CVE-2026-79928 / CVE-2026-79936 / CVE-2026-81169 — xrdp rdpsnd_rec family
  (fixed upstream by commit `de20a7e4`; XRDP-001/002 documented as
  corresponding findings).
- CVE-2026-48934 / CVE-2026-58040 (July 2026 Node.js TLS session-reuse fix
  cluster) — context for Node.js FIND-001 as a residual of that fix.
- Node.js fix for identity-policy session keying (CVE-2026-123877 class) —
  referenced in the FIND-001 dedup analysis.

## Tooling documentation

- AddressSanitizer: <https://clang.llvm.org/docs/AddressSanitizer.html>
- MemorySanitizer: <https://clang.llvm.org/docs/MemorySanitizer.html>
- UndefinedBehaviorSanitizer: <https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html>
- Valgrind: <https://valgrind.org/>
- Clang Static Analyzer: <https://clang-analyzer.llvm.org/>
- cppcheck: <https://cppcheck.sourceforge.io/>

Note: links to upstream repositories and security policies are provided for
reference only and were current as of the audit dates recorded in each
project (2026-10/11).
