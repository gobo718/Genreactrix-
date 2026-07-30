# Genreactrix Recovery Roadmap

**Status:** Phase 1 In Progress

**Current verified build:** `Genreactrix-v0.3.9-storage-resilience`

## Overview

This roadmap replaces placeholder verification releases with measurable
implementation milestones. Progress is measured only by completed
functionality and acceptance criteria.

------------------------------------------------------------------------

# Phase 1 -- Stabilization Pass

**Estimated:** 3--5 implementation messages

## Goal

Make the foundation trustworthy.

## Work

-   ✅ Remove dead placeholder-only DOM/CSS scaffolding.
-   ⏳ Continue duplicate/incremental code audit.
-   ✅ Remove placeholder-only UI references.
-   ✅ Confirm and harden data flow.
-   ✅ Confirm and harden save/load behavior.
-   ✅ Guard all browser-storage subsystems against unavailable or full storage.
-   ✅ Confirm and normalize project structure.

## Deliverable

A stable baseline.

## Acceptance

-   App opens.
-   Existing workflows still function.
-   No hidden placeholder features remain.

**Status:** 🚧 In Progress

------------------------------------------------------------------------

# Phase 2 -- Core Workflow Completion

**Estimated:** 8--12 implementation messages

## 2A. Workspace / Project State

Work - Real project state model. - Current file tracking. - Session
persistence. - Recovery.

**Status:** ⏳ Not Started

## 2B. Annotation System

Work - Create/Edit/Delete annotations. - Reliable storage. -
Undo/Redo. - Review state.

**Status:** ⏳ Not Started

## 2C. Navigation

Work - Move between items. - Track progress. - Resume locations.

### Deliverable

"The core loop works."

### Acceptance

A user can complete an end-to-end Genreactrix workflow.

**Status:** ⏳ Not Started

------------------------------------------------------------------------

# Phase 3 -- Curator Tools

**Estimated:** 10--15 implementation messages

## Goal

Make it useful instead of a prototype.

## Work

-   Review queue.
-   Filtering.
-   Search.
-   Metadata editing.
-   Batch operations.
-   Validation.

### Deliverable

A curator can manage a collection.

### Acceptance

A real workflow can happen without manually editing files.

**Status:** ⏳ Not Started

------------------------------------------------------------------------

# Phase 4 -- Export / Safety / Data Integrity

**Estimated:** 5--8 implementation messages

## Work

-   Export projects.
-   Import projects.
-   Backup.
-   Version handling.
-   Migration safety.

### Deliverable

"You own your data."

### Acceptance

The application can be trusted with real data.

**Status:** ⏳ Not Started

------------------------------------------------------------------------

# Phase 5 -- UI Polish

**Estimated:** 5--8 implementation messages

Only after functionality.

## Work

-   Layouts.
-   Buttons.
-   Mobile behavior.
-   Visual cleanup.
-   Error handling.

### Deliverable

"This feels like a finished application."

**Status:** ⏳ Not Started

------------------------------------------------------------------------

# Phase 6 -- Release Candidate

**Estimated:** 3--5 implementation messages

## Work

-   Final testing.
-   Bug fixes.
-   Versioning.
-   Documentation.
-   Final ZIP.

### Deliverable

Genreactrix v1.0 Release Candidate.

**Status:** ⏳ Not Started

------------------------------------------------------------------------

# Current Project Status

  Area            Status
  --------------- ----------------
  Recovery Plan   ✅ Complete
  Phase 1         🚧 In Progress
  Phase 2         ⏳ Not Started
  Phase 3         ⏳ Not Started
  Phase 4         ⏳ Not Started
  Phase 5         ⏳ Not Started
  Phase 6         ⏳ Not Started

## Remaining Estimate

Approximately **36--56 implementation messages** assuming uninterrupted
execution.

## Success Criteria

-   Meaningful functionality added each iteration.
-   Acceptance criteria satisfied before advancing.
-   No cosmetic-only releases.
-   No placeholder version increments.
-   Progress measured by working software, not artifacts.


## Latest verified advancement — v0.3.9

- Routed every local-storage access through shared guarded helpers.
- Added visible failure handling for taxonomy, workflow rules, preferences, and recovery history.
- Prevented import and checkpoint restore flows from continuing after related persistence failures.
- Preserved all existing storage keys and workspace schema compatibility.
- Static validation passed; browser workflow testing and the remaining duplicate/incremental code audit remain for Phase 1 completion.
