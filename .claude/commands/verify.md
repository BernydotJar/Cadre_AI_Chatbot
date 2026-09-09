Verify the current Cadre AI chatbot snapshot without changing source.

Run, in order:
- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm run test:e2e
- Graph Harness validate/status

If a command fails, stop claiming readiness, preserve the exact failure, classify product vs environment failure, and propose the smallest repair. Do not rerun blindly. Do not use live provider budget unless explicitly authorized.
