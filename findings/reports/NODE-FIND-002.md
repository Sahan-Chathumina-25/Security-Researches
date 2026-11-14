# NODE-FIND-002 — https Agent TLS-policy object key "recycling" hypothesis — FALSE POSITIVE

| Field | Value |
| --- | --- |
| Finding ID | NODE-FIND-002 (FIND-002) |
| Status | **False positive** — premise refuted before any reproduction was attempted |
| Affected software | Node.js (hypothetical) |
| Affected version | HEAD `67e45e4a` analysis basis |
| Affected component | `lib/https.js` — Agent TLS-policy option keying |
| Outcome | Hypothesis rejected; documented as a negative result |
| Disclosure status | No vendor report; published as part of the evidence record |

## Original hypothesis (rejected)

That the Agent's TLS-policy object ids (safe weak map plus counter) could be
"recycled" after the option object was garbage-collected, allowing a later,
different object to reproduce an old policy's key string and share its
pooled socket/session (cross-policy session reuse).

## Refutation

- The id source is a module-level **monotonic counter**: ids are assigned
  with a pre-increment and never reuse a value for the process lifetime.
- The weak map exists only to avoid pinning option objects in memory; it
  does not make ids reusable.
- Therefore two distinct objects always receive distinct ids, and the key
  string is collision-free across time. Session-cache entries outliving
  sockets are safe with respect to object identity.

## Residual theoretical note (not exploitable)

Primitive keys of different types whose stringifications coincide in the
first character could theoretically collide; no supported option slot
meaningfully accepts a Symbol value, so this is a curiosity, not a security
defect. Other type prefixes cannot collide under the recorded analysis.

## Lesson recorded

Validate the allocator/recycling semantics of the id source before building
an exploit chain on it. Monotonic counters plus weak maps are the standard
collision-free pattern here.

## References

- Original research record: `Nodejs/research/08-vulnerability-reports/FIND-002-agent-tls-key-id-recycling.md` (private archive)
