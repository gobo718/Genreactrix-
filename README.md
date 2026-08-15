# Genreactrix v0.9.40.48 — AI Drawer Load Defaults

Built directly from the accepted v0.9.40.47 drawer-button typography baseline.

## v0.9.40.48 — Load-time AI control defaults

When an image loads, including navigation away and back:

- If all three Director Theme slots are populated AND at least one Director Reaction is selected, AI Reactions, AI Themes, and AI Description default ON/selected.
- If any Director Theme slot is blank OR no Director Reaction is selected, all three default OFF/unselected.
- The rule runs only on image load. Manual changes to the three AI buttons remain under Director control for the rest of that image visit.
- Returning to the image causes the load rule to apply again from its current saved Director classification.

### Protected scope

No layout, CSS, font, spacing, geometry, image rendering, AI rerun semantics, classification persistence, or workflow ownership changes are included.

### Inherited from v0.9.40.47

All accepted v0.9.40.47 behavior and typography remain unchanged.
