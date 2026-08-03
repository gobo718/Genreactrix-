# Genreactrix v0.9.3.8 — Verified Version + Measured PrimFusion Tiers

This correction updates the visible/runtime version consistently and replaces unreliable clipped-element overflow checks with an isolated off-screen text measurement probe. PrimFusion labels are measured at each fixed typography tier against the actual usable cell width.

## Corrections
- Visible page title, on-page version, runtime build constant, and cache-busting references all report v0.9.3.8.
- PrimFusion base tier remains the reduced 75% visual size.
- Labels wider than their cells move to 75% of that base.
- Remaining overflow moves to 50% of the base and may truncate.
- Measurement is performed outside the clipped label box, so mobile overflow clamping cannot conceal overflow.
- No iterative shrinking or multi-second timer loop.

This build applies the final bounded landscape refinements agreed after v0.9.3.1.

- AI Console removes redundant section headers and rerun instructions.
- Rerun AI Analysis now sits at the far right of the top bar.
- Primitive and theme sections are tightened and moved upward.
- AI freeform description receives all remaining height, shrinks to the readable floor, then scrolls internally.
- Image Console uses the largest square viewport that fits vertically and places data directly beside it.
- PrimFusion Matrix uses a fast three-tier typography pass: shared 85% size, 75% overflow tier, then 50% final tier with truncation allowed.
- PrimFusion fitting uses DOM overflow checks, no canvas metrics, no binary search, and no multi-second timer chain.
- Navigation arrow sizing is harmonized in folded landscape.

The verified v0.9.2j storage namespace and existing classification/state behavior remain unchanged.

## Changes from v0.9.3.2
- Reduced the PrimFusion Matrix shared typography baseline to 75% of its previous size.
- Overflow tiers now derive from that new base: 75% fallback, then 50% final fallback with truncation allowed.
- Replaced mixed text glyphs for Previous, Next, Undo, and Redo with one consistent SVG icon family.
- Preserved the existing storage namespace, classification state, console layouts, and three-tier DOM overflow detection.


## v0.9.3.5
- Completes the PrimFusion base → 75% → 50% typography tiers using rendered DOM overflow checks across two animation frames.
- Reserves the folded-landscape Director action row so Flag and Next image remain fully visible.

## v0.9.3.5

- PrimFusion typography now completes base, 75%, and 50% tiers in one synchronous fitting pass.
- Forced layout reads occur between tiers so overflow is measured after each font-size batch is committed.
- Removed the inter-frame tier handoff that could be cancelled by resize/generation updates after only the base tier.



## v0.9.3.6
- PrimFusion overflow is measured from the intrinsic DOM Range width against the usable cell width, avoiding mobile `scrollWidth` clamping.
- Typography is applied in one stable 100/75/50 tier pass based on the reduced 75% visual base.
- Previous/Next navigation uses the canonical bold `‹ ›` carets throughout the app.
- Back controls and the Home Next action use the same caret family.

## v0.9.3.8 diagnostic
Adds visible PrimFusion fit diagnostics and in-place Range measurement so Fold6 screenshots reveal the actual tier counts and clipped labels.
