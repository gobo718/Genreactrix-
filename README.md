# Genreactrix v0.9.40.172 — PrimFusion Theme relocations

## v0.9.40.172 exact Matrix changes
- ✨🌀 PFM0206: Psychedelic
- 🌀🌌 PFM0608: Surreal
- 🌀👻 PFM0611: Horror
- 🤢👻 PFM1011: Macabre
- 🌌🤢 PFM0810: Phantasmagoric
- 🌌🤬 PFM0708: OPEN (removed from selectable Theme vocabulary)

No other PrimFusion Theme locations were changed. Indulgent remains unchanged.

Built from v0.9.40.170.

Changes:
- Removes the independent AI Reaction scan from normal analysis.
- Reactions are now 100% derived from the three selected Themes: six equal Theme→Prim slots at 100/6 each, with duplicate Prims accumulating.
- Reaction-only recalculation is local/deterministic and does not call an AI provider.
- Theme reruns automatically recalculate Reaction weights from the new Theme set.
- Tuned now means explicit Director tuning context (guidance / Theme rerun / Description rerun), not automatic reruns or artifact version increments.
- No historical cleanup/migration is included; current calibration workflow wipes packs between runs.

Worker baseline: 0.9.6.128-theme-relocations.
