# Genreactrix v0.9.40.177 — P13 audit repair

- Follow-up verification release built from v0.9.40.176.
- No taxonomy semantics changed from v0.9.40.176: 12 Prims, 63 assigned PrimFusion Themes, 3 open pair slots.
- Repairs Prompt Diagnostics after Smart retirement: five complete 15-concept batches / 75 concepts total.
- Synchronizes live Prompt Diagnostics counts, progress, batch labels, report heading, and call-count descriptions.
- Retains intentional legacy P13→P12 migration handling for pre-retirement records.

---

# Genreactrix v0.9.40.176 — Smart retired / Celebration renumbered

- Retires P12 Smart completely.
- Moves Celebration from P13 to P12, following the same contiguous-active-ID policy used when Ticket was retired and Angry moved into P07.
- Retires Innocence, Elegant, and Gloomy.
- Moves Mundane to PFM0203 (Beautiful + Tragic), preserving the exact Mundane definition.
- Moves Glory to PFM0512 (Intense + Celebration), preserving the exact Glory definition.
- Recodes every surviving Celebration fusion from former PFMxx13 to current PFMxx12.
- Active taxonomy: 12 Prims, 63 assigned PrimFusion Themes, 3 open pair slots.
- No active Smart vocabulary remains. Historical release notes below are retained as history.

---

# Genreactrix v0.9.40.175 — Smart cleanup

Built from v0.9.40.174 with Worker 0.9.6.130-smart-cleanup.

Current taxonomy: **13 Prims / 66 assigned PrimFusion Themes / 12 OPEN pair slots**. Matrix identity remains **0.0.0.0**.

## v0.9.40.175

- PFM0608 🌀🌌: OPEN → Spirituality; prior PFM1113 👻🎉 Spirituality → OPEN.
- PFM0307 😭🤬: Shame → Overstimulated; prior PFM0512 💥🧠 Overstimulated → OPEN.
- PFM0310 😭🤢: Despair → Shame.
- PFM0305 😭💥: Devastating → Despair; Despair absorbs useful Devastating ruin/aftermath/loss coverage.
- PFM0412 🤣🧠: Witty → OPEN.
- PFM0405 🤣💥: Cringe → Hilarious, using the prior Witty definition unchanged.
- PFM0406 🤣🌀: Zany → Absurd.
- PFM0408 🤣🌌: Absurd → Medicated; prior PFM0812 🌌🧠 Medicated → OPEN.
- PFM1013 🤢🎉: OPEN → Excess; prior PFM1012 🤢🧠 Excess → OPEN.
- PFM1011 🤢👻: Macabre → Foreboding.
- PFM0311 😭👻: Foreboding → Paranoia; prior PFM1112 👻🧠 Paranoia → OPEN.
- Goofy absorbs useful Zany comic-eccentric coverage while retaining a gate against ordinary clutter, incidental awkwardness, and merely unusual appearance.
- Cringe, Witty, Devastating, Zany, and Macabre retire as standalone Theme names.
- Prompt Diagnostics updates to 79 concepts: 13 Prims + 66 assigned PrimFusion Themes.
- Existing Hot Magenta OPEN styling from v0.9.40.174 is preserved.
- Theme/Description provider routing, independent per-Theme audit, deterministic Theme-derived Reactions, Matrix geometry, and Matrix version remain unchanged.

## Final approved Matrix revision

- PFM0203 ✨😭: Melancholic → Gloomy (same definition)
- PFM0409 🤣🌶️: Ribaldry → Raunchy (same definition)
- PFM0205 ✨💥: Majestic → Epic; Epic definition absorbs Majestic + prior Epic coverage
- PFM0508 💥🌌: Epic → Ethereal
- PFM0812 🌌🧠: Ethereal → Medicated
- PFM0512 💥🧠: Medicated → Overstimulated
- PFM1012 🤢🧠: Greed → Excess; definition absorbs visible Greed + Indulgent coverage
- PFM1013 🤢🎉: Indulgent → OPEN
- PFM0610 🌀🤢: Mutant → Strange; definition absorbs Mutant + Alien + Bizarre + Surreal coverage
- PFM0608 🌀🌌: Surreal → OPEN
- PFM0612 🌀🧠: Alien → OPEN
- PFM0106 🧸🌀: Bizarre → Kawaii
- PFM0109 🧸🌶️: Kawaii → OPEN
- PFM0103 🧸😭: Pitiful → Poignant; definition absorbs Pitiful + prior Poignant coverage
- PFM0312 😭🧠: Poignant → Mundane
- PFM0712 🤬🧠: Mundane → OPEN
- PFM0513 💥🎉: Pride → OPEN
- PFM0912 🌶️🧠: Kinky → OPEN
- PFM0708 🤬🌌: remains OPEN

Together with the pre-existing PFM0708 vacancy, the active taxonomy is now 13 Prims, 70 assigned PrimFusion Themes, and 8 open pair slots. Matrix identity remains 0.0.0.0.

## Definition changes

- Gloomy keeps the former Melancholic definition unchanged.
- Raunchy keeps the former Ribaldry definition unchanged.
- Epic preserves the useful coverage of both prior Majestic and Epic.
- Overstimulated is a new still-image-grounded definition centered on visible sensory/informational/social overload.
- Excess is grounded in visible overabundance, accumulation, consumption, luxury, indulgence, or waste rather than invisible desire.
- Strange consolidates the visible territory of Mutant, Alien, Bizarre, and Surreal while using concrete anomalous/impossible/transformed cues.
- Poignant preserves both prior Poignant and Pitiful coverage.
- Kawaii, Ethereal, Medicated, and Mundane retain their current runtime definitions when moved.

## Dependent consistency updates

- Removed/open PFM codes are excluded from both fixed Theme-order arrays and AI Theme vocabulary.
- Prompt Diagnostics now reflects 83 total concepts: 13 Prims + 70 assigned PrimFusion Themes.
- Theme recovery examples no longer reference an open PFM code.
- The affected Matrix cells, Worker registry entries, bundled Worker source, and definition reference file are synchronized.
- No AI Theme/Description routing, provider-lane behavior, deterministic Theme-derived Reaction logic, or Matrix versioning semantics were changed.


## v0.9.40.174
- PrimFusion Matrix cells labeled `OPEN` now use the existing Hot Magenta reject shade `#ff00a8`.
- No taxonomy, definitions, matrix assignments, geometry, AI behavior, or Worker behavior changed.
