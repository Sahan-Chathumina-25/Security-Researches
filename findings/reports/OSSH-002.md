# OSSH-002 — `fstatat()` fallback macro stats the wrong variable

| Field | Value |
| --- | --- |
| Finding ID | OSSH-002 |
| Status | **Confirmed statically** (macro-expansion proof); not runtime-testable on the audit platform |
| Affected software | OpenSSH Portable |
| Affected version | `V_10_6_P1` @ `a8c72b842423f0774f542d3c2197247c3dd28d74` |
| Affected component | `ssh-agent` stale-socket reaping — portability fallback macros |
| Source location | `misc-agent.c` ≈lines 386–391 (fallback macros), expanded at the call site ≈line 442 |
| Classification | Wrong-variable macro expansion; latent uninitialized-pointer use; portability correctness |
| Proposed severity | Low |
| Upstream status | Unpatched at the audited tag; disclosure preparation pending |
| Disclosure status | Report content ready; not submitted; no CVE requested (correctness class) |

## Technical summary

On platforms without `fstatat(3)`/`unlinkat(3)`, the portability layer
redefines them with fallback macros. The `fstatat` fallback expands to a
call that passes the function's *own local path variable* instead of
forwarding the macro's per-entry name argument. At the expansion point that
variable has not been assigned yet:

- **First sweep iteration**: an uninitialized stack pointer is passed as the
  path argument to the stat call.
- **Later iterations**: the previous entry's full path is used, so the
  metadata of the *prior* directory entry is attributed to the current
  entry, and cleanup decisions are made on unrelated prior-entry metadata.

(The sibling `unlinkat` fallback happens to use the same local variable at a
point in the flow where its value is the desired target — correct only by
accident, which is why the wrong-variable pattern escaped notice.)

## Root cause

- The macro body uses a free-standing local variable instead of the named
  macro parameter.

## Exposure

- Only platforms whose configure result lacks `fstatat(3)` compile the
  fallback in; Linux builds are unaffected. Low density, but real for the
  affected portability class.

## Verification methodology (static proof)

1. A forced-active compile probe (fallback branch compiled in on Linux)
   builds cleanly with the project's warning flags — GCC's
   uninitialized-use heuristics do not fire because the variable has a later
   write.
2. Preprocessor expansion of the unpatched probe shows the wrong-variable
   call at the expansion site; the corrected form expands to the proper
   per-entry argument.
3. Evidence artifacts archived with the finding.

## Proposed remediation

Forward the named macro parameter in both fallback macros, which also
removes the cross-branch dependence on the local variable's assignment
order. A one-line researcher patch is archived.

## Disclosure status

- Report content complete; can be disclosed alongside OSSH-001 through the
  OpenSSH security contact. No CVE requested.

## References

- Original research record: `OpenSSH/audit/findings/OSSH-002.md` (private archive)
