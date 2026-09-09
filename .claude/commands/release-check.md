Perform a release-readiness audit; do not deploy or upload unless explicitly authorized.

Check the current committed snapshot, graph gates, clean-package evidence, public URL health, and deployment/source equivalence. Confirm CLAUDE.md, plan.md, .git history, and lightweight source ZIP requirements from the candidate guide. Confirm secrets, dependency folders, generated output, .codex and private inputs are excluded.

Return exactly one release state:
- COMPLETED
- PARTIAL_WITH_DOCUMENTED_BLOCKERS
- SAFETY_STOP

List only concrete blockers and the minimum unblock action. Never infer a live model comparison from dry-run evidence.
