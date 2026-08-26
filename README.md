# Genreactrix v0.9.40.183 — checkpointed Failsafe Cleanup

- Adds a separate Failsafe Cleanup method for Reset All Product Data.
- Failsafe deletes at most 10 IndexedDB records per committed transaction bite, then yields to the browser before continuing.
- A checkpoint is written after every bite. Pause, Resume, and Stop after current bite are supported; a browser close/reload can resume from the remaining persistent data after normal Danger Zone confirmation.
- Progress reports the active database/store, store number, records removed, and records remaining.
- Each store is count-verified when emptied; the existing final reset verification remains count-only.
- Existing v0.9.40.182 fast memory-safe Reset All remains available as the Fast cleanup option.
- Reset All no longer renders every image thumbnail on the review screen. Large resets show a lightweight selected-image summary instead, avoiding the multi-hour thumbnail preload observed with very large packs.
- Partial cleanup left by v0.9.40.181/.182 is safe input: already-empty stores are skipped and only remaining product data is removed.
- Preservation boundaries are unchanged.
- No Worker/AI behavior changes; bundled Worker remains 0.9.6.136-cloudflare-typecheck-fix.

# Genreactrix v0.9.40.182 — memory-safe Danger Zone reset

- Repairs Reset All Product Data after large browser-local runs.
- Full-reset impact counting now uses IndexedDB `count()` rather than loading complete stores into JavaScript memory.
- Full reset clears target stores directly, grouped by database, without reading rows first.
- Integrity verification is count-only; it never uses `getAll()` / `getAllKeys()` for full-reset verification.
- Cleanup yields between databases and reports visible clear/verify progress so mobile browsers can repaint.
- Full reset is idempotent: an interrupted partial reset can be run again safely to finish remaining product data.
- Preservation boundaries are unchanged: Customs, Prim/PrimFusion definitions, settings/credentials, code, report definitions/presets, storage configuration, and system history remain preserved.
- AI/server-job behavior is unchanged from v0.9.40.181.
- Bundled Worker synchronized to already-deployed 0.9.6.136-cloudflare-typecheck-fix; no new Worker behavior.

# Genreactrix v0.9.40.181 — durable server AI pass runner

- Adds an optional durable server-side AI job runner for normal full AI passes.
- Browser still owns canonical Image Records, artifact/history persistence, Director state, Theme Sweep evaluation, Bundling, and all interactive UI.
- When the Worker reports D1 + Queue + R2 bindings available, eligible full AI passes are handed off once and continue without the browser remaining foregrounded.
- The Worker Queue consumer reuses the existing `analyze()` pipeline unchanged; no prompt, provider-order, Theme, Description, audit, slop, or Theme-derived Reaction logic was replaced.
- Browser-local images are normalized to the existing 1280px JPEG transport copy, uploaded temporarily to R2, and removed after a successful harvest/cancel. Linked HTTPS images stay URL-backed.
- Server job state/results are durable in D1. Queue consumer concurrency is fixed at 1 for this first experiment, preserving the existing sequential image-job behavior.
- If the new server bindings are absent, Genreactrix automatically keeps using the existing browser-orchestrated path.
- Also fixes two pending matrix UI defects from v0.9.40.180: Cheeky uses the lavender region color, and the final right-axis box contains the Angry 🤬 Prim.
- Bundled Worker at the time of v0.9.40.181: 0.9.6.135-server-job-runner.

# Genreactrix v0.9.40.180 — final three PrimFusion Themes + matrix colors

- Fills all three remaining PrimFusion cells: PFM0109 Cheeky, PFM0708 Cursed, PFM1112 Halloween.
- Matrix now has 12 Prims / 66 assigned PrimFusion Themes / 0 OPEN cells.
- Restores and preserves the canonical lavender / peach / green-separator matrix palette.
- Prompt Diagnostics updated to 78 concepts / 6 batches (15, 15, 15, 15, 15, 3).
- Bundled Worker: 0.9.6.134-open-three-filled.

---

# Genreactrix v0.9.40.179 — Smart matrix/cache repair

## Matrix palette restoration
- Reasserts the established interlocked Matrix palette at final CSS precedence: very pale pastel lavender (`#d8c9e5`), very pale pastel peach (`#f2cba8`), green separator (`#a9dda5`), and Hot Magenta OPEN (`#ff00a8`).
- No matrix geometry, Theme placement, Prim numbering, or Worker behavior changed from v0.9.40.178.
- Bundled Worker remains v0.9.6.133.


- Replaces unsafe v0.9.40.177.
- Visible build number and all local asset cache-busters now use v0.9.40.179.
- Removes the 13 retired-Smart cells that incorrectly appeared as an OPEN far-right column in the interlocked matrix.
- Active interlocked matrix is 13 rows × 6 columns with only 3 legitimate OPEN pair slots.
- 12 active Prims; Celebration is P12; 63 assigned PrimFusion Themes.
- Prompt Diagnostics remains 75 concepts / 5 batches and its batch-track geometry now matches.
- Restores approved Goofy/Camp mapping in Worker and definitions: PFM0104 Goofy, PFM0204 Camp.
- No direct AI Reaction scan is reintroduced.

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
