# Research Environment

Technical environment used for all research, as recorded in build and
analysis logs. See also [../TOOLS-AND-ENVIRONMENT.md](../TOOLS-AND-ENVIRONMENT.md)
for the tool-by-tool summary.

## Host platform

- **Kali Linux on WSL2** — a controlled local research environment.
- All analysis, builds, and PoC execution happen locally against locally
  built binaries; no third-party services are involved.

## Source-code handling

- Source acquired only from official upstream repositories.
- Each project pins an exact commit or release tag; the commit hash is
  recorded in every project document and finding report.
- Audited trees are kept pristine; all builds are out-of-tree (VPATH) in
  dedicated build directories (e.g. OpenSSH: `build-normal`,
  `build-scanbuild`, `build-asan`).
- Release tags verified where signed (OpenSSH `V_10_6_P1` tag SSH-signature
  checked against the maintainer's key).

## Build discipline

- Configure/build logs recorded per build variant.
- Build variants chosen deliberately:
  - **normal** — shipping-like configuration for behavioral baselines.
  - **sanitizer** — ASan/UBSan (GCC) or MSan (Clang) for memory-safety
    verification, sometimes with upstream hardening flags deliberately
    disabled to expose a defect (documented per finding).
  - **static-analysis** — analyzer instrumentation.
- Where upstream hardening affects observability
  (`-ftrivial-auto-var-init=zero`), the interaction is analyzed and
  documented rather than ignored.

## Evidence management

- Per-finding evidence directories: sanitizer reports, PoC sources,
  harnesses, and verbatim runtime outputs, kept unmodified in the private
  research archive.
- Public documentation links to evidence *descriptions*; exploitation
  material for unpatched issues is not published (see
  [responsible-disclosure.md](responsible-disclosure.md)).

## Analytical toolchain versions

- GCC 16.2.0, Clang 21.1.8 (Debian, WSL2)
- Valgrind 3.27.1, cppcheck 2.21.0
- git for version pinning; Python for fixture/harness automation
