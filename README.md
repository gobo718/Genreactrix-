# Genreactrix v0.9.16.1

## v0.9.16.1 — Portrait Viewport-Fit Correction

- Removed the blank scroll area below the Reports module when the Control Station already fits in the phone viewport.
- Made the portrait app shell use border-box sizing at exactly 100dvh.
- Confined scrolling to genuine content overflow instead of page-height overshoot.
- Removed inherited minimum-height behavior from the portrait Control Station.
- No module layout, engine behavior, or non-portrait mode changed.


## v0.9.16.1 — AI Console + One-Page Portrait

- Compressed Batch, Queue, Reports, spacing, and status rows to fit the portrait Control Station on one typical phone screen without removing quick-action capacity.
- Completed the operational AI console with modular analyze/rerun controls, active-batch and filtered targeting, automatic look-ahead settings, provider health/configuration, persistent job controls, selected-job detail, failures, and prompt/model metadata.
- No repository restructuring.


## v0.9.16.1 — Complete Images Console

- Full portrait Images console with shallow Add, Review, Saved, Flagged, Recycle, Failures, and History views.
- Folder and URL intake use the shared Images Engine.
- Hyperlink, temporary-copy, and prefetch-only modes.
- Real filtered Image Record views and recycle restore/purge controls.
- No repository restructuring.

## v0.9.16.1 — Maintenance and Recovery Engine

- Unified quick, full, and selected integrity scans.
- Persistent deduplicated maintenance issues and scan reports.
- Safe repair registry and guided recovery foundation.
- Recycle-bin preview and restoration coordination.
- Versioned backup preview, emergency pre-restore backup, merge/replace restore, and post-restore verification.
- JSON and CSV maintenance-report export.
- Maintenance notifications and routing.
- No repository folder changes.

## v0.9.16.1 — Settings Engine

- Added a canonical IndexedDB Settings Engine with typed definitions, defaults, validation, subscriptions, and legacy-key migration.
- Added full Settings console sections for daily defaults, AI, storage/recycle, batch, notifications, project, maintenance, and backups.
- Centralized default image/URL quantities, AI quick-add and buffer values, recycle retention, batch size, notification retention, project identity, quick-action presets, and AI provider configuration.
- Added settings export/import and versioned structured project backup generation.
- Added settings and project integrity entry points.
- Preserved the shallow repository structure; no folders were added, moved, renamed, or removed.


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


## v0.9.16.1 — Shared Queue Engine
- Adds one persistent Queue Engine for scheduling and operational state across engine-owned work.
- Migrates and removes the legacy localStorage AI look-ahead queue.
- Mirrors AI jobs/items into the shared queue without moving AI business logic out of the AI engine.
- Adds persistent queue jobs/items, priority, pause, resume, safe stop, retry, interruption recovery, and finished-record cleanup.
- Adds a connected Queue console and compact portrait counts.
- Keeps active Batch membership/order as the Director work source rather than duplicating image lists.
- Keeps the repository shallow: one new root file (`queue-engine.js`); no folder structure changes.

## v0.9.5.2 — Shared Images Engine

- Added an orientation-neutral Images Engine with a persistent manifest.
- Folder imports create temporary working copies in IndexedDB and preserve original path/provenance metadata.
- URL intake supports hyperlink-only records and optional downloaded working copies, with CORS-safe fallback to hyperlinks.
- Added stable image IDs, lifecycle states, storage states, saved/flagged hooks, and cleanup APIs.
- Portrait image counts now come from the shared engine.
- Existing folder and URL quick actions call the engine rather than owning acquisition logic.
- Added a compact Images intake console for folder and URL workflows.
- Landscape/tablet composition was not redesigned.


## v0.9.5.2 — Image Record Engine
- Adds one canonical, schema-versioned record per imported image.
- Separates record identity/state from blob acquisition/storage.
- Adds event emission, locking, queries, integrity verification, extensible metadata, component states, and recovery-ready references.
- Adds a 30-day recycle bin with Empty now, Empty before date, and Free MB oldest-first controls.
- Keeps records and analysis after blobs are purged.

## v0.9.5.2 — History Engine
- Adds immutable, schema-versioned history entries in IndexedDB without duplicating image blobs.
- Records image creation, AI analysis/reanalysis, Director classification/revision, workflow transitions, storage changes, Save/Flag/Lock changes, recycle, restore, purge, and recovery-related updates.
- Keeps the current Image Record optimized for normal use while preserving the sequence that produced it.
- Adds per-image timelines and filtered AI, Director, lifecycle, and storage history queries.
- Links each event to the previous relevant event for reanalysis and revision comparisons.
- Preserves undo/redo as new Director history events instead of erasing prior decisions.
- Extends integrity verification to detect history without records, broken links, duplicate event IDs, and invalid timestamps.
- Leaves visual history timelines, charts, exports, and cross-image analytics for later modules.


## v0.9.8.0 — AI Analysis Engine

- Reuses the Billy Labs Cloudflare Worker/API boundary and job lifecycle patterns.
- Adds persistent IndexedDB AI jobs and queue items.
- Supports component-selective analyze and reanalyze.
- Writes current AI results to Image Records and immutable entries to History.
- Adds pause, resume, safe stop, retry, partial-result handling, provider configuration, health checks, and a full portrait AI console.
- Includes an adapted Worker under `worker/`; configure the Worker URL and analysis key in the AI console.
- Does not fabricate AI results when no provider is configured.


## v0.9.8.0 Batch Engine
Persistent active batches, canonical Image ID membership, readiness validation, submission, automatic standard reports, project-safe recycle handling, reopening, archiving, and migration from the current-import placeholder.


## v0.9.8.0 Reports Engine

- Extracts report generation from the Batch Engine into one shared Reports Engine.
- Migrates existing standard batch reports.
- Adds flexible scopes, composable filters, report modules, immutable snapshots, saved presets, JSON/CSV export, and printable output.
- Adds Director reaction/theme/PrimFusion, source, workflow, and AI–Director comparison modules.
- Batch submission now calls the Reports Engine for its automatic standard report.


## v0.9.16.1 Notifications Engine
- Persistent mailbox notifications with unread badge.
- Read/unread, archive/restore, resolve, filters, deduplication, and routing to owning modules.
- Queue terminal states, reports, and batch submissions create operational notifications.
- Successful automatic background progress remains quiet unless a meaningful job transition occurs.

## v0.9.16.1 — Queue Refresh Idempotence Fix
- Automatic AI look-ahead excludes images already queued or processing.
- Buffer maintenance is serialized so startup calls cannot overlap.
- Empty AI jobs are no longer persisted.
- Shared Queue job/item creation is idempotent for explicit IDs and owner-item IDs.
- Repeated page refreshes no longer add duplicate queue work.
- Repository structure unchanged.

## v0.9.16.1 — Portrait Control Station Home
- Finalized the portrait-only home composition without changing landscape, tablet, desktop, or Worker behavior.
- Standardized Images, Batch, AI, Queue, and Reports modules around the approved quick-action/module-button layout.
- Replaced placeholder counts with engine-owned state and active-batch-scoped deltas.
- Connected module status controls to their real consoles.
- Added compact Queue and Reports status bodies.
- Removed the permanently reserved empty status strip; transient messages now appear only when needed.
- Preserved configurable quick actions and all existing engine/console functionality.

## v0.9.16.1 — Complete Batch Console
- Added the full operational Batch console with active-batch selection, creation, rename, pause/reactivate, archive, membership management, filtering, ordering, validation, submission verification, reopen, and submission history.
- Added real filters for ready, incomplete, partial, flagged, saved, blocked, and submitted images.
- Added selected-image removal, movement between batches, up/down reordering, shuffle, and select-visible behavior.
- Added a compact submission verification dialog showing cleanup and protection outcomes before submission.
- Preserved automatic standard report generation, project-history writes, Saved/Flagged protection, and recycle-bin cleanup.
- No repository folders were added, removed, renamed, or moved.