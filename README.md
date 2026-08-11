## v0.9.39.93 — Prim reactions + 114-point scoring

This build adds the finalized 14 Prim reaction definitions to AI Reaction Analysis
and changes Reaction scoring to the 114-point comparative method.

- Worker v0.9.6.4.
- Matrix remains v0.0.0.0 because it is still pre-live.
- AI allocates exactly 114 whole points across all 14 Prims, minimum 1 each.
- Worker validates the raw allocation, subtracts 1 from each Prim, and exposes the
  remaining 100 points as the reaction percentages.
- Raw `allocationPoints` remain attached to each stored reaction result.
- Theme Analysis remains grounded in the canonical 91-theme catalog from v0.9.39.92.

See `ACCEPTANCE-v0.9.39.93.txt` for scope and the research-integrity note about
legacy binary AI-agreement thresholds.

## v0.9.39.92 — PrimFusion Theme vocabulary update

- Matrix remains pre-live v0.0.0.0.
- PFM0209: Exposure replaces Horny.
- PFM0307: Shame replaces Dark.
- PFM0309: Humiliation replaces Rejected.
- Worker v0.9.6.3 now grounds Theme Analysis in the complete 91-Theme PrimFusion definition catalog before permitting Custom fallback.
- Existing Landscape full-image containment from v0.9.39.91 is preserved.
