# Genreactrix v0.9.40.171 — Theme-derived Reactions + Tuned provenance

Built from v0.9.40.170.

Changes:
- Removes the independent AI Reaction scan from normal analysis.
- Reactions are now 100% derived from the three selected Themes: six equal Theme→Prim slots at 100/6 each, with duplicate Prims accumulating.
- Reaction-only recalculation is local/deterministic and does not call an AI provider.
- Theme reruns automatically recalculate Reaction weights from the new Theme set.
- Tuned now means explicit Director tuning context (guidance / Theme rerun / Description rerun), not automatic reruns or artifact version increments.
- No historical cleanup/migration is included; current calibration workflow wipes packs between runs.

Worker baseline: 0.9.6.127-theme-derived-reactions.
