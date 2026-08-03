# Genreactrix v0.9.2q — Folded Landscape Polish Round 1

Canonical continuation of the v0.9.2p folded-landscape prototype.

## Scope completed

- Restored the Image Console as a guaranteed visible part of the folded-landscape front page by removing rigid minimum-column widths that could push it outside narrow browser viewports.
- Preserved the Home AI primitive/reaction weight grid in folded landscape and compacted it instead of hiding it.
- Re-centered the canonical 7-over-6 reaction control using equal grid tracks and a consistently centered circular button treatment.
- Changed the landscape Theme workspace to one complete reusable 13×13 matrix rather than the three portrait matrix bands.
- Added a landscape-only control that collapses or expands the complete 13×13 matrix as one unit.
- Replaced recursive Undo/Redo duplicate skipping with bounded iterative traversal.
- Preserved portrait behavior, persistence keys, classification behavior, and the standard four-file package.

## Target QA

Primary target: Samsung Galaxy Z Fold6, folded, Chrome, landscape.

Confirm:
1. Image Console and Director Console are visible together on Home.
2. Home AI primitive weights remain visible.
3. Red selection circles are visually centered around reaction emoji.
4. Theme 1/2/3 opens one continuous 13×13 matrix.
5. The complete matrix collapses and expands as one unit.
6. Undo/Redo behavior remains unchanged for ordinary actions and duplicate snapshots.

Package: `index.html`, `app.js`, `styles.css`, `README.md`.
