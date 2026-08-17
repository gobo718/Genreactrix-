# Genreactrix v0.9.40.79 — Reports Semantic Query Integrity

## Reports repairs

- Preserves the v0.9.40.78 Boolean/negation and immediate Batch-to-Reports synchronization fixes.
- Resolves stored Director reaction selections to human-readable reaction identities before Reports filtering, counting, PrimFusion fallback output, or AI–Director comparison. Existing Image Records are not rewritten.
- Resolves custom Director reaction tokens to their current human-readable labels when available.
- Corrects AI disagreement detection to compare canonical AI reaction names against normalized Director reaction names.
- Adds AI–Director agreement minimum/maximum percentage filters required by the booked Reports query architecture.
- “Most recent AI run” now means the most recent AI job regardless of component. The dedicated AI Theme Usage report separately targets the most recent Theme-enabled AI job.
- Date-range scope uses local calendar-day boundaries instead of UTC-midnight boundaries, including DST-safe next-day construction.
- Normal custom reports now retain useful matching-image rows even though the current Reports UI has no field selector.
- CSV export emits those matching-image rows as actual columns; aggregate-only reports retain the aggregate fallback CSV.

## Boundaries

- No Reports layout redesign.
- No CSS changes.
- No lifecycle/Housekeeping/Post-processing changes.
- Cloudflare Worker remains 0.9.6.35-reaction-rerun-combined-multimodal.
