## v0.3.13 Picture/Data State Controls

- Added **Clear Picture**: saves current work when necessary, removes the picture from the active folder session, and preserves its research data for reports and exports.
- Added **Reset Data**: keeps the picture loaded while clearing its annotation, confidence, favorite, review, flag, and draft state for a fresh classification pass.
- Changed destructive deletion to **Delete Picture + Data**, which clears both the active picture and its stored research record after confirmation.
- Added reusable flags with an optional free-text reason. New reasons automatically become future selectable options.
- Added flag filtering, flag search scope, flag display in search results, dashboard/HUD counts, JSON persistence, recovery persistence, and CSV export.
- Advanced workspace exports to schema version 3 while retaining the existing browser-storage key for compatibility.
- Synchronized the visible app and service-worker cache at v0.3.13.

## v0.3.12 Phase 2 Completion Patch

- Added an explicit, confirmed **Delete Annotation** action that removes the current saved annotation and its attached confidence, favorite, review, and draft state.
- Corrected confidence auto-review behavior to use the configured workflow threshold instead of a hardcoded 60%.
- Corrected loaded-folder progress totals so unrelated saved records no longer inflate completion percentages.
- Moved automatic recovery checkpoints behind confirmation gates for workspace reset and batch operations; cancelled operations no longer create false checkpoints.
- Added a pre-mutation recovery checkpoint for safe repairs only when repairable issues exist.
- Replaced disconnected transaction placeholders with functional snapshot validation and rollback helpers.
- Synchronized the visible application, export, documentation, and service-worker cache version at v0.3.12.

## v0.3.10 Validation Foundation
- Added transaction snapshot validation helper.
- Established validation foundation for future recovery pipeline.


## v0.3.9 Transactional Recovery
- Added transaction snapshot helpers for rollback infrastructure.
- Established foundation for atomic restore operations.

## v0.3.8 - Release prep
- Version synchronization.

# Changelog

## v0.3.8 — Storage Resilience

### Added
- Shared guarded helpers for all browser-storage reads, JSON reads, and writes.
- Visible failure reporting for taxonomy, workflow-rule, recovery-history, preference, and active-category persistence.

### Changed
- Workspace, taxonomy, automation, recovery, and preference storage now use one consistent failure path.
- Workspace imports stop cleanly when imported taxonomy persistence fails.
- Recovery restores stop cleanly when taxonomy or workflow-rule persistence fails.

### Preserved
- Existing browser-storage keys and workspace schema version.
- Existing annotation, taxonomy, automation, and checkpoint data formats.

## v0.3.6 — Data-Flow Hardening

### Added
- Canonical workspace normalization for saved state and imported JSON.
- Schema version 2 on workspace exports.
- Visible browser-storage failure state.
- Best-effort preservation of unreadable local workspace JSON under a timestamped recovery key.

### Changed
- Imports now validate and normalize records before replacing the active workspace.
- Import recovery checkpoints are created only after a valid file has been parsed.
- Reaction indexes, confidence values, ID lists, drafts, and annotations are normalized before persistence.

### Preserved
- Existing `genreactrix_workspace_v016` storage key for backward compatibility.
- Existing annotation IDs and numeric reaction-index format.

## v0.3.5 — Stabilization

First substantive release after the v0.3.4 recovery baseline.

### Changed
- Promoted the recovered application source to the release root.
- Removed dead placeholder-only DOM mappings and matching unused styles.
- Synchronized application, page, cache, and documentation version identifiers.
- Added a valid web app manifest and safe service-worker registration.
- Added canonical README, changelog, and living roadmap documents.

### Preserved
- Existing local-storage namespace for backward-compatible saved workspace data.
- Historical changelog fragments in `history/`.

## Recovery baseline

`v0.3.4` is retained as the recovery baseline. Verification-only archives after it are discarded from the implementation sequence and their release numbers may be reused for substantive work.


## v0.3.10
- Began centralized validation pipeline scaffold.


## v0.3.11
- Added validateTransactionSnapshot() validation hook.

## v0.3.11e
- Added validation snapshot helper foundation.
