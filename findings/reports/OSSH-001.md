# OSSH-001 — Uninitialized / stale `struct stat` consumed after ENOENT fall-through in `agent_cleanup_stale()`

| Field | Value |
| --- | --- |
| Finding ID | OSSH-001 |
| Status | **Informational** — verified defect (Valgrind memcheck + clang MemorySanitizer); no established security impact in default builds |
| Affected software | OpenSSH Portable |
| Affected version | `V_10_6_P1` @ `a8c72b842423f0774f542d3c2197247c3dd28d74` |
| Introduced in | 10.6 (`agent_cleanup_stale()` file-manager integration, new in 10.6) |
| Affected component | `ssh-agent` socket reaping — `misc-agent.c`, `agent_cleanup_stale()` |
| Source location | `misc-agent.c` ≈lines 393–480 (declaration at ~399; ENOENT fall-through at ~442–448) |
| Classification | Correctness/robustness — nondeterministic stale-socket cleanup |
| Upstream status | Unpatched at the audited tag; disclosure preparation pending |
| Disclosure status | Report content ready; not submitted; no CVE requested (robustness class) |

> **Redaction notice.** Public, redacted version. The race-simulation harness
> details are withheld; the verification approach is described at
> methodology level.

## Technical summary

`agent_cleanup_stale()` sweeps stale agent-listener sockets. When the
per-entry `fstatat()` call fails with `ENOENT` — an expected race in this
function's own operating model, since sockets are created and removed
concurrently in the same directory — the error-handling condition
short-circuits incorrectly and the loop falls through to consume
`sb.st_mode` even though `fstatat()` never filled the `struct stat`:

- **First ENOENT-hit iteration**: `sb` is entirely uninitialized stack data
  (upstream's default hardening flag `-ftrivial-auto-var-init=zero` masks
  this form in shipped builds).
- **Later ENOENT-hit iterations**: `sb` retains **stale metadata from a
  previous, unrelated directory entry**, so entry N is classified using
  entry N−1's mode/mtime — cross-entry data contamination not masked by any
  build flag.

Either path can decide whether a real, currently-valid agent socket is
unlinked or a dead socket is left behind, nondeterministically.

## Root cause

- The intended symmetric handling of the ENOENT carve-out is missing: the
  condition is written so a non-ENOENT error continues, but the ENOENT case
  also proceeds instead of skipping the entry.
- `sb` is never initialized or reset between iterations.

## Security impact (assessed honestly)

- Local, same-directory, per-user sweep; the process only unlinks entries
  within a directory it already has authority over.
- Worst case: skipping or over-eagerly removing agent listener sockets
  (local denial-of-service against the user's own agent instances). No
  memory-corruption or privilege-escalation outcome was established.
- Classified **Informational / robustness** — a genuine implementation
  defect flagged by two independent tools, not a claimed vulnerability.

## Verification methodology

1. An extraction harness reproduces the exact upstream loop body verbatim
   with local glue, compiled at `-O2` *without* the upstream
   auto-init hardening flag, so the uninitialized form is observable.
2. A deterministic race simulation forces the first `fstatat()` call to
   return ENOENT without touching the buffer (link-time wrap shim).
3. **Valgrind memcheck** (origin tracking): reports the conditional branch
   depending on an uninitialized stack value, with the offending line mapped
   to the upstream `S_ISSOCK()` test.
4. **clang MemorySanitizer** independently reports
   use-of-uninitialized-value at the same location.
5. A multi-entry run demonstrates the stale-reuse artifact: an entry swept
   using a prior entry's stat contents and unlinked despite its own recent
   mtime.
6. **Patched-simulation** runs (added `continue` on ENOENT) are clean under
   both tools.
7. All tool reports and harness sources are archived with the finding.

## Proposed remediation

Handle the ENOENT carve-out symmetrically (skip the entry), and optionally
zero or reset the stat buffer at the top of each iteration as belt-and-braces
for hardening-free platforms. A researcher patch is archived.

## Disclosure status

- Report content complete; submission through the OpenSSH security contact
  is planned with the harness and sanitizer artifacts attached as
  informational. No CVE is requested for this class.

## References

- Original research record: `OpenSSH/audit/findings/OSSH-001.md` (private archive)
