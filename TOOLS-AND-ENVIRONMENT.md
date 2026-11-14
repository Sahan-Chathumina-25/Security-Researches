# Tools and Research Environment

Documented from the build and analysis logs in the research archive. Only
tools with recorded use are listed.

## Platform

| Component | Detail |
| --- | --- |
| Operating system | Kali Linux on Windows Subsystem for Linux 2 (WSL2) |
| Compiler toolchain | GCC 16.2.0, Clang 21.1.8 (Debian) |
| Valgrind | 3.27.1 (memcheck, origin tracking) |
| cppcheck | 2.21.0 |
| Python | used for fixture automation and harness scripting |
| git | pinned upstream revisions; VPATH / out-of-tree build discipline |

## Per-project build and verification setups

### PHP (php-src 8.7.0-dev)
- Debug build with AddressSanitizer (`--enable-address-sanitizer
  --enable-debug --enable-mbstring --with-zip`, gcc 16.2).
- Release NTS build with AddressSanitizer (`-O2`, `ZEND_DEBUG 0`) matching
  distro shipping configuration semantics.
- Runtime PoC execution via the CLI SAPI of locally built binaries.

### OpenSSL (4.2.0-dev master)
- Normal (gcc) and sanitizer builds (ASan + UBSan, gcc 16.2, `no-asm`) from
  the exact audited commit.
- clang scan-build — 337 reports triaged.
- Official test harness: full `make tests` run (PASS on the patched tree),
  plus focused EVP test families on the sanitizer build.
- gdb available for inspection.

### OpenSSH (Portable V_10_6_P1)
- Three VPATH build trees: normal, scan-build (`clang --analyze` via a
  wrapper script — scan-build's `ccc-analyzer` wrapper is incompatible with
  the project's clang flags), and ASan.
- Upstream regression suite: 489/489 tests passed (t-exec 332, hostkeys 18,
  match 7, misc 108, servconf 6, crypto 18).
- Valgrind memcheck + clang MemorySanitizer on extracted verbatim regression
  harnesses, with a link-time interposition shim to simulate the entry-vanish
  race deterministically.
- Preprocessor macro-expansion proofs for OSSH-002 (GCC `-Wall -Wextra
  -Wuninitialized` probe compilation).

### xrdp (v0.10.6.1)
- User-local dependency prefix; configure build with 0 compiler warnings.
- Unit test suite: 213/213 before and after every patch.
- cppcheck exhaustive per component; `-Wextra` full build.
- ASan-instrumented harnesses linking the unmodified vulnerable translation
  units, replaying attacker-crafted wire-format packets; Valgrind memcheck
  cross-checks on statically linked builds.

### Node.js (HEAD 67e45e4a, v28.0.0-pre)
- Full source build with AddressSanitizer (Release build), plus comparison
  runs on system Node v24.19.0.
- JavaScript validation scripts driving local TLS servers with test-fixture
  certificates to exercise agent session reuse and policy keying.

## Analyzer triage summary

| Tool | Project | Reports triaged | Outcome |
| --- | --- | --- | --- |
| clang scan-build | OpenSSL | 337 | 1 actionable direction confirmed; 43 null-deref reports cleared as path-power false positives; rest benign/noise |
| clang `--analyze` | OpenSSH | 60 | all benign (manual triage recorded) |
| cppcheck | OpenSSH | 42 | all benign |
| GCC `-Wall -Wextra` | OpenSSH | 17 | all benign |
| cppcheck + warnings | xrdp | full tree | clean baseline (0 warnings) |

## Notes

- Upstream hardening flags materially affect observable behavior (e.g.
  `-ftrivial-auto-var-init=zero` masking uninitialized reads), so
  verification builds are configured deliberately to match or isolate those
  effects; this is documented per finding.
- All PoC programs and harness sources are archived per project in the
  private research archive; only redacted descriptions are published here
  while issues remain unpatched.
