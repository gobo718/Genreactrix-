# v0.9.39.16 — Measured Fields and Explicit Matrix Picker

- AI theme fields copy the exact rendered Director-field width and height.
- AI fields remain the only new content in the AI drawer and sit at its bottom-left edge beside the Director stack.
- Reaction rings use a numeric tangent relationship: the ring inner diameter equals the emoji glyph-size variable.
- Matrix cells do nothing unless a Director theme field is visibly active.
- Matrix clicks are never remembered or applied later.
- Matrix-cell highlighting is removed for this phase.
- Reaction and completed Director-theme assignments continue to save immediately.

# Genreactrix

## v0.9.39.16 — Exact AI Theme Placement + Matrix Selection Feedback

- Removed the duplicated Director-theme fields from the AI drawer.
- Placed only the three AI theme fields at the bottom-left of the AI drawer, immediately beside the existing Director fields under the image.
- Preserved AI field formatting: AI left, theme centered, confidence right, sorted high to low.
- Increased and right-shifted foreground reaction rings.
- Added persistent visual selection to assigned PrimFusion Matrix cells.
- Preserved immediate persistence for reaction and Director-theme assignments.

## v0.9.39.14 — Instant Classification + Corrected AI Theme Fields
- Enlarges and slightly right-shifts the foreground reaction rings while reducing the reaction glyph size.
- Primary reaction changes commit immediately through the Director Classification Engine.
- PrimFusion assignments commit immediately, then clear the active Director field highlight.
- Rebuilds the AI Themes drawer as three equal-size Director/AI field pairs; AI results remain confidence-sorted, with AI left, theme centered, and percentage right.
- The toolbar Save action now marks the image for retention during batch cleanup rather than serving as a metadata commit button.
- No image generation or repository restructuring.


## v0.9.39.13 — Reaction Geometry, Director Assignment, and AI Theme Drawer

- Makes Judgment reaction emoji smaller while enlarging and centering the foreground red selection rings.
- Director theme fields now use a one-shot assignment workflow: tap a field to highlight it, tap a Matrix cell to fill it, then the highlight clears.
- AI Themes remain toggle-controlled and appear only in the AI drawer on the Judgment side.
- The AI drawer shows paired Director-reference and AI theme fields at identical sizes.
- AI themes are sorted highest confidence to lowest.
- Each AI field shows “AI” at left, the theme centered, and confidence at right.
- Customs remains a separate drawer layout.

## v0.9.39.12 — Canonical Reaction Row and Foreground Rings

- Rebuilt from the verified v0.9.39.11 archive.
- Judgment reaction order is now exactly: 🧸 ✨ 😭 🤣 🌶️ 🎉 🧠 💥 👻 🤢 🌌 🎟️ 🌀.
- All 13 canonical reactions occupy one evenly distributed row.
- Canonical selection rings are red and render above the emoji so the ring remains complete.
- Default reaction emoji are slightly smaller.
- Custom-reaction density hooks are present: the row shrinks only when custom reactions are actually added.
- Future custom reaction selections use teal rings.
- The fixed percentage row and sliding-drawer boundary remain unchanged.

## v0.9.39.11 — Fixed Judgment Reaction Header

- Rebuilt from the user-supplied v0.9.39.10 archive.
- Places the Judgment reactions in one evenly spaced fixed row in this exact order: ✨ 🧸 😭 🤣 💥 🌌 🌶️ 🤢 👻 🧠 🎟️ 🌀.
- Uses a true centered red circular CSS ring around selected reaction emoji.
- Reserves a fixed percentage row beneath the reactions; values appear only when AI Reactions is enabled.
- Places the independent sliding-drawer region below the fixed reaction header so drawer changes cannot move, cover, or resize reactions or percentages.
- Preserves the Matrix side, toolbar, image socket, Director theme fields, Portrait layout, and existing engines.

- Director theme-field numbers are left-aligned while theme words remain centered.
- Matrix and Judgment faces are now strictly mutually exclusive; the Matrix is fully hidden on the Judgment side.
- Rebuilt from the verified v0.9.39.9 archive.


## v0.9.39.1 — Landscape Layout Foundation (Cache-Busting Correction)

- Replaced the legacy tablet Landscape composition with a fixed 20:9 classification canvas that scales uniformly.
- Added the canonical persistent frame: image, explicit Previous/Next/Undo/Redo/Flag/Save controls, Director theme fields, and flippable workspace.
- Added Matrix and Judgment faces, independent AI visibility controls, and the Customs drawer layout socket.
- Removed automatic image advancement from Theme 1 selection.
- Preserved the complete Portrait Control Station and all existing engines.
- This release is deliberately a layout foundation: the existing matrix renderer remains temporarily mounted until the canonical 13 × 7 interlocked renderer is installed.


## v0.9.34.0 — Research Paper Composer & Final Publication

- Added `paper-composer-engine.js` with persistent draft/final paper records, generated canonical sections, section editing, revision history, and JSON/Markdown/HTML export.
- Added `publication-validator-engine.js` to block finalization when required sections, citations, methodology, knowledge references, or frozen dataset snapshots are missing.
- Added `paper-composer-ui.js` and a shallow Research Paper workspace reachable from the Research Dashboard.
- Papers capture the selected knowledge entries, citations, methodology versions, and exact dataset snapshot used.
- Finalized papers retain validation results and remain reproducible from canonical project data.
- Repository structure unchanged; ZIP remains flat.

## v0.9.33.0 — Dataset Versioning & Reproducible Research

- Versioned dataset definitions with stable IDs and inclusion scopes.
- Frozen snapshots with record counts, schema versions, image IDs, and content hashes.
- Reproducible research packages containing canonical records plus optional History, Reports, and Batch context.
- Captured terminology, methodology, and citation graph versions for research provenance.
- Snapshot and package integrity verification.
- JSON export for frozen snapshots and reproducible packages.
- Added Datasets & Reproducibility entry to the Research Dashboard.
- Repository structure unchanged; ZIP remains flat.


- Added `citation-evidence-engine.js` with persistent versioned citations, typed evidence relationships, evidence bundles, duplicate-source prevention, revision history, graph queries, integrity checks, and JSON/CSV export.
- Added `citation-evidence-ui.js` and a shallow Citation & Evidence workspace accessible from the Research Dashboard.
- Evidence can support, contradict, qualify, define, cite, or derive from publications, findings, reports, images, datasets, terminology, and methodology records without duplicating canonical data.
- Added missing-link, duplicate-source, malformed-relation, and bundle-reference validation.
- Repository structure remains unchanged and the release archive stays flat at root.

## v0.9.31.0 — Canonical Terminology & Methodology

- Added `terminology-engine.js` with canonical names, definitions, aliases, categories, active/deprecated status, revision history, search, resolution, and integrity validation.
- Added `methodology-engine.js` with versioned Director, AI, correlation, prediction, and publication methodology records.
- Added a shallow Terminology & Methodology console reachable from the Research Dashboard.
- Added duplicate-name, alias-conflict, missing-reference, and published-method validation.
- Preserved the existing Knowledge Base and publication workflow while giving future reports and community systems authoritative vocabulary and procedures.
- No repository folders were added, removed, renamed, or moved.

## v0.9.20.0 — Director Workspace Polish

- Added compact Director state indicators for Unclassified, Partial, Complete, Draft, Saved, Flagged, and AI-viewed state.
- Added a dedicated Revert Draft action in the expanded Director console.
- Director drafts now expose a formal dirty-state check.
- Reaction changes invalidate stale PrimFusion draft data instead of carrying an incompatible pair forward.
- Duplicate Director themes are rejected during validation.
- Image zoom and pan are preserved per Image ID across navigation and reloads.
- Existing landscape composition and engine ownership remain unchanged.

## v0.9.17.0 — Director Classification Engine

- Adds `director-classification-engine.js` as the canonical Director decision layer.
- Separates working drafts from accepted classifications.
- Persists reactions, themes, PrimFusion derivation, notes, Saved/Flagged state, completion, AI visibility, and schema version by immutable Image ID.
- Connects accepted state to Image Records and immutable History.
- Adds transaction-based Director undo/redo while retaining the previous UI history as a compatibility fallback during migration.
- Migrates existing local classification records without deleting them until the canonical record is verified.
- Preserves the existing landscape, tablet, and portrait compositions.


## v0.9.17.0 — Portrait Viewport-Fit Correction

- Removed the blank scroll area below the Reports module when the Control Station already fits in the phone viewport.
- Made the portrait app shell use border-box sizing at exactly 100dvh.
- Confined scrolling to genuine content overflow instead of page-height overshoot.
- Removed inherited minimum-height behavior from the portrait Control Station.
- No module layout, engine behavior, or non-portrait mode changed.


## v0.9.17.0 — AI Console + One-Page Portrait

- Compressed Batch, Queue, Reports, spacing, and status rows to fit the portrait Control Station on one typical phone screen without removing quick-action capacity.
- Completed the operational AI console with modular analyze/rerun controls, active-batch and filtered targeting, automatic look-ahead settings, provider health/configuration, persistent job controls, selected-job detail, failures, and prompt/model metadata.
- No repository restructuring.


## v0.9.17.0 — Complete Images Console

- Full portrait Images console with shallow Add, Review, Saved, Flagged, Recycle, Failures, and History views.
- Folder and URL intake use the shared Images Engine.
- Hyperlink, temporary-copy, and prefetch-only modes.
- Real filtered Image Record views and recycle restore/purge controls.
- No repository restructuring.

## v0.9.17.0 — Maintenance and Recovery Engine

- Unified quick, full, and selected integrity scans.
- Persistent deduplicated maintenance issues and scan reports.
- Safe repair registry and guided recovery foundation.
- Recycle-bin preview and restoration coordination.
- Versioned backup preview, emergency pre-restore backup, merge/replace restore, and post-restore verification.
- JSON and CSV maintenance-report export.
- Maintenance notifications and routing.
- No repository folder changes.

## v0.9.17.0 — Settings Engine

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


## v0.9.17.0 — Shared Queue Engine
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


## v0.9.17.0 Notifications Engine
- Persistent mailbox notifications with unread badge.
- Read/unread, archive/restore, resolve, filters, deduplication, and routing to owning modules.
- Queue terminal states, reports, and batch submissions create operational notifications.
- Successful automatic background progress remains quiet unless a meaningful job transition occurs.

## v0.9.17.0 — Queue Refresh Idempotence Fix
- Automatic AI look-ahead excludes images already queued or processing.
- Buffer maintenance is serialized so startup calls cannot overlap.
- Empty AI jobs are no longer persisted.
- Shared Queue job/item creation is idempotent for explicit IDs and owner-item IDs.
- Repeated page refreshes no longer add duplicate queue work.
- Repository structure unchanged.

## v0.9.17.0 — Portrait Control Station Home
- Finalized the portrait-only home composition without changing landscape, tablet, desktop, or Worker behavior.
- Standardized Images, Batch, AI, Queue, and Reports modules around the approved quick-action/module-button layout.
- Replaced placeholder counts with engine-owned state and active-batch-scoped deltas.
- Connected module status controls to their real consoles.
- Added compact Queue and Reports status bodies.
- Removed the permanently reserved empty status strip; transient messages now appear only when needed.
- Preserved configurable quick actions and all existing engine/console functionality.

## v0.9.17.0 — Complete Batch Console
- Added the full operational Batch console with active-batch selection, creation, rename, pause/reactivate, archive, membership management, filtering, ordering, validation, submission verification, reopen, and submission history.
- Added real filters for ready, incomplete, partial, flagged, saved, blocked, and submitted images.
- Added selected-image removal, movement between batches, up/down reordering, shuffle, and select-visible behavior.
- Added a compact submission verification dialog showing cleanup and protection outcomes before submission.
- Preserved automatic standard report generation, project-history writes, Saved/Flagged protection, and recycle-bin cleanup.
- No repository folders were added, removed, renamed, or moved.

## v0.9.20.0 — Research Analytics
- Added the Research Analytics engine and console.
- Added an interactive PrimFusion/reaction-pair matrix with report drill-down.
- Added theme-to-reaction correlation tables.
- Added AI–Director agreement summaries and low-agreement drill-down.
- Added empty and underrepresented matrix-cell diagnostics.
- Added persistent research workspaces.
- Added selected-image scope support to the Reports Engine.
- No repository folders were added, moved, renamed, or removed.

## v0.9.22.0 — Director Workflow Acceleration

- Rebuilt directly from the canonical v0.9.20.0 Research Analytics release.
- Added Director workflow navigation for next incomplete, next flagged, next blocked, random, and return-to-last-image.
- Added explicit Commit with configurable post-commit behavior through canonical Settings.
- Added persistent Ready, Blocked, and Locked state chips without changing the landscape composition.
- Added one-touch Clear Reactions and preserved PrimFusion invalidation when reactions change.
- Undo/redo now skips no-op transactions iteratively and identifies the pending action in button tooltips.
- Added Director workflow settings for post-commit navigation, draft warnings, view restoration, and default navigation.
- Preserved per-image zoom and canonical Image ID boundaries.
- No repository folders were added, removed, renamed, or moved.


## v0.9.22.0 — Research Session Manager
- Named persistent research sessions with objectives, questions, conclusions, and workspace state.
- Automatic active-session tracking and periodic workspace capture.
- Manual append-only snapshots and restore.
- Image bookmarks, working-set storage APIs, session search, recent activity, and research timers.
- Session integrity checks for missing batches and images.
- No repository restructuring.

## v0.9.24.0 — Maintenance & Integrity Center
- Expanded the existing Maintenance and Recovery Engine instead of creating a duplicate maintenance subsystem.
- Added a shared Validation Engine registry for reusable cross-engine validation rules.
- Added a system-health dashboard for Images, Director, AI, Queue, Batch, Reports, Analytics, Research Sessions, History, Settings, and Notifications.
- Added selected-subsystem scans, startup/daily/weekly scan scheduling, storage statistics, scan-duration diagnostics, and printable maintenance reports.
- Added Director, Analytics, and Research Session integrity registration plus cross-engine validation hooks.
- Preserved persistent deduplicated issues, guided repairs, recycle recovery, backup restore, JSON/CSV exports, and no-silent-repair behavior.
- No repository folders were added, removed, renamed, or moved.


## v0.9.24.0 — Import Pipeline & Acquisition Automation

- Added persistent import job records and acquisition profiles.
- Added URL preview, duplicate review, automatic batch routing, resumable job metadata, and acquisition dashboard counts.
- Folder and URL intake now create import jobs while preserving canonical Image Records and Queue jobs.
- No repository folders were added or moved.

## v0.9.27.0 — AI Prompt Laboratory & Evaluation

- Added a versioned Prompt Library with Draft, Candidate, Active, and Retired lifecycle states.
- Added component-specific prompt categories and safe single-active-version promotion.
- Added reusable benchmark sets and prompt-library integrity checks.
- Added persistent evaluation runs over all, Saved, Flagged, or selected image populations.
- Evaluation runs call the configured AI provider and retain actual outputs without replacing canonical AI results.
- Added side-by-side prompt result inspection, Director review records, and acceptance/failure metrics.
- Added regression-ready evaluation history and prompt/version provenance.
- Added a Prompt Lab entry point inside the AI console.


## v0.9.27.0 — Canonical Research Dashboard

- Added `research-dashboard-engine.js` at repository root.
- Added a global Research Dashboard entry in the portrait header.
- Added live project cards, progress, priority actions, persistent goals, and an activity timeline.
- Dashboard reads canonical engine data and does not duplicate images, classifications, reports, or queue state.
- No folders were added, removed, renamed, or moved.


## v0.9.27.0 — Correlation Discovery Laboratory
- Adds correlation discovery across reactions, themes, PrimFusion, batches, sources, AI agreement, and Director revisions.
- Adds a persistent Finding Library and research hypotheses.
- Findings drill down through the canonical Reports Engine.

## v0.9.28.0 — Predictive Classification Laboratory
- Added `prediction-engine.js`, `prediction-evaluation-engine.js`, and `prediction-ui.js` at repository root.
- Generates advisory reaction, theme, PrimFusion, and expected AI-agreement predictions from canonical Director history, current AI signals, source, and batch context.
- Every prediction includes probability, confidence, supporting sample size, and evidence notes.
- Added Director review outcomes for accepted, partial, rejected, false-positive, and false-negative evaluation.
- Added persistent prediction runs and evaluation metrics without altering canonical Director or AI data.
- Added a Prediction Laboratory entry to the Research Dashboard.
- No folders were added, removed, renamed, or moved.


## v0.9.29.0 — Adaptive Research Intelligence

- Added `adaptive-intelligence-engine.js` for project-level learning metrics and trend snapshots.
- Added `recommendation-engine.js` for ranked research opportunities.
- Added `adaptive-intelligence-ui.js` and a new Adaptive Intelligence console.
- Added recommendation routing to blocked work, partial classifications, flagged review, findings, and prediction evaluation.
- Added Adaptive Intelligence to the Research Dashboard.
- Preserved canonical Director authority; recommendations never modify classifications automatically.


## v0.9.30.0 — Research Publication & Knowledge Base

- Added `knowledge-base-engine.js` for versioned research articles, promoted findings, terminology, methodology, evidence links, search, and integrity checks.
- Added `publication-engine.js` with Draft → Review → Published → Archived transitions and immutable revision snapshots.
- Added a shallow Knowledge Base workspace accessible from the Research Dashboard.
- Added JSON, Markdown, and printable HTML exports.
- Published entries retain traceable image, report, finding, analytics, sample-size, confidence, and contradictory-evidence references.
- Repository structure remains unchanged and the release archive stays flat at root.

## v0.9.35.0 — Community Input Interface
- Added a stable Community Input Contract for future MASHPEDITION integration.
- Added JSON, CSV, and manual test-data import for reaction, theme, and PrimFusion votes.
- Added persistent import batches, source/game/dataset provenance, validation, image mapping warnings, replay, history, statistics, and integrity checks.
- Community data remains separate from canonical Director classifications and is ready for the Consensus Engine.
- No repository folders were added, removed, renamed, or moved.

## v0.9.36.0 — Consensus Engine
- Added `consensus-engine.js` and `consensus-ui.js` at repository root.
- Converts imported community reaction, theme, and PrimFusion votes into persistent consensus records.
- Calculates normalized option shares, unique participation, weighted sample size, confidence, margin, entropy-derived controversy, and stability against prior calculations.
- Compares community consensus with canonical Director classifications without overwriting either dataset.
- Adds filters for vote type, Director agreement, and controversial records, with image-level drill-down.
- Stores append-only consensus calculation runs and supports source-batch analytics, integrity verification, and future AI Training Comparison consumption.
- No repository folders were added, removed, renamed, or moved.


## v0.9.37.0 — AI Training Comparison
- Added `ai-training-comparison-engine.js` and `ai-training-comparison-ui.js` at repository root.
- Creates reusable benchmark sets from all, current-batch, Saved, or Flagged images.
- Supports Director classifications or imported community consensus as independent ground truth.
- Compares canonical AI models and Prompt Laboratory candidates without overwriting canonical AI data.
- Calculates exact agreement, Jaccard similarity, attempted coverage, missing outputs, failures, and average runtime by candidate and component.
- Provides side-by-side candidate metrics and image-level drill-down for the lowest-agreement results.
- Stores persistent comparison-run history and benchmark definitions for longitudinal model and prompt performance analysis.
- Adds a benchmark reanalysis handoff to the canonical AI Analysis Engine.
- Adds integrity checks for missing benchmark images, orphaned comparison runs, and malformed stored results.
- No repository folders were added, removed, renamed, or moved.

## v0.9.38.0 — Public Research
- Added `public-research-engine.js` and `public-research-ui.js` at repository root.
- Builds persistent audience-safe public snapshots from published Knowledge Base entries, approved methodology, community consensus, AI Training Comparison results, and dataset manifests.
- Public snapshots intentionally exclude raw community votes, local paths, private notes, and raw Image IDs.
- Added snapshot Draft, Published, and Archived lifecycle, validation, public update feed, and archive history.
- Added static printable HTML, JSON, and a self-contained public-bundle manifest export.
- Added public consensus summaries, Director-agreement rates, votes represented, and AI candidate comparison summaries without altering canonical research records.
- Added Public Research to the Research Dashboard.
- No repository folders were added, removed, renamed, or moved.

## v0.9.39.8 — Canonical Landscape Split Layout

- Enlarged and moved the main image to the upper-left workstation region.
- Kept Director Theme 1–3 directly beneath the image.
- Moved Previous, Next, Undo, Redo, Flag, and Save into a six-button strip above the matrix only.
- Removed the visible Images button from Landscape; tapping the image remains the Image View entry.
- Expanded the complete interlocked matrix to the remaining right-side area.
- Anchored the matrix to the bottom-right of its workspace.
- Preserved the exact matrix contents, pastel regions, diagonal emoji alignment, Portrait layout, and existing engines.


## v0.9.39.8 — Square Image Socket and Full Matrix Occupancy
- Retains the established image-port height while reducing its width to a square.
- Fits the current image inside the square without cropping, distortion, or an added border.
- Restricts the three Director theme fields to the exact image-column width.
- Distributes Previous, Next, Undo, Redo, Flag, and Save evenly across the full matrix width.
- Forces the complete interlocked matrix to stretch through the available workspace and remain anchored to the bottom-right.
- Portrait behavior and existing engines remain unchanged.


## v0.9.39.10 — Toolbar Flip Integration

Rebuilt from the user-supplied v0.9.39.8 release. The existing Matrix/Judgment toggle is now the seventh equal-width toolbar button labeled **Flip**. The floating circular flip control has been removed from the matrix workspace. No other layout, matrix, Portrait, or engine behavior was changed.
