# Genreactrix v0.9.2t — Folded-Landscape Image Console Refinement

Canonical continuation of v0.9.2s.

## Scope

This build changes only the Fold6 folded-landscape Home composition and the existing matrix label fitting behavior. Portrait, tablet, desktop, the dedicated AI Console, and the Director Console are otherwise unchanged.

## Folded-landscape Home changes

- Reduces the image column by roughly one third and keeps the image anchored to the left.
- Expands the AI freeform-description area into the reclaimed horizontal space.
- Fits the AI description dynamically, starting at the preferred landscape size and reducing it only as needed.
- Allows vertical scrolling inside the description panel if the text still exceeds the available height at the minimum readable size.
- Removes the AI primitive/reaction bar and percentage values from the folded-landscape Home Image Console.
- Keeps the complete AI percentages in the dedicated AI Console and other established analysis surfaces.
- Leaves the entire right-side Director Console unchanged.

## Matrix typography

- Retains the established portrait 85%/15% rule for the one-piece landscape 13×13 matrix.
- Selects the largest shared font size that allows approximately 85% of visible labels to fit.
- Individually shrinks only the remaining overflowing labels.
- Re-runs fitting after final matrix layout and viewport changes.

## Target QA

1. On the Fold6 folded in landscape, the image is smaller and remains left-aligned.
2. The AI description uses the larger right-hand portion of the Image Console.
3. Short descriptions use the largest fitting font; longer descriptions reduce before scrolling.
4. Very long descriptions scroll vertically, not horizontally.
5. No AI reaction percentages appear on the folded-landscape Home page.
6. The dedicated AI Console still shows all AI percentages.
7. The right-side Director Console is visually and behaviorally unchanged.
8. The landscape 13×13 matrix applies the 85% shared-size / 15% individual-shrink rule.

Package: `index.html`, `app.js`, `styles.css`, `README.md`.
