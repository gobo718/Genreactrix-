# Genreactrix v0.9.5.0

Portrait configurable quick-action architecture.

- Removes the separate portrait navigation bar.
- Gives each module a consistent first row: up to two quick actions on the left and the module console button on the right.
- Keeps Batch, Images, AI, Queue, and Reports as separate portrait modules.
- Provides sensible defaults while allowing either quick slot to be hidden.
- Long-press a quick button to edit its action preset.
- Long-press a module button to configure that module's first quick slot, including restoring a hidden slot.
- Reuses the owning action's required fields and checkboxes when creating a preset.
- Shows a verification summary with Cancel, Edit, and Save before committing the preset.
- Stores action binding, parameter snapshot, visibility, slot, and custom label without duplicating engine logic.
- Leaves landscape, tablet, desktop, shared data, and reusable assets unchanged.


## v0.9.5.0 — Shared Images Engine

- Added an orientation-neutral Images Engine with a persistent manifest.
- Folder imports create temporary working copies in IndexedDB and preserve original path/provenance metadata.
- URL intake supports hyperlink-only records and optional downloaded working copies, with CORS-safe fallback to hyperlinks.
- Added stable image IDs, lifecycle states, storage states, saved/flagged hooks, and cleanup APIs.
- Portrait image counts now come from the shared engine.
- Existing folder and URL quick actions call the engine rather than owning acquisition logic.
- Added a compact Images intake console for folder and URL workflows.
- Landscape/tablet composition was not redesigned.
