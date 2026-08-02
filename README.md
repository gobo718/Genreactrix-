# Genreactrix v0.9.1 — Canonical Desktop Mode

Built on the verified v0.8.3 Tablet baseline. Desktop Mode preserves the Portrait, Landscape, and Tablet workflows while adding the Director's docked laboratory workspace.

## Implemented

- One canonical docked desktop workspace.
- Image, Director, AI, and full 13×13 Matrix remain visible.
- Responsive fallback to Tablet, Landscape, and Portrait layouts.
- Mouse-resizable console dividers.
- Double-click divider auto-fit.
- Layout Lock and Reset View.
- Per-Director-account saved layouts using a namespaced storage adapter.
- Workspace Profiles: Classification, Image Study, AI Review, and Matrix Analysis.
- Mouse-wheel image zoom, drag-to-pan, and double-click reset.
- Desktop keyboard workflow: Alt+1–4 profiles, N/Right next, P/Left previous, F flag, Escape closes dialogs.
- Arrow-key navigation through the full matrix.
- Vertical page scrolling rather than forced matrix compression.
- Dynamic visible-label 15% AutoFit repair preserved.

## Run

Open `index.html` in a modern browser or serve this folder with any static server.

## Verification target

Desktop Mode activates at 1200×650 CSS pixels or larger. Smaller windows fall back responsively instead of crushing the consoles.

## Deferred

Floating or detachable windows remain intentionally out of scope.


## v0.9.1 Matrix label repair

- Restores the visible combination-reaction words inside every 13×13 matrix cell.
- Keeps the emoji/symbol shorthand above each label.
- Runs dynamic 15% AutoFit against the actual visible combination labels, not the symbol glyphs.
