# Genreactrix v0.9.4.5

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
