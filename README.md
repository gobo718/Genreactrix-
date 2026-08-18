# Genreactrix v0.9.40.110 — Nostalgia + Theme Rerun code-first recovery

## v0.9.40.110

- PFM0308 is renamed from Liminal to Nostalgia. Definition: **Old-timey, vintage, retro, memory-filled, or evocative of the past, childhood, bygone eras, or “the good old days.”**
- Theme Rerun now treats a valid eligible PFM code as authoritative identity even when the provider emits an incorrect human-readable label such as `Neutral`.
- Adds block-format recovery for the observed Markdown rerun response while preserving slot eligibility, uniqueness, exclusions, Preserve/Replace state, and PrimPicker constraints.
- Matrix remains **0.0.0.0**. No other Prim/PrimFusion definition changes are included.
- Worker updated to **0.9.6.56-nostalgia-theme-rerun-code-first**.

# Genreactrix v0.9.40.109 — Romance + Obsessive/Mundane calibration


## v0.9.40.109 — Romance + Obsessive/Mundane calibration

- PFM0208 Romance now requires specifically romantic evidence and explicitly includes marriage proposals and engagements, weddings, engagement rings, love letters, romantic hearts, roses, gifts, and chocolates.
- PFM0512 is renamed from Brilliant to Obsessive and carries forward the existing Obsessive definition.
- PFM1214 is renamed from Obsessive to Mundane for ordinary, routine, dull, commonplace, generic, monotonous, or visually unremarkable imagery.
- Matrix remains **0.0.0.0**. No other Prim/PrimFusion definition changes are included.
- Worker updated to **0.9.6.55-romance-obsessive-mundane-calibration**.

## v0.9.40.107

Supersedes v0.9.40.108 and bundles Worker **0.9.6.55-romance-obsessive-mundane-calibration**.

Changes in this bundle:
- Adds a 105-wide Prompt Diagnostics final-score self-check: assessment -> score, never score -> assessment. Before each final score, the AI must re-read its own completed component findings and revise a conflicting score rather than inventing evidence to defend it.
- Adds automatic recovery for provider output shaped as `CODE.NN <ASSESSMENT> - reason`: the reason is preserved and a tiny label-only repair call requests the missing assessment token. The parser never guesses the token from prose.
- Refines only these PrimFusion definitions from the completed arcade-image calibration pass: PFM0308 Liminal, PFM0412 Witty, PFM0414 Trolling, PFM0610 Mutant, PFM0614 Monstrous, PFM0712 Parodic, PFM0713 Snarky, and PFM1011 Horror.
- PFM0308 Liminal now begins with the canonical requirement: **Liminal is always quiet.** The prior transitional/threshold framing and negative laundry-list gate are removed.
- PFM0713 Snarky now positively requires observable sarcasm/mockery/dismissiveness/contempt and defines **smirk** versus an ordinary smile.
- PFM0614 Monstrous is now actually synchronized into the Worker registry; v0.9.6.53's bundled Worker had not carried the intended semantic wording even though the site text file did.
- No other Prim or PrimFusion definition changed in this bundle.
- Matrix remains **0.0.0.0**.

The release remains shallow/flat at archive root except for the required Worker folder structure.


## v0.9.40.107 — Danger Zone
Adds a password-protected Settings → Danger Zone cleanup workspace with thumbnail review, sorting/filtering, scope-specific bulk deletion, preflight impact/preservation screens, typed confirmation, full product reset, Prompt Diagnostics purge, derived-data reset, and post-delete integrity checks. Reset All Product Data preserves the configured Genreactrix system while removing imported product and product-derived test data. Worker remains 0.9.6.54.


## v0.9.40.108 — Danger Zone browser-bar clearance
- Adds mobile-only black scroll clearance at the bottom of the Danger Zone so the final action controls can be scrolled completely above Android/Samsung Internet/Chrome browser bars.
- Clearance is `150px + env(safe-area-inset-bottom)` and changes no Danger Zone control geometry, ordering, or behavior.
- Worker remains **0.9.6.54** byte-for-byte unchanged. PrimFusion definitions and Matrix **0.0.0.0** remain unchanged.
