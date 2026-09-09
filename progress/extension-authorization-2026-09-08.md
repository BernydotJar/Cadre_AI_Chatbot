# Parallel extension and project-management amendment

The owner explicitly requested a separate agent for the add-on, additional parallel work with documentation, and an Excel WBS for each component on 2026-09-08 (Guatemala). This supersedes the earlier proposal to wait for the core archive before starting any extension source work.

## Authorized increment

- Implement and locally build/test a Chrome Manifest V3 **Integration Preview** under `extension/`, using the existing toolchain. No new dependency, core wire-schema change or alternate chatbot engine is implied.
- Use only the two exact Cadre HTTPS domains for the launcher and only the existing public chatbot endpoint for its service-worker transport. No storage, cookie, history or credential access; no arbitrary network proxy.
- Keep the core release repair and verification separate. An optional adapter does not delay or invalidate the core deliverable. Its failure must remain visibly open.
- Produce a PM workbook with component/work-package breakdown, dependencies, role ownership, acceptance and evidence. Dates or estimates not supplied by the owner remain blank. Counts are not product-completion percentages.

This is source/build/mock-test authority, not permission to install into the owner's regular browser, alter Cadre servers or assets, publish to the Chrome Web Store, push Git, upload/email a submission, buy services or approve final release. Actual-site integration evidence remains a separate gated activity. Test-profile browser installation may be requested after security review, with any limitation stated honestly.

## Execution and ownership

The frozen N1–N6 baseline and ledger remain unchanged in definition. The G9 extension is tracked in its own validated stretch graph linked to this amendment and the core release evidence. The coordinator is the sole graph/Git writer. The extension producer owns `extension/**`; core UI repair, release checks and PM workbook are independently delegated. Real reviewers receive bounded source/test snapshots and issue separate reports. Shared configuration edits are coordinated explicitly.

Lifecycle: Producer → Security Critic → Fixer → Independent Verifier → browser integration evidence → package evidence. No G9 completion claim before its required evidence. The workbook is a dated planning projection, not a substitute for graph replay or approval.

## New work boundaries

Generic product naming takes precedence over the attachment's suggested label. Shadow DOM is a style boundary, not a guarantee of private conversation state. Prefer an extension-origin iframe for the panel, typed/validated extension messages, fixed destination, credentials omitted and redirects rejected. Reuse safe app contracts; do not import provider configuration or environment values.

The original extension design remains useful for requirements and risks; this amendment alone changes its source-work sequencing. Core final closure and any external publication/submission still require the owner's decision.
