# Genreactrix v0.9.40.106 — End-of-Image Diagnostic Calibration Bundle

## v0.9.40.106

Supersedes v0.9.40.105 and bundles Worker **0.9.6.54-diagnostic-self-check-term-calibration**.

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
