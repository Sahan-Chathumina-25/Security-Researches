# Research Methodology (reference)

Detailed reference version of the methodology. The summary used on the main
site is in [../METHODOLOGY.md](../METHODOLOGY.md).

## Phase model

The five completed projects used different explicit phase counts (OpenSSH:
8 recorded phases of a 12-phase plan; xrdp: 12 phases; OpenSSL: parallel
audit model; PHP/Node.js: per-project structures). The constant element is
the evidence chain described below.

## A. Preparation

1. **Target selection** — widely deployed open-source software with
   network-reachable or userland-reachable parsing surfaces and an active
   upstream.
2. **Acquisition and pinning** — official repository, exact commit/tag,
   signature verification where available, pristine tree.
3. **Environment baseline** — clean builds with recorded logs; upstream
   test suites run *before* auditing to know the pre-existing state
   (xrdp 213/213; OpenSSH 489/489; OpenSSL full suite on the patched tree).
4. **Architecture study** — written architecture, trust-boundary, and
   attack-surface documents, grounded in the project's own security policy
   where one exists (Node.js threat-model lanes, xrdp process model).

## B. Discovery

5. **Static analysis** — scan-build / `clang --analyze`, cppcheck, warning
   passes; every report triaged to defect / benign / false positive with a
   recorded rationale. Negative results are retained.
6. **Manual review** — deep audit of parsing, protocol, crypto-adjacent,
   and trust-boundary code; sibling-comparison across parallel
   implementations (GCM vs CCM parameter handling; static vs dynamic
   channel paths; certificate vs checker policy keying).
7. **Fix-history analysis** — recent upstream security fixes studied for
   sibling defects and incompleteness (e.g. Node.js residual of a July 2026
   fix cluster; PHP mbstring defect adjacent to a landed fix).

## C. Verification

8. **Root-cause analysis** — attacker-controlled input traced to the faulty
   construct; hardening-flag interactions analyzed.
9. **Dynamic verification** — sanitizer builds from the pinned commit;
   purpose-built harnesses linking unmodified vulnerable translation units;
   deterministic race simulation where the defect is a race; control
   experiments proving the defect is specific to the identified branch.
10. **False-positive elimination** — multiple independent tools, repeated
    runs, parameter sweeps (different buffer sizes), and post-patch clean
    runs. Potential findings that cannot be runtime-verified on the audit
    platform are documented as potential, never upgraded.

## D. Conclusion

11. **Impact assessment** — bounded by the validated process model; severity
    expressed as a *proposed* CVSS vector with reasoning and caveats.
12. **Patch development** — where useful: minimal fix + robust alternative,
    validated by (a) harness clean, (b) functional sanity tests, (c) the
    official upstream test suite; tree restored to pristine state
    afterwards.
13. **Reporting** — per-finding reports with evidence indices; a
    confidential vendor report per project; public redacted documentation
    (this repository).

## Evidence standards

- Every confirmed finding names its verification artifacts (tool, run,
  location in the private archive).
- Every cleared candidate names its clearing rationale.
- Every status label (confirmed / potential / informational / false
  positive) is backed by the record — presentation never outruns evidence.
