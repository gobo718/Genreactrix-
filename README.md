# Genreactrix v0.9.40.118 — Theme Rerun frozen-evidence experiment

## v0.9.40.118

- Theme Rerun now uses a two-stage experimental pipeline.
- Stage 1 creates a frozen factual Evidence Ledger from the image plus any included AI Description before any Theme is selected.
- Stage 2 receives no image; it chooses/scales the exactly-three Theme result only from the frozen ledger plus the existing Theme definitions and Director constraints.
- Theme Edit Log reasons must cite the frozen E# evidence used. Missing/bad reasons are repaired without image access and without changing the selected Theme or confidence.
- Existing v0.9.40.117 Edit Log entries are intentionally not treated as current frozen-evidence logs.
- Normal (non-rerun) AI Theme Analysis is unchanged.
- No Prim/PrimFusion semantic definition changes. PrimFusion Matrix remains 0.0.0.0.
- Worker counterpart: v0.9.6.64-theme-rerun-frozen-evidence.
