# Research Roadmap

Planned work, based on the recorded "remaining work" items of each completed
project. Items are listed only where the research documentation identifies
them; no target commit dates are promised.

## Disclosure (highest priority)

1. Submit the five prepared vendor reports through each project's official
   security policy:
   - PHP — GitHub security advisory process (GHSA → CVE via the PHP CNA)
     for V1 and V2; V4/V5 may be raised through the issue tracker at
     maintainer discretion.
   - OpenSSL — security report per openssl-library.org security policy
     (CCM-1 with PoC, sanitizer logs, patch).
   - OpenSSH — security contact for OSSH-001/OSSH-002 (informational/low,
     harness and macro-expansion proofs attached; no CVE requested).
   - xrdp — maintainer security contact (vendor report for XRDP-003..007;
     XRDP-001/002 already fixed upstream by `de20a7e4`).
   - Node.js — security-interest lane report for FIND-001 as a residual of
     the July 2026 CVE-2026-48934/58040 cluster (triager to rule on scope).
2. Coordinate publication windows; upgrade this portfolio's finding reports
   from redacted to full detail after fixes ship or advisories publish.
3. Track vendor triage outcomes (accepted / disputed / out-of-scope) and
   record them honestly in the findings index.

## Technical follow-up from completed projects

- **OpenSSL** — runtime reproduction for D-1 (synthetic DTLS 1.3 peer) and
  Q-1 (QUIC handshake harness); additional fuzzing pass over DTLS 1.3
  record/QUIC RX paths; determine earliest affected released branch for
  CCM-1; extend audit coverage to QUIC TXP internals, the ossl-conf parser,
  and `apps/req`.
- **OpenSSH** — complete Phase 8 (full upstream regression on sanitizer
  builds) and proceed through disclosure phases 9–12.
- **xrdp** — submit the research hardening patch (4 files) as an upstream PR
  if maintainers respond; end-to-end reproduction over a live RDP session
  remains out of scope until then.
- **PHP** — verify V3's runtime behavior across all validation-error classes;
  determine whether V5's cross-allocation guard is reachable via
  `ini_set`-controlled separators in default configurations.
- **Node.js** — draft disclosure narrative finalization; re-run the
  reproduction on later HEAD builds to track the fix cluster's evolution.

## Future audit candidates

To be selected with the same criteria as the completed projects: widely
deployed, C-heavy, network-reachable parsing surfaces, and maintained
upstream. Specific targets are not published in advance.

## Portfolio maintenance

- Keep the findings index synchronized with disclosure progress.
- Add reference links to published advisories once coordination completes.
- Publish full (unredacted) finding reports only after upstream fixes ship.
