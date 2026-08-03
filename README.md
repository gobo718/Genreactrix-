# Genreactrix v0.9.2p — Folded Landscape Workspace

This build starts from the canonical v0.9.2o final Portrait implementation.

## Scope

- Preserves the verified v0.9.2j storage namespace and existing classification/state behavior.
- Preserves the completed Portrait layout.
- Activates the existing console architecture for landscape without reopening the state engine.
- Fits the folded-landscape working view to short, wide browser viewports such as the Galaxy Z Fold6 cover display.

## v0.9.2p changes

- Added a dedicated compact-landscape fit for viewports up to 520 CSS pixels high.
- Kept the Image Console and Director Console simultaneously visible.
- Reflowed the Image viewport and AI freeform description side by side in folded landscape.
- Tightened navigation, reaction, theme, write-in, retention, flag, and next-image controls without removing editable fields.
- Preserved Director Console scrolling as the safety mechanism for unusually short browser viewports.
- Preserved divider resizing, divider lock, Reset View, image collapse, state persistence, Undo/Redo, Theme selection, and image navigation.

## Package

- `index.html`
- `app.js`
- `styles.css`
- `README.md`

## Primary acceptance target

Galaxy Z Fold6, folded, landscape, Google Chrome. The exact usable viewport may vary with browser UI and display scaling, so the running device remains the final visual acceptance environment.
