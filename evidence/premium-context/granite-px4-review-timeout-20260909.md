# Granite PX4 evaluator timeout

A first bounded local Ollama request to `ibm/granite3.3:2b` supplied detailed current PX4 CSS/HTML/context/evidence and timed out after 150 seconds with zero response bytes. No PASS is claimed from that attempt. The request payload is retained as `granite-px4-review-request.json`; the zero-byte response file is not gate evidence. A smaller retry is allowed only as an independent bounded evaluator, not as a substitute for deterministic verification.
