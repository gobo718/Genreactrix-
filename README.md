# Genreactrix v0.9.40.117 — Theme Edit Log comparative reasoning repair

## v0.9.40.117

- Renames the Theme-change reasoning dialog header to **Theme Edit Log**.
- Theme Edit Log reasons for changed slots must directly compare the new Theme with the Theme it replaced; generic image-description text is rejected as a valid change reason.
- Theme Edit Log identity schema advances to v3; older v2 logs are intentionally hidden so existing generic `.116` reasons cannot be presented as valid history.
- If a changed slot lacks a valid comparative reason, the Worker repairs **only that reason**. The selected PFM code and confidence remain immutable and are not rerun.
- The targeted reason repair must name both Theme labels and explain why the new Theme fits better using image-grounded evidence and applicable Director rerun constraints.
- If comparative-reason repair still fails, the Theme selection survives but no misleading Edit Log reason is stored/displayed for that change.
- Retains v0.9.40.116 image/artifact/attempt/slot identity binding and confidence-placeholder rejection.
- No Prim/PrimFusion semantic definition changes. PrimFusion Matrix remains 0.0.0.0.
