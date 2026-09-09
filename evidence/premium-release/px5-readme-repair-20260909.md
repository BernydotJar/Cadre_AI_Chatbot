# PX5 fixer — README release-state repair

Date: 2026-09-09 UTC.

The independent release auditor correctly rejected producer snapshot `3e08063f06b3e59e625a6081abdbdb5b45b92394`: the PX5 producer report claimed README state had been reconciled, but the committed README still said PX3/PX4 were the next READY nodes and PX5 was locked. That claim was too broad and is preserved in the original producer artifact rather than rewritten.

The documentation-only repair updates the README to the actual ledger state: PX2/PX3/PX3B/PX4 are DONE, PX5 is RUNNING, and premium production promotion remains forbidden until PX5 closes and `npm run release:gate` passes. The same pass corrected adjacent current README drift that was found by a focused stale-state sweep: repaired extension counts (72 unit/security/build, 24 synthetic, 17 scoped installed-site checks), the current restrained editorial Donna mark/ambient layer instead of the retired orbital avatar wording, and neutral external-submission language.

No source/runtime behavior, API contract, model configuration, dependency, release workflow, Vercel binding, or Graph baseline changed in this repair.
