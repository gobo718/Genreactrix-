# Genreactrix v0.9.2z — Landscape Regression Corrections

Canonical source: v0.9.2y.

This release corrects the three Fold6 landscape regressions found during device QA.

## Director Console
- Reserves a dedicated compact toolbar row beneath the image and reaction panels.
- Keeps Undo, Redo, Reset Current Changes, and Clear Data in one 4×1 row.
- Prevents the toolbar from overlapping the panels above it.
- Keeps the Theme column independent and full-height on the right.

## PrimFusion Matrix
- Prevents the font-fitting pass from running while the expanded matrix has no measurable width.
- Repeats fitting after expansion and layout settlement.
- Restores visible row, column, and fusion labels while preserving the fit-at-any-size rule.

## Image Console
- Removes AI primitive/reaction results from this page.
- Keeps the image fully contained in the left column without viewport cropping.
- Keeps the four metadata fields in a 2×2 grid on the right.
- Places the adaptive, internally scrollable AI freeform description directly beneath the metadata.

## Preserved
- PrimFusion terminology and one-piece matrix.
- Existing state, persistence, history, navigation, and AI analysis logic.
- Portrait, tablet, and desktop behavior outside the targeted Fold6 landscape corrections.
- Standard four-file package.
