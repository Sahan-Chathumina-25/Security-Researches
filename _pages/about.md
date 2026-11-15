---
description: "Profile of an independent security researcher: research interests, technical focus, and evidence discipline across five open-source audits."
layout: project
permalink: /about/
title: About
eyebrow: Researcher profile
lede: The public documentation layer of an independent security research program.
---

![Illustration of source-code analysis: a file tree, a magnifier over code, and research notes]({{ '/assets/images/illustrations/research-analysis.svg' | relative_url }}){: .prose-illustration }

## What this portfolio is

This site is the public documentation layer of an independent security
research program. The research itself is performed in a private working
archive on Kali Linux (WSL2), where each project is carried from
source-code acquisition through verification, patching, testing, and
disclosure preparation. Only what can be published without enabling misuse
of an unpatched issue appears here.

## Research interests

- **Memory safety in C** — out-of-bounds reads, uninitialized-memory use,
  integer handling in parsers and protocol handlers.
- **Trust-boundary and policy-isolation defects** — cases where a security
  policy selected by application code is silently not enforced (e.g. TLS
  identity-verification policy isolation in Node.js).
- **Resource-exhaustion and availability** — client-controlled lengths and
  indices that drive unbounded allocation or out-of-buffer parsing.
- **Hardening interactions** — how upstream compiler hardening flags change
  the observable behavior of a defect.
- **Verification methodology** — harnesses that link unmodified vulnerable
  translation units and replay attacker-controlled wire-format input,
  cross-checked between independent tools.

## Technical focus

The five completed projects cover widely deployed codebases: PHP (php-src),
OpenSSL, OpenSSH, xrdp, and Node.js — spanning interpreter extensions,
cryptography and TLS layers, protocol servers, and JavaScript runtime
internals.

## Evidence discipline

Every project distinguishes explicitly between confirmed findings
(reproduced under a sanitizer or proven statically), potential findings
(argued from code, not yet runtime-verified), false positives (screened and
cleared, kept on record), and informational observations (real defects
without established security impact). Statuses are never upgraded without
evidence.

Full details: the
[methodology summary on this site]( {{ '/methodology/' | relative_url }} )
or
[METHODOLOGY.md in the repository](https://github.com/{{ site.github_username }}/Security-Researches/blob/main/METHODOLOGY.md).
