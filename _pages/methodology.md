---
description: "The evidence-driven, phase-based research process: pinned source, triaged analysis, controlled verification, patch validation, and reporting."
layout: default
permalink: /methodology/
title: Methodology
eyebrow: Research process
lede: An evidence-driven, phase-based process applied identically to every project.
---

Each project follows an evidence-driven, phase-based process. What is
constant across projects is the evidence chain: pinned source → triaged
analysis → controlled verification → patch validation → report.

## 1. Source acquisition and pinning

Source is acquired from official upstream repositories at a specific
commit or release tag (recorded in every document). The audited tree is
kept pristine; all builds are out-of-tree in dedicated directories; tag
signatures are verified where available.

## 2. Baseline and clean builds

Configure/build logs are recorded per build variant (normal, sanitizer,
static-analysis). Upstream test suites are run before auditing to
establish a behavioral baseline (e.g. xrdp 213/213 unit tests with 0
compiler warnings before any audit work).

## 3. Architecture and attack-surface analysis

Written architecture, trust-boundary, and attack-surface documents are
produced before auditing. The target's process model (privilege levels,
fork-per-connection, per-session helpers) is established so impact
assessment has a factual basis.

## 4. Static analysis

clang scan-build / `clang --analyze`, cppcheck, and GCC/Clang warning
passes — every report triaged to confirmed defect, benign pattern, or
false positive with recorded rationale. Negative results are retained.

## 5. Manual source review

Deep audit of parsing, protocol, crypto-adjacent, and memory-safety-
critical paths. Recent upstream security fixes are studied to identify
sibling defects of the same class, including incompleteness in shipped
fixes.

## 6. Candidate root-cause analysis

Every candidate is traced from attacker-controlled input to the faulty
construct, including build-flag interactions (e.g. how
`-ftrivial-auto-var-init=zero` masks uninitialized reads in shipped builds).

## 7. Dynamic verification

Sanitizer builds (ASan/UBSan/MSan) from the exact audited commit, Valgrind
memcheck cross-checks, and purpose-built harnesses linking the unmodified
vulnerable translation units replaying attacker-controlled input.
Control experiments are mandatory: a run demonstrating that the defect is
specific to the identified code path, and post-patch runs demonstrating a
clean result.

## 8. Patch development and regression

Researcher patches are validated three ways: harness clean, functional
sanity tests pass, and the official upstream test suite passes. After
validation the tree is restored to the pristine pinned revision and
re-verified.

## 9. Impact assessment and severity

Impact is bounded by the validated process model; severity is expressed as
a proposed CVSS vector with reasoning and is explicitly left for vendor
triage to finalize. No score is presented as authoritative.

## 10. Reporting and responsible disclosure

A confidential vendor-ready report is prepared per project and held until
submitted through the project's official security policy. Public
documentation is redacted while issues are unpatched — no PoC code,
trigger inputs, or reproduction steps are published.
