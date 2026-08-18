# Genreactrix v0.9.40.116 — Theme Edit Log identity + confidence repair

## v0.9.40.116

- Theme Edit Log entries are accepted only when image ID, current Theme artifact ID, AI attempt ID, rerun token, captured prior Theme artifact, and Theme slot all agree.
- The Before triplet is captured at rerun submission and is no longer inferred from whichever historical Theme artifact happens to precede the current one.
- Existing pre-v0.9.40.116 Theme Edit Log entries do not satisfy the new identity contract and are intentionally not displayed.
- Provider protocol text is stripped from saved/displayed Theme-change reasons.
- Theme Rerun no longer accepts a literal `0-100` confidence placeholder as 0%. Malformed/missing confidence causes that slot to be repaired instead.
- Theme Rerun output templates now require one specific confidence number and explicitly prohibit copying `0-100`/`CONFIDENCE`.
- Retains v0.9.40.115 Theme Edit Log label/placement and v0.9.40.113 cache-loop correction.
- No Prim/PrimFusion semantic definition changes. PrimFusion Matrix remains 0.0.0.0.
