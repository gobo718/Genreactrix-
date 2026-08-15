# Genreactrix v0.9.40.44 — Operational UI Refinement 1

Source: accepted v0.9.40.43 Director hydration-window baseline.

## Bounded scope

This release begins the deferred UI operational-refinement phase without redesigning the core Director/AI geometry.

- Short-landscape Filter is reorganized into a compact two-column control surface so All/Feed, Include/Exclude, Bundle, Sort, and the live match count remain visible together instead of requiring vertical hunting.
- Existing Single Image Inspector and Two-Image Comparator remain the shared evidence surfaces for manual per-image and two-image decisions.
- The AI-panel convenience command is now labeled **Bundle Available** and dispatches to the Queue-owned Bundle Engine to move all currently Staged images. This is a command shortcut only; ownership remains Queue.
- The redundant single-file picker remains removed; the surviving image picker supports one-or-many selection.

## Protected behavior

- v0.9.40.43 Inbox hydration-window/race fix preserved.
- No changes to AI 60/40 calculation.
- No changes to lifecycle ownership or Batch semantics.
- No changes to core Landscape Director/AI workspace geometry.

## Real-device acceptance

1. In short landscape, open Filter and confirm the full control set is visible together and usable.
2. Close Filter and confirm Director geometry is unchanged.
3. If Staged images exist, use AI panel **Bundle Available** and confirm all current Staged images move through the normal Queue-owned Bundle path into Inbox.
4. Open one Dupe/Repeat comparison or one Inspector case if convenient; previews/metadata/actions should remain usable.
