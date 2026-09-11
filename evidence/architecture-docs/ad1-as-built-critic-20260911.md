# AD1 independent architecture critic - AS-BUILT

VERDICT: PASS

1. **Scope integrity:** the model is limited to the frozen r15 runtime and evidence-backed optional adapters. It does not introduce auth, database, CRM, vector retrieval, GraphRAG, autonomous tools, or real email delivery.
2. **Authority boundary:** `ClientConfig`/product profiles and deterministic core remain the source of factual/link/boundary authority; `FactSelector` is correctly represented as a bounded selector rather than the application controller.
3. **Provider boundary:** OpenRouter is shown only behind the server-side `FactSelector`; the browser and Chrome preview do not receive provider credentials.
4. **Optional integrations:** Chrome preview and n8n are visibly separated from the public runtime path and their limitations match the retained repository documentation.
5. **Control plane separation:** GitHub CI/CD and Graph Harness appear only in the engineering-control view, not as runtime dependencies.
6. **Presentation recommendation:** keep the four AS-BUILT Lucid pages visually consistent and place a visible `AS-BUILT / DEPLOYED` banner on each so the AWS target cannot be mistaken for current production.
