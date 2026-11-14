<div align="center">
  <img src="assets/banners/security-research-banner.svg" alt="Security Research — Independent Security Research &amp; Open-Source Software Auditing" width="100%" />
</div>

# Security Research

**Independent Security Research & Open-Source Software Auditing**

This repository is the documentation portfolio of an independent security
research program focused on the source-code auditing of widely deployed
open-source software. Every finding documented here originates from a real,
locally performed research project on a pinned source revision, verified with
reproducible evidence (sanitizer reports, debugger and dynamic-analysis logs,
and official upstream test suites). No finding in this repository is
fictional, and no severity or disclosure outcome is claimed beyond what the
research record supports.

All work is authorized local research conducted for educational and defensive
purposes. Findings are handled through responsible disclosure; nothing in this
repository has been coordinated with a vendor yet, so public reports are
deliberately redacted (see the
[disclosure status](findings/DISCLOSURE-STATUS.md)).

---

## Research Overview

The research program covers, per project:

- **Open-source security research** — full-source audits of projects
  maintained by the open-source community, from build to report.
- **Source-code auditing** — manual review of parsing, protocol handling,
  memory-safety-critical and trust-boundary code.
- **Vulnerability discovery** — identification of memory-safety, integer
  handling, policy-isolation and resource-exhaustion defects.
- **Root-cause analysis** — every candidate is traced from attacker-controlled
  input to the faulty construct, including compiler and hardening-flag
  interactions.
- **Security testing** — dynamic verification with AddressSanitizer,
  MemorySanitizer, Valgrind, and purpose-built regression harnesses linked to
  the unmodified vulnerable translation units.
- **Responsible disclosure** — vendor-ready reports prepared under
  coordination processes; no public exploit material for unpatched issues.

## Research Statistics

Statistics are derived strictly from the research records in the original
research archive; statuses are as recorded at the close of each project
(2026-10-24 through 2026-11-14).

| Metric | Count | Notes |
| --- | --- | --- |
| Completed research projects | 5 | PHP, OpenSSL, OpenSSH, xrdp, Node.js |
| Confirmed findings | 11 | Runtime- or statically verified per finding report |
| Potential (probable/unconfirmed/static-only) findings | 5 | Documented but not upgraded to confirmed |
| False positives eliminated | 3 + | Explicitly screened and cleared; many analyzer reports triaged |
| Informational / hardening observations | 3 | OSSH-001, OpenSSL K-1, xrdp hardening notes |
| Findings already fixed upstream at audit time | 2 | xrdp XRDP-001/002 (CVE-2026-79928/-79936/-81169 family) |
| Findings still present upstream at audit time | 13 | Subject to coordinated disclosure |
| Vendor reports prepared | 5 | One per project; **not yet submitted** |
| CVE identifiers claimed | 0 | None reserved or invented; CNA processes to be used |

**Important distinction:** *completed research projects* (5) counts audits
brought to a documented conclusion — it is not a count of vulnerabilities.
Each confirmed finding is individually documented with its own evidence basis
in the [findings index](FINDINGS-INDEX.md).

## Completed Projects

| # | Project | Audited version | Research status | Confirmed findings | Documentation |
| --- | --- | --- | --- | --- | --- |
| 01 | PHP (php-src) | 8.7.0-dev master @ `251fe7729` (2026-10-24) | Audit, runtime confirmation and disclosure report complete | 3 (2 High, 1 Low) + 1 partially confirmed + 1 potential | [projects/01-php](projects/01-php/) |
| 02 | OpenSSL | 4.2.0-dev master @ `5dbd6501e` (2026-11-04) | Audit, PoC verification, patch validation and full test-suite run complete | 1 (Medium) | [projects/02-openssl](projects/02-openssl/) |
| 03 | OpenSSH | Portable `V_10_6_P1` @ `a8c72b842` | Phases 1–8 complete; upstream suite 489/489 passed | 1 (Low, static) + 1 verified informational | [projects/03-openssh](projects/03-openssh/) |
| 04 | xrdp | v0.10.6.1 @ `80c52879f` | Full 12-phase audit; 213/213 unit tests before and after patching | 7 (5 new upstream, 2 already fixed) | [projects/04-xrdp](projects/04-xrdp/) |
| 05 | Node.js | HEAD `67e45e4a` (v28.0.0-pre) + v24.19.0 comparison | Audit, mechanism reproduction on HEAD, severity assessment | 1 (High, proposed 8.1) | [projects/05-nodejs](projects/05-nodejs/) |

## Research Methodology

Each project follows an evidence-driven, phase-based process. The details are
described in [METHODOLOGY.md](METHODOLOGY.md); the actual process used is
summarized below.

1. **Target selection and reconnaissance** — architecture, build system,
   repository and security history reviewed; audited tree pinned to an exact
   commit/tag and kept pristine.
2. **Baseline build and testing** — clean builds recorded; upstream test
   suites run to establish a behavioral baseline.
3. **Attack-surface and trust-boundary mapping** — written architecture,
   trust-boundary and attack-surface documents per project.
4. **Static analysis** — clang scan-build / `clang --analyze`, cppcheck,
   GCC/Clang warning passes; every report triaged to confirmed defect, benign,
   or false positive.
5. **Manual source review** — deep audit of parsing, protocol, crypto-adjacent
   and memory-safety-critical paths.
6. **Candidate analysis** — root-cause analysis for each candidate, including
   hardening-flag interactions (e.g. `-ftrivial-auto-var-init=zero` masking).
7. **Dynamic verification** — sanitizer builds (ASan/UBSan/MSan), Valgrind
   cross-checks, and purpose-built harnesses linked against the unmodified
   vulnerable code replaying attacker-controlled input.
8. **Patch development and regression** — researcher patches validated against
   the vulnerability harnesses *and* the official upstream test suites; trees
   then restored to the pristine pinned revision.
9. **Reporting and disclosure preparation** — vendor-ready, confidential
   reports prepared; submission held pending vendor coordination.

## Technical Skills and Tools

Only tools with evidence in the research records are listed. Full details:
[TOOLS-AND-ENVIRONMENT.md](TOOLS-AND-ENVIRONMENT.md).

| Category | Tools used in this research |
| --- | --- |
| Environment | Kali Linux (WSL2), GCC 16.2, Clang 21.1.8 |
| Static analysis | clang scan-build / `clang --analyze`, cppcheck 2.21.0, GCC `-Wall -Wextra` warning passes |
| Dynamic analysis | AddressSanitizer, UndefinedBehaviorSanitizer, MemorySanitizer (Clang), Valgrind 3.27.1 (memcheck) |
| Debugging / inspection | gdb, preprocessor/macro-expansion proofs, disassembly as needed |
| Build & test harnesses | Upstream test suites (PHP, OpenSSL, OpenSSH, xrdp unit suite, Node.js), custom regression PoC harnesses in C |
| Languages audited / used | C, JavaScript/TypeScript (Node.js internals), PHP, Python (harness automation) |
| Version control | git (pinned upstream revisions, VPATH/out-of-tree build discipline) |

## Research Principles

- **Evidence-based findings** — a finding is only recorded when a tool report,
  runtime trace, or static proof supports it; everything else is documented as
  potential or cleared as a false positive.
- **Reproducible testing** — pinned commits, recorded build commands, and
  saved harnesses so that every result can be re-derived.
- **Accurate technical documentation** — root causes, impact scope and
  severity are stated with their assumptions and limitations, never inflated.
- **Responsible disclosure** — vendor reports are prepared confidentially and
  submitted through the projects' security policies; unpatched issues are
  published here only in redacted form.
- **Ethical security research** — all testing is local, authorized, and
  defensive in purpose.

## Repository Navigation

| Path | Contents |
| --- | --- |
| [projects/](projects/) | The five completed research projects |
| [findings/](findings/) | Findings index, per-finding reports, disclosure status |
| [METHODOLOGY.md](METHODOLOGY.md) | Research methodology |
| [ABOUT.md](ABOUT.md) | About this research program |
| [RESEARCH-ROADMAP.md](RESEARCH-ROADMAP.md) | Future research directions |
| [TOOLS-AND-ENVIRONMENT.md](TOOLS-AND-ENVIRONMENT.md) | Research environment and toolchain |
| [REFERENCES.md](REFERENCES.md) | External references |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contributions and corrections |
| [SECURITY.md](SECURITY.md) | Reporting an issue in this repository |
| [docs/](docs/) | Supporting methodology, disclosure and environment documents |

## Disclaimer

This repository documents independent security research conducted for
educational and defensive purposes. All research targets were locally built
from public source code and analyzed in an isolated environment; no third
party was attacked and no unauthorized system was accessed. Findings that
remain unpatched upstream are published here only in redacted form — without
exploitation scripts, trigger inputs, or other material that would enable
misuse — pending coordinated disclosure. Nothing in this repository should be
interpreted as a claim of CVE assignment, vendor acknowledgement, or payment.
