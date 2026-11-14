---
layout: default
permalink: /methodology/
title: Methodology
---

# Research Methodology

This document describes the research process actually used across the five
completed projects. Phases marked as used in specific projects are noted; no
phase is claimed where the research record does not support it.

## 1. Source-code acquisition and pinning

- Source is acquired from the official upstream repository at a **specific
  commit or release tag**, recorded in every project document (e.g. php-src
  `251fe7729…`, OpenSSL `5dbd6501e…`, OpenSSH `V_10_6_P1` @ `a8c72b842…`,
  xrdp v0.10.6.1 @ `80c52879f…`, Node.js `67e45e4a…`).
- The audited tree is kept **pristine**. All builds are out-of-tree (VPATH)
  in dedicated build directories; research patches are applied to throwaway
  copies and the tree is restored afterwards.
- Release tags are verified where available (e.g. the OpenSSH `V_10_6_P1`
  tag signature was checked against the maintainer's key).

## 2. Environment baseline and clean builds

- Configure/build logs are recorded for each build variant (normal, sanitizer,
  static-analysis). Example: xrdp built with 0 compiler warnings and the full
  unit suite green (213/213) *before* any audit work, to separate existing
  breakage from research effects.
- Compiler toolchain versions are fixed and documented (GCC 16.2.0,
  Clang 21.1.8 on the audit platform).

## 3. Architecture and attack-surface analysis

- Written **architecture**, **trust-boundary** and **attack-surface**
  documents are produced before auditing (all five projects). For OpenSSH and
  Node.js these include trust-boundary definitions derived from the projects'
  own security policies.
- The process model of the target (privilege levels, fork-per-connection,
  per-session helpers) is established early so impact assessment has a factual
  basis.

## 4. Static analysis

- **clang scan-build** / direct `clang --analyze` per translation unit —
  e.g. 337 OpenSSL reports and 60 OpenSSH CSA reports triaged individually.
- **cppcheck** exhaustive per component.
- GCC/Clang warning passes (`-Wall -Wextra`) over full builds.
- Every analyzer report is triaged to one of: confirmed defect, benign
  pattern, or false positive. False-positive lists are retained (e.g. the 17
  OpenSSL candidates cleared with rationale).

## 5. Manual source review

- Deep manual audit of parsing, protocol handling, memory-safety-critical and
  crypto-adjacent paths: e.g. PHP mbstring/uri/bcmath, OpenSSL ASN.1/X.509 and
  EVP/provider parameters, OpenSSH packet framing and agent protocol, xrdp
  transport/channel/chansrv protocol modules, Node.js `https` Agent keying.
- Recent upstream security fixes are studied to identify sibling defects of
  the same class (e.g. the Node.js July 2026 CVE-2026-48934/58040 cluster, and
  the mbstring fix adjacent to PHP V1).

## 6. Candidate root-cause analysis

- Every candidate is traced from attacker-controlled input to the faulty
  construct, with the exact code path and data-flow explanation.
- Build-flag interactions are analyzed explicitly: e.g. OSSH-001's
  uninitialized `struct stat` is masked in its uninitialized form by upstream's
  `-ftrivial-auto-var-init=zero` default, so the verification harnesses
  disable that flag to exhibit the defect.

## 7. Dynamic verification

- **Sanitizer builds**: AddressSanitizer, UndefinedBehaviorSanitizer (GCC),
  and MemorySanitizer (Clang) from the exact audited commit.
- **Valgrind memcheck** cross-checks for key findings, including
  origin-tracking runs.
- **Purpose-built regression harnesses** link the *unmodified vulnerable
  translation units* and replay attacker-controlled packets/inputs
  (xrdp: harnesses for sound/clipboard/audin/channel; OpenSSH: extracted
  verbatim loop with a wrap-shim deterministic race simulation; OpenSSL:
  public-API PoC programs).
- Verification is repeated where feasible (multiple runs, multiple buffer
  sizes, both pre- and post-patch) to eliminate flakiness.

## 8. False-positive elimination and evidence preservation

- Control experiments are mandatory: e.g. Node.js FIND-001 includes a control
  script showing that without an agent-level checker the strict per-request
  checker *is* enforced; xrdp harnesses prove post-patch runs are clean and
  legitimate traffic still parses.
- All tool reports, logs and PoC sources are archived verbatim per finding in
  the private research archive; public documentation links to descriptions
  rather than to exploitation material.

## 9. Impact assessment

- Impact is bounded by the validated process model (e.g. xrdp findings are
  per-connection or per-session scoped; no cross-session or pre-auth RCE
  claimed).
- Severity is expressed as a proposed CVSS vector with its reasoning, and
  explicitly left for the vendor's triage to finalize. No CVSS score is
  presented as authoritative.

## 10. Patch development and regression

- Researcher patches are developed where useful (two-line OpenSSL CCM fix,
  xrdp 4-file hardening patch, OpenSSH fallback-macro fix, Node.js keying
  options).
- Patches are validated three ways: harness clean, functional sanity tests
  pass, and the **official upstream test suite** passes (OpenSSL full
  `make tests` PASS; OpenSSH 489/489; xrdp 213/213).
- After validation the tree is reverted to the pristine pinned revision and
  re-verified clean.

## 11. Reporting and responsible disclosure

- A confidential vendor-ready report is prepared per project, containing
  affected versions, root cause, PoC, sanitizer logs, severity proposal,
  patch, and researcher contact.
- **No report has been submitted yet.** Public documentation therefore
  redacts reproduction details; see
  [findings/DISCLOSURE-STATUS.md](findings/DISCLOSURE-STATUS.md) and
  [docs/responsible-disclosure.md](docs/responsible-disclosure.md).

## Divergences between projects

The exact phase structure differs per project (OpenSSH used an 8-phase plan
with disclosure phases pending; xrdp used 12 phases; OpenSSL a parallel-audit
model). What is constant is the evidence chain: pinned source → triaged
analysis → controlled verification → patch validation → report.
