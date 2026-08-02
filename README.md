# Genreactrix v0.9.2d — Portrait State and Primitive Foundation

This build implements the dependency-first Portrait corrections from the approved review.

## Implemented

- Canonical 13-primitive registry with stable primitive IDs and matrix-order display.
- Shared 7/6 primitive renderer used by Home, Director, AI, and Image Inspection.
- Director selections use thick red circles.
- AI primitive output shows all 13 weights with `-%` for no meaningful weight.
- Image Inspection overlays Director circles and AI weights on one primitive layout.
- Theme slots store stable identities rather than display text, preventing duplicate matrix-cell selection.
- Image-aware Undo/Redo snapshots include records and image position.
- Theme 1 commit-and-advance is reversible across images.
- Reset Current Changes uses a visit-local classification baseline, preserves AI/flag data, warns once, and is undoable.
- Clear Data clears classification only, preserves AI/flag/profile data, warns twice, and is undoable.
- Director Console includes Undo and Redo controls.
- AI reruns append a new run record; Portrait displays the latest run.

## Notes

- The bundled AI analysis remains demo/static. The rerun action exercises AI Run History without claiming a live model connection.
- Existing legacy browser records are read when possible and normalized into the current theme structure.
- Full AI Run History browsing and Interpretation System history UI remain future work.

## Acceptance focus

Test the folded-phone Portrait layout first: primitive order, red selection circles, AI weights, Theme 1 advancement, image-aware Undo/Redo, Reset Current Changes, Clear Data, AI Console, and Image Inspection.
