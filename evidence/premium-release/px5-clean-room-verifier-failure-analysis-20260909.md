# PX5 clean-worktree verification failure analysis

A detached clean worktree at `76fe74c1933ba7c445725345bf497bf8eb0887c2` installed dependencies from the lockfile and passed Git integrity, typecheck, lint, 286/286 Vitest, production build, extension build, and 72/72 extension tests. It then failed the fresh synthetic extension browser check at `extension/tests/browser-mock.mjs:95` with `AssertionError: panel frame opened`.

The failure is in the verification harness timing, not accepted as a product PASS. The script clicks the launcher, waits only for the host element height to exceed 200px, and immediately searches `page.frames()` for the navigated `https://preview.extension.test/panel.html` frame. Host geometry can expand as soon as the iframe element is inserted while its navigation is still `about:blank`; the same script already uses `waitForEvent("framenavigated", ...)` with a bounded fallback when reopening the mobile panel later in the test.

Smallest repair: make the first panel-open path wait for the expected panel frame navigation using the same bounded pattern. Do not weaken any existing assertion or alter extension runtime behavior. After repair, rerun the full clean-worktree verification from a committed snapshot rather than treating a main-worktree rerun as independent proof.
