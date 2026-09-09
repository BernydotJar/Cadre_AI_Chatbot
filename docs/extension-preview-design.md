# Chrome integration preview — stretch design

Status: proposed, not implemented, not a release prerequisite. The owner suggested a floating assistant on the public Cadre site and supplied an adapter brief. This design translates that idea into a bounded optional increment; it does not authorize altering Cadre's production systems or publishing an extension.

## Product decision

Keep the public chatbot URL as the primary deliverable. A locally loaded Manifest V3 extension could add a launcher on https://cadre.ai/* and https://www.cadre.ai/* only. Label it **Integration Preview** and explain that it is an independent local demonstration, not a Cadre-installed service. The generic label preserves the owner's earlier wording requirement over the label suggested in the attachment.

Do not build another chatbot. The extension is a presentation/transport adapter for the same application API, knowledge, response policy and approved links.

## Entry gate — proposed G9

Do not add G9 by editing the frozen N1–N6 graph. After core readiness, obtain the scope decision and register a supported graph revision or a separately validated stretch graph linked to the original release evidence. If the pinned runtime cannot safely extend the graph, document that limitation; do not fabricate a node event.

G9 may start only after the deployed UI and real server round-trip work anonymously, S1–S6 and deterministic actions pass, knowledge is grounded, production build/tests pass, secrets are verified server-side, and the core archive is prepared. A failing optional adapter must not invalidate or delay the core deliverable.

Lifecycle: Producer → Extension Security Critic → real-browser QA on cadre.ai → Fixer → Independent Verifier → Persistent Evidence. No Chrome Web Store publication.

## Proposed boundary

Floating launcher / isolated panel → validated extension message → service worker → fixed approved HTTPS application endpoint → existing server orchestration.

- Manifest V3, top-frame content script, document_idle, ISOLATED world. Exact Cadre match patterns; no all-URLs, wildcard subdomains, tabs/history/cookies/credentials access.
- The service worker accepts a bounded request ID and validated chat payload, never a destination URL. Validate extension sender identity, document origin and frame, as well as message and response schemas.
- Generate manifest and fixed API origin from one validated config. Permit only the confirmed Vercel hostname for remote requests; omit credentials and reject redirects. Do not build a generic network proxy.
- The API hostname is public routing configuration, not a secret. OpenRouter details, tokens and server configuration never belong in the extension. No page-script message bridge or externally_connectable entry.
- Use a style boundary for the launcher. For a stronger panel data boundary, evaluate an extension-origin iframe rather than treating Shadow DOM as a security sandbox. Expose only the required panel resource to the exact Cadre origins, with a restrictive extension CSP.
- Reuse safe shared validation/rendering contracts, not src/provider or server-only imports. The existing wire response is reply + kind; it does not currently expose action IDs or structured citations. Do not pretend those contracts already exist or silently change the core API to match the attachment.
- Omit storage permission by default. Keep conversation state in memory. Add a preference only if there is a demonstrated need and approval; never store sensitive chat content.
- Bundle scripts locally; no remote executable code, eval, inline event strings or model HTML. Only exact approved links can navigate.

Chrome documents that isolated worlds separate JavaScript environments but share page DOM; Shadow DOM alone therefore does not prove private state isolation. Its cross-origin guidance also warns against arbitrary-URL request proxies. [Content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts), [Cross-origin requests](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests).

## Experience and proof obligations

A compact dark launcher, accessible “Open Cadre Assistant” tooltip, clear focus styles and keyboard open/Escape/close behavior. A bounded floating panel needs safe-area offsets, responsive sizing, reduced-motion support, explicit minimize/close semantics, focus restoration and no interference with navigation or forms. Prefer shared brand tokens, not copied third-party branding or assets.

Tests must demonstrate exact-domain activation; rejection on deceptive hosts; one widget per document; navigation/resize behavior; stylesheet isolation; malicious-message and arbitrary-URL rejection; text-only output; no sensitive storage or provider secret in build output; cancellation and retry; and no reading/modifying page forms, cookies, accounts or analytics.

Removing preview UI must abort pending work and dispose listeners/observers. Disable/uninstall must prevent reinjection. Verify behavior in an already-open tab; if injected DOM remains until refresh, document refresh as a required cleanup step rather than promising instantaneous removal. Cadre server assets and data remain untouched.

## Reviewer materials, only after implementation

- extension/README.md with exact build and Load unpacked steps, minimal permission rationale, endpoint configuration, two-minute demo, privacy and cleanup.
- Source under extension/src/, generated manifest, local icons and tests; reproducible build using approved tooling.
- Real screenshot evidence of launcher and open panel on cadre.ai, labeled as local integration preview. A localhost screenshot or mock background is not evidence of site integration.
- Exclude extension/dist from the core source ZIP as required. Prefer a reproducible build command; any separate small ready-to-load artifact needs explicit packaging documentation, not a silent dist exception.

## Not done

No extension source, build, installation, actual-site injection, screenshot or security test exists yet. Core UI/browser verification is still active. This document is the scope and sequencing proposal, not completion evidence.
