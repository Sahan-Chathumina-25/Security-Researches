# About

## What this portfolio is

This repository is the public documentation layer of an independent security
research program. The research itself is performed in a private working
archive on Kali Linux (WSL2), where each project is carried from source-code
acquisition through verification, patching, testing and disclosure
preparation. Only what can be published without enabling misuse of an
unpatched issue appears here.

## Research interests

- **Memory safety in C** — out-of-bounds reads, uninitialized-memory use,
  integer handling in parsers and protocol handlers.
- **Trust-boundary and policy-isolation defects** — cases where a security
  policy selected by application code is silently not enforced (e.g. TLS
  identity-verification policy isolation in Node.js).
- **Resource-exhaustion and availability** — client-controlled lengths and
  indices that drive unbounded allocation or out-of-buffer parsing.
- **Hardening interactions** — how upstream compiler hardening flags change
  the observable behavior of a defect, and why dynamic verification must be
  performed under the right build configuration.
- **Verification methodology** — building harnesses that link the unmodified
  vulnerable translation units and replay attacker-controlled wire-format
  input, cross-checked between independent tools.

## Technical focus

The projects completed to date cover five widely deployed codebases:

- PHP (php-src) — scripting-engine extensions and bundled libraries.
- OpenSSL — cryptography library, TLS/DTLS/QUIC layers.
- OpenSSH — secure shell client, server and agent.
- xrdp — remote-desktop protocol server.
- Node.js — JavaScript runtime core modules.

## Why evidence discipline matters

Every project in this archive distinguishes explicitly between:

1. **Confirmed findings** — reproduced at runtime under a sanitizer, or proven
   statically when a runtime path is not reachable on the audit platform.
2. **Potential findings** — root cause argued from code but not yet runtime
   verified; never upgraded without evidence.
3. **False positives** — candidates screened and cleared, kept on record so
   the negative results are auditable.
4. **Informational observations** — real defects without established security
   impact, classified honestly.

## Contact

Professional contact is currently limited to the GitHub profile:
[github.com/Sahan-Chathumina-25](https://github.com/Sahan-Chathumina-25).
No other channels are published; nothing else has been verified from the
research record.
