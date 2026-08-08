## v0.9.39.61 — Image View rendered-bounds centering

- Centers the complete emoji/ring formation from the browser's actual rendered bounds after layout.
- Uses the exact delta between the reaction-region center and the transformed formation center.
- No hard-coded horizontal offset.
- Ring size, emoji size, slot spacing, stagger, custom placement, and relative geometry are unchanged.
- Change is scoped to Image View only.
