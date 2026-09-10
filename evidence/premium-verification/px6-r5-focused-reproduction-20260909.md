# PX6 revision 5 focused browser reproduction — 2026-09-09

Scope: final-stage reproduction of the two runtime concerns raised by the retained Claude r5 source critique against committed source `9b3bbd0ec732986e86fa69df010a3b4ffbe4499e`.

Command:

`npx playwright test e2e/chat.spec.ts --config=playwright.config.ts --grep 'ambient media is local|ambient motion control never obscures' --project=desktop --project=mobile`

Result: **PASS — 4/4**.

Observed cases:

- desktop: ambient media pause/play reachability PASS;
- desktop: 320/360/760 responsive motion-control/hero non-overlap PASS;
- mobile: ambient media pause/play reachability PASS;
- mobile: 320/360/760 responsive motion-control/hero non-overlap PASS.

Interpretation: the critic's two runtime concerns are not reproducible on the current r5 source. No speculative CSS/z-index change is justified. Its remaining low-severity point is valid as a contract-clarity issue: at <=430px the launcher helper copy is deliberately hidden by the compact launcher design, while the button retains `aria-label="Ask Donna"`. The follow-up repair therefore adds an explicit mobile-hidden assertion instead of changing product behavior.

This focused run is not the PX6 full verification matrix and does not close any release gate by itself.
