# Genreactrix v0.9.40.169 — Fast Theme audit + deferred reporting sidecar

Behavior/AI-engine release based on v0.9.40.168. Requires Worker v0.9.6.120.

## Change
- Fresh Theme acceptance now uses a compact **decision-critical audit** of only the three selected Themes.
- The decision audit keeps the same strict SUPPORTED / WEAK / REJECT and GATE_PASS / GATE_FAIL checks, including contradiction handling.
- The former heavy diagnostic work — all active Prim scores plus up to 12 serious Theme candidates — is removed from the image decision path.
- That heavy diagnostic is queued as a **background reporting sidecar** and merged back into stored Themes Info when it completes.
- A stale sidecar is discarded if the image's selected Theme triplet changes before the sidecar returns.
- A reporting-sidecar failure does not turn an otherwise successful Theme result into an AI failure.
- The existing Selected job panel now labels the critical stage **Theme decision audit** and notes when the full reporting diagnostic has been queued.
- No existing UI region is moved, resized, rearranged, or reflowed.

## Worker dependency
- Worker v0.9.6.120 adds `/api/genreactrix/theme-report-diagnostic` for the deferred full reporting sidecar.
- The ordinary `/api/genreactrix/analyze` and `/api/genreactrix/analyze-stream` paths remain available.
- Provider order remains **Mistral → GPT-4.1 mini → Qwen 3.7 Plus**.
- Worker v0.9.6.119's TransformStream compatibility repair is retained.

## Reporting behavior
- The immediate stored Themes Info contains the fast decision audit and marks the full reporting sidecar pending.
- When the background sidecar completes, the full Prim/candidate diagnostic becomes the main stored diagnostic and the original decision audit is retained inside it as `decisionAudit`.
- A separate immutable `theme-report-diagnostic` artifact and history entry are created for the background sidecar without replacing the classification attempt as the current/latest classification attempt.

## Not changed
- No Theme/Reaction definitions or PrimFusion Matrix identity changed.
- No Theme ranking rule, whole-run provider replacement rule, or independent-review acceptance rule was removed.
- Reaction analysis, Description generation, Queue, Bundle, Batch, and lifecycle ownership remain unchanged.
