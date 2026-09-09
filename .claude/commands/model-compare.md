Review the prespecified model comparison before spending budget.

1. Run `node tools/evaluation/compare-models.mjs --dry-run`.
2. Confirm the 14 fixed cases, 18-attempt maximum, $0.15 reservation ceiling, both allowlisted models, fail-closed accounting, and unchanged prompts/contracts.
3. If OPENROUTER_API_KEY is absent, stop with NOT RUN.
4. If the key is present, do not run live inference until the owner explicitly authorizes the bounded spend in the current session.
5. After an authorized live run, choose a model only if the evaluator marks it decision-eligible; otherwise retain the existing production default.
