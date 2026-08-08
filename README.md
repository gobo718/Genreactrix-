## v0.9.39.60 — Image View reaction-field centering cleanup

This build replaces the layered horizontal-position correction with one centering authority.

- The reaction formation geometry is unchanged.
- Ring size, emoji size, row spacing, brick stagger, custom-reaction placement, and relative positions are unchanged.
- The field still computes its exact bounding box and only scales as one rigid object when necessary to fit.
- JavaScript no longer adds margin offsets after calculating the field size.
- CSS no longer adds a second `left:50% / translateX(-50%)` correction.
- The Image View reaction region centers the field directly with `justify-self:center` and `align-self:center`.

This avoids double-centering and keeps the correction scoped to Image View only.
