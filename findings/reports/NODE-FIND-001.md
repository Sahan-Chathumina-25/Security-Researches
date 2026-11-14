# NODE-FIND-001 — https Agent silently drops per-request `checkServerIdentity` overrides on session reuse when an agent-level checker exists

| Field | Value |
| --- | --- |
| Finding ID | NODE-FIND-001 (FIND-001) |
| Status | **Confirmed** — mechanism reproduced on the HEAD build |
| Affected software | Node.js |
| Affected version | HEAD `67e45e4a` (v28.0.0-pre), reproduced 2026-11-14; also reproduced on v24.19.0 (pre-fix-cluster comparison) |
| Affected component | `lib/https.js` Agent session keying; `lib/internal/tls/wrap.js` identity verification |
| Source location | `lib/https.js` ≈lines 384–388, 524–557, 746–764, 779–784; `lib/internal/tls/wrap.js` ≈lines 1788–1797 |
| Classification | CWE-290 authentication bypass by spoofing (TLS identity-policy isolation failure) |
| Proposed severity | High — CVSS 3.1 proposed 8.1 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N); vendor triage pending |
| Upstream status | Unpatched at the audited HEAD; a **residual** of the July 2026 CVE-2026-48934 / CVE-2026-58040 fix cluster |
| Disclosure status | Report draft prepared for the Node.js security lane; **not submitted** — reproduction details redacted |

> **Redaction notice.** Public, redacted version. The reproduction script,
> fixture setup, and server configuration are withheld while the issue is
> unpatched.

## Technical summary

By design, `checkServerIdentity` is skipped for resumed TLS sessions — safe
only because the https Agent keys cached sessions and sockets on the full
identity/trust policy. The keying includes an agent-level
`checkServerIdentity` in the key, but the per-request override mechanism
uses a **presence-only guard**: when the agent itself carries a
`checkServerIdentity`, the request-level checker is neither added to the
keying nor applied as the verifying callback on resumed connections.

Net effect: an application using the supported pattern of an agent-level
(possibly lenient) checker plus a per-request strict `checkServerIdentity`
override silently runs the strict request over a pooled session that was
established and identity-validated under the agent's checker. Hostname
verification is skipped on the resumed connection with no error.

## Root cause

- The session-key construction is driven by object identity of the policy
  options, but the effective checker used for the handshake stays the
  agent's whenever an agent-level checker is present — the per-request
  checker never becomes a key component nor the verifying callback.
- On session resume the full identity verification is skipped by design, so
  the strict checker never runs at all.

## Exploit preconditions

1. An `https.Agent` constructed with its own `checkServerIdentity`
   (an unusual but supported pattern).
2. A request through that agent carrying a per-request
   `checkServerIdentity` override (including an explicitly strict checker).
3. A pooled session previously established under the agent-level checker —
   the normal state of a warm agent.
4. A network attacker able to present a certificate at the target
   `host:port` that the lenient agent-level checker accepts.

## Impact

Complete loss of server identity authentication on reused connections for
the affected requests: the client accepts an impersonated server while the
application believes it pinned strict verification. Confidentiality and
integrity of the request data are compromised; availability is unaffected.

## Deduplication

- Public cluster: the July 2026 fix chain CVE-2026-48934 → CVE-2026-58040
  ("HTTPS Agent TLS session reuse skips hostname verification across
  identity policies"). FIND-001 is a residual of that shipped fix: the fix
  keys sessions by object identity, but the presence-only agent guard keeps
  the effective checker identical to the agent's, so the key never diverges.
- The earlier identity-policy keying fix (CVE-2026-123877 class) did not
  touch this path; the agent-CSI + per-request-override combination is
  untouched at HEAD.
- Scope ruling is explicitly requested from upstream triage: if the
  documented per-request-pinning + agent-CSI combination is out of scope,
  this becomes a documentation/behavior bug rather than a security issue —
  stated up front in the draft report.

## Verification methodology

1. Validation script drives a local TLS server (test-fixture certificates)
   through an agent with a lenient checker plus strict per-request
   overrides.
2. On the affected configuration, strict requests succeed via session reuse
   where they must fail with a certificate-hostname error.
3. **Control experiment**: the same requests through an agent *without* an
   agent-level checker are correctly rejected — isolating the defect to the
   presence-only guard.
4. Reproduced on the freshly built HEAD (v28.0.0-pre, ASan build) and on
   v24.19.0; results identical.
5. Variant matrix: changing the request-level CA policy through the same
   keying machinery is correctly isolated (trust-policy keying works), while
   a differing `checkServerIdentity` policy is not — pinpointing the gap.
6. Severity assessment document prepared with the CVSS reasoning and the
   deployment-prevalence caveat.

## Proposed remediation (options recorded)

- Minimal: compare the request-level checker against the agent's effective
  checker when deciding eligibility (equality, not presence).
- Robust: run the effective checker on session resume instead of relying
  purely on session keying.

## Disclosure status

- Draft prepared for the Node.js security lane (same lane as the parent
  cluster). Not submitted; no vendor response or CVE exists. Severity 8.1 is
  a researcher proposal with triager discretion noted (7.4 under an
  alternative complexity argument).

## References

- Original research record: `Nodejs/research/08-vulnerability-reports/FIND-001-agent-csi-session-reuse.md` (private archive)
- Related public advisories: CVE-2026-48934, CVE-2026-58040
