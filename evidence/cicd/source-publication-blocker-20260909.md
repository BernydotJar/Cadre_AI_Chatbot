# Source publication blocker — 2026-09-09

- Local `main` is 22 commits ahead of `origin/main` and zero commits behind.
- The dedicated audited repository-publication action was attempted for `main`.
- Result: BLOCKED — `GITHUB_TOKEN is required for git_push`.
- No shell credential workaround was used.
- Therefore `.github/workflows/ci.yml` and `.github/workflows/deploy-production.yml` are locally committed and verified but are not active on GitHub.

Resolution requires restoring the platform-managed GitHub credential for the audited publication action, then fast-forwarding `origin/main`.
