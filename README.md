# Genreactrix v0.9.3.1 — Launch Candidate Corrections

Built from v0.9.2z with the agreed bounded completion scope.

- Director Console retains the compact reserved 4×1 action toolbar without overlap.
- PrimFusion Matrix preserves the 85% shared font size and individually shrinks only overflowing labels, down to 1px when necessary.
- PrimFusion fitting no longer runs against hidden/zero-width geometry, and stale delayed fit callbacks are cancelled so labels remain stable after expansion.
- Image Console uses a fixed square inspection viewport with `object-fit: contain`; portrait, landscape, square, and unusual aspect ratios are centered and never cropped.
- Image Console metadata remains 2×2 with adaptive AI description below.
- AI Console prose continues to inherit remaining height and scroll internally when needed.
- Existing portrait, tablet, desktop, state, storage, and classification behavior remain unchanged.


## v0.9.3.1 corrections
- Restores the current-image preview and AI freeform binding in AI Console.
- Gives AI freeform description all remaining landscape height.
- Uses the largest square Image Console viewport that fits vertically, with contain/no crop.
- Replaces visible iterative PrimFusion fitting with a deterministic shared 85% pass plus one per-label fit.
