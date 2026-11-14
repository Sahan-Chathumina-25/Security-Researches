# Project 04 — xrdp v0.10.6.1

## Project overview

A full defensive source audit of xrdp across a 12-phase methodology,
producing seven confirmed, validation-backed findings, a disclosure-ready
report set, and validated fixes (one matching an upstream fix, one research
hardening patch). All seven findings were confirmed with mechanical
reproducers.

## Software description

xrdp is a Remote Desktop Protocol (RDP) server for Linux. The audit covered
the listener/libxrdp protocol stack, the per-connection child process, and
the per-session chansrv helper with its virtual channels (sound, clipboard,
audio-input, dynamic channels).

## Audited version and commit

| Item | Value |
| --- | --- |
| Tree | xrdp upstream |
| Tag | v0.10.6.1 |
| Commit | `80c52879fead585d6347df5b3c587718adf8f5a5` |
| Upstream reference state | master at `de20a7e4` (spot-checked) |

## Research objectives

- Audit the complete network data path: transport → channel protocol →
  chansrv protocol modules.
- Establish the process model as the factual basis for impact assessment.
- Validate every finding mechanically and develop validated fixes.

## Research scope

C code of the main components (xrdp, libxrdp, sesman, chansrv, common,
libipm, xup/vnc backends at data-path level); vendored librfxcodec and
libpainter received tool-sweep only; develop-only tools excluded.

## Architecture overview

- The listener forks a per-connection child; crashes there affect that
  connection only.
- chansrv runs per-session as the logged-in user; the network-facing
  attacker in scope is the RDP client on its own session.
- This validated process model bounds every finding's impact to
  per-connection or per-session scope.

## Attack-surface analysis

Client-controlled protocol parsing across: sound (rdpsnd_rec recording
path), clipboard (capability sets, file contents), audio-input
(formatchange), and dynamic virtual channels (reassembly, header parsing).
Trust boundaries documented in the phase-03 attack-surface record.

## Research methodology

Twelve phases: reconnaissance; build & baseline (213/213 unit tests, 0
compiler warnings); attack surface; static audit (cppcheck exhaustive per
component + `-Wextra` full build + deep manual review); root-cause analysis;
controlled local validation (ASan harnesses linking unmodified vulnerable
translation units replaying attacker-crafted packets); independent
sanitizer cross-check (Valgrind); impact analysis and CVSS v4 vectors; patch
development; regression; reporting; disclosure preparation.

## Tools and environment

User-local dependency prefix build; cppcheck; GCC `-Wextra`; ASan
harnesses; Valgrind memcheck on statically linked builds. Details:
[../../TOOLS-AND-ENVIRONMENT.md](../../TOOLS-AND-ENVIRONMENT.md).

## Security findings

| ID | Component | Finding | Reachability | Upstream status | Report |
| --- | --- | --- | --- | --- | --- |
| XRDP-001 | chansrv/rdpsnd_rec | Unbounded capture-formats parse (OOB read) | session-user | **Fixed upstream** (`de20a7e4`; CVE-2026-79928 family) | [report](../../findings/reports/XRDP-001.md) |
| XRDP-002 | chansrv/rdpsnd_rec | Unchecked memcpy from client packet + unbounded FIFO | session-user | **Fixed upstream** (CVE-2026-79936/-81169 family) | [report](../../findings/reports/XRDP-002.md) |
| XRDP-003 | chansrv/cliprdr | Capability-set length used for unchecked stream skip | session-user | Not fixed | [report](../../findings/reports/XRDP-003.md) |
| XRDP-004 | libxrdp/channel | Static-channel 8-byte header read unchecked | pre-auth (connection child) | Not fixed | [report](../../findings/reports/XRDP-004.md) |
| XRDP-005 | libxrdp/channel | drdynvc reassembly alloc from client length unchecked | pre-auth (connection child) | Not fixed | [report](../../findings/reports/XRDP-005.md) |
| XRDP-006 | chansrv/audin | Formatchange index unchecked → OOB deref | session-user | Not fixed | [report](../../findings/reports/XRDP-006.md) |
| XRDP-007 | chansrv/cliprdr | File-contents request size drives allocation | session-user | Not fixed | [report](../../findings/reports/XRDP-007.md) |

Hardening-only observations (deferred, documented in project notes):
`read_entire_packet` length/total trust, `xrdp_tconfig` off-by-one
defensive check, chansrv drdynvc `chan_id` range check.

## Technical achievements

- All seven candidates confirmed with mechanical reproducers (ASan primary;
  Valgrind cross-check for XRDP-001, XRDP-004, XRDP-006).
- Upstream state verified precisely: the rdpsnd_rec family corresponds to
  already-fixed CVEs; the other five findings are new and still present
  upstream at audit time.
- Two validated fixes: the upstream removal patch re-applied and verified
  for the fixed family, and a research hardening patch (4 files, +78/−0)
  for the rest.
- Deployment risk honestly bounded: no cross-session/pre-auth RCE
  identified; highest practical impact is the resource-exhaustion family
  (XRDP-005/007) and the crash family (XRDP-001/002/003/006).

## Testing and verification

- Baseline unit suite green (213/213) before any audit work and after every
  patch.
- Functional sanity tests per fix proving legitimate behavior is preserved
  (valid caps traffic parses; small file reads work; format negotiation
  unaffected).
- Phase 10 reproducibility: patched tree reverted to the pristine commit
  and baseline rebuilt with identical results.

## Remediation and upstream status

- XRDP-001/002: fixed upstream by `de20a7e4` (rdpsnd_rec removal); fix
  re-applied and validated in Phase 9.
- XRDP-003..007: research hardening patch archived; planned as an upstream
  PR if maintainers respond to the disclosure.

## Responsible disclosure status

Vendor disclosure draft prepared and **not yet submitted** (excludes the
already-fixed family; maintainer contacts and policy to be confirmed).
Details: [../../findings/DISCLOSURE-STATUS.md](../../findings/DISCLOSURE-STATUS.md).

## References

- xrdp repository: <https://github.com/neutrinolabs/xrdp>
- CVE-2026-79928 / CVE-2026-79936 / CVE-2026-81169 (rdpsnd_rec family)
