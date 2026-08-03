# Genreactrix v0.9.2s — Landscape Composition Correction

Canonical continuation of v0.9.2q.

## Corrections in this build

- Enforces the canonical landscape front page at every landscape viewport rather than only very short browser heights.
- Keeps the Image Console and its AI freeform description visible beside the Director Console.
- Keeps Home AI primitive/reaction weights visible in folded landscape.
- Preserves the shared 7-over-6 reaction layout with the lower row offset by one half slot while allowing spacing to tighten when the Image Console is present.
- Renders the landscape Theme workspace as one continuous 13×13 matrix.
- Re-renders the matrix when orientation changes so a matrix opened before rotation cannot remain in the portrait three-band form.
- Keeps the complete landscape matrix collapsible as one unit.
- Preserves the iterative Undo/Redo duplicate skipping introduced in v0.9.2q.
- Preserves portrait behavior, storage namespaces, and the standard four-file package.

## Target QA

1. On the Fold6 in folded landscape, Home shows Image + AI description on the left and Director on the right.
2. AI primitive/reaction weights remain visible.
3. Reactions remain a centered 7-over-6 stagger, with tighter spacing caused by the restored Image Console.
4. Theme 1/2/3 opens one continuous 13×13 matrix, not three bands.
5. Rotate while the Theme workspace is open; portrait and landscape matrix forms update correctly.
6. The full landscape matrix collapses and expands as one unit.

Package: `index.html`, `app.js`, `styles.css`, `README.md`.

## v0.9.2s — Landscape composition and matrix typography repair

- Corrected the responsive console fraction variables so the Image Console and Director Console render side by side in landscape instead of allowing the Director Console to occupy the full workspace.
- Preserved the existing square image viewport, AI freeform description, primitive weights, AI button, zoom/pan, and expand controls.
- Reused the established portrait 85%/15% matrix typography algorithm.
- Replaced overflow detection based on clipped `scrollWidth` with intrinsic canvas text measurement so the longest 15% of labels reliably shrink to fit.
- Delayed matrix fitting until two animation frames after render so the one-piece 13×13 landscape grid has its final cell widths before measurement.
