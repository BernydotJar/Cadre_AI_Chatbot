# Hosting decision — proposal, not deployment approval

Reviewed 2026-09-08. The owner asked to compare Vercel, AWS and Terraform, then identified Vercel team `cadre-ai` and reported a Pro plan. The supplied new-project URL was inspected in the integrated browser, which showed Login/Sign Up rather than an authenticated team. This does not establish the state of the owner's other browser sessions. N5 remains blocked on verified access and deployment permission; no cloud resources have been created.

## Recommendation

Use Vercel for the first public release of this small Next.js application, subject to account authorization and plan eligibility. Keep application code on ordinary Node.js, HTTP and server environment variables. There is no database, object store, queue or provider-specific SDK to migrate.

This prioritizes a verified chatbot and a reviewable delivery process. It is an engineering recommendation, not a claim about the owner's billing plan, zero hosting cost or an already working deployment.

| Option | Fit for this delivery | Remaining validation |
| --- | --- | --- |
| Vercel | Native Next.js deployment with little infrastructure to operate. Recommended first target. | Authorized team, plan eligibility, Node 24 build, server secrets, timeout, anonymous access, spend controls and public smoke tests. |
| AWS container hosting | Viable future route for the standard Node server when AWS ownership or operational requirements justify it. | Approved account/region/budget, container build and runtime, ingress/TLS, secrets, logs, IAM, deployment and rollback. Not implemented or tested here. |
| AWS Amplify | Not currently a verified drop-in for this repository. | AWS's current support page lists Next.js 12–15; this application uses 16.3.4. Do not silently downgrade or declare compatibility. |

Vercel currently lists Node 24.x as its default, alongside 22.x and 20.x. Select 24.x for a deployment and retain actual build-runtime evidence; local Node 26 verification alone does not establish the deployed runtime. The package's engine range includes 24.x. Sources: [Vercel Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs), [Vercel Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [AWS Amplify compatibility](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html).

## What portability means here

Next.js supports a Node server or a Docker container. `output: "standalone"` can produce a traced minimal Node server; it requires deliberate inclusion of `public` (when present) and `.next/static`. The current repository uses the normal Next server, not a verified standalone/container build. A future container adapter needs its own build and runtime smoke test before being called portable. See [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying) and [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

Terraform makes provisioning repeatable, but each provider supplies its own resource types. An AWS service, Vercel project and another cloud's service are different resources with different IAM, networking, secret and lifecycle behavior. A module interface can share application inputs; its implementation cannot honestly be described as universal. See [Terraform providers](https://developer.hashicorp.com/terraform/language/providers).

Defer Terraform until a concrete hosting target is approved. If adopted, use a small target-specific root module, pinned providers, a reviewed plan, protected remote state and no committed state or secret values. Do not add an untested multi-cloud framework merely to suggest deployment readiness.

## Release gate for either target

1. Confirm account/team, target, region where applicable and permitted cost. Keep push, deployment and final submission as separate authorities.
2. Set only server-side live-inference variables through the host's secret settings. Never embed the API key in source, client variables, Terraform state committed to Git or the source ZIP. Preserve the owner's conservative operational expiry and OpenRouter budget.
3. Verify the host's request size, timeout and proxy identity behavior. In-process rate/budget reservations are best-effort and reset across processes; they are not distributed abuse protection. The API key's provider-enforced spending limit is the hard ceiling. Do not trust forwarded-IP headers without a verified ingress contract.
4. Run mock checks on the deployed runtime, then a small budgeted live chatbot roundtrip. Check anonymous access in a clean browser, mobile/keyboard behavior, safe errors, approved links and no secrets in delivered JavaScript.
5. Retain exact commit, URL, runtime, time, commands, results and rollback steps. A public page alone does not prove a working inference path. Do not close N5 or the release gate until these checks pass.
