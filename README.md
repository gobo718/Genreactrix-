# Genreactrix v0.9.40.37 — Lifecycle Closure + Explicit Batch Membership

14 August 2026

## Purpose

This pass closes the remaining live lifecycle-ownership mismatch before Reports work and repairs an integration omission discovered while auditing v0.9.40.36.

No layout redesign is included.

## 1. v0.9.40.36 Project / Runtime boundary is now actually loaded

The v0.9.40.36 release contained `project-runtime-engine.js`, and the source files had been updated to use the Project / Runtime boundary, but `index.html` did not load the new engine. Several modified scripts also retained older cache-version query strings.

v0.9.40.37 fixes that integration defect:

- `project-runtime-engine.js` loads before Settings and the operational record engines that use it.
- Project Context and Runtime Instance initialization therefore occur on startup.
- The source files changed by the Project / Runtime migration receive a v0.9.40.37 cache key so an older browser cache cannot silently substitute the pre-boundary implementation.
- Visible build labels now correctly report v0.9.40.37 in both folded and unfolded shells.

This remains a local architecture boundary. It does not add cross-browser/server synchronization.

## 2. Batch membership is explicit

Canonical rule: eligible Inbox work is a candidate population; a Batch is the explicitly tagged/selected subset that the Director commits together.

v0.9.40.37 separates those two concepts in the Batch record:

- `candidateImageIds` = currently loaded eligible Inbox candidates.
- `imageIds` = explicit draft Batch membership selected by the Director.
- Loading eligible Inbox work no longer silently makes every candidate a Batch member.
- Candidate refresh preserves explicit selections that remain eligible.
- Checkbox changes persist draft Batch membership.
- Select Visible explicitly adds/removes the currently visible candidate set.
- Batch validation fails clearly when no images are selected.
- At submission, the selected `imageIds` set is frozen and becomes the committed historical Batch membership.

### Legacy draft safety

Pre-v0.9.40.37 draft Batches could not distinguish “loaded because eligible” from “explicitly selected.” During migration their old `imageIds` are preserved as `candidateImageIds`, while draft `imageIds` are cleared. The Director must select the intended members rather than allowing the migration to guess.

Submitted/submitting historical Batch membership is preserved.

## 3. Director completion no longer becomes a lifecycle place

Director completion (`unclassified`, `partial`, `complete`, etc.) belongs to the Director Evaluation record, not `workflow.stage`.

v0.9.40.37:

- keeps an Inbox-owned image at `inbox-working` when Director classification is saved;
- stores the Director completion value in the Director analysis/metadata;
- preserves `processedAt` as evaluation-completion metadata;
- stops writing `director-complete` as a new lifecycle stage.

## 4. Reject is an Inbox terminal state, not a separate storage place

Reject remains mutually exclusive with Review / Depot / Delete and does not move an image into a synthetic `rejected-hold` lifecycle place.

New Reject actions retain the image's Inbox lifecycle location while the Reject terminal is represented by its authoritative attributes. Existing `rejected-hold` records are migrated back to their prior Inbox stage.

## 5. Lifecycle v2 migration and verifier

The lifecycle migrator now normalizes legacy active-state values including:

- `available` / `imported` → Queue Waiting;
- AI-complete legacy states → Queue Staged or Inbox where legacy Bundle evidence requires it;
- `director-complete`, `complete`, `partial`, `unclassified`, `blocked` Director-state leakage → Inbox Working when Director/Inbox evidence exists;
- `rejected-hold` → prior Inbox lifecycle stage.

The lifecycle checker now reports:

- noncanonical active lifecycle stages;
- multiple simultaneous Inbox terminal states;
- active Bundle membership whose lifecycle owner is inconsistent with Inbox/Post-processing.

## Preservation gates

- Existing 60/40 AI analysis implementation is byte-for-byte unchanged from v0.9.40.36.
- `styles.css` is byte-for-byte unchanged from v0.9.40.36.
- Folded shell structural count remains 1,549 non-script elements and 674 unique IDs.
- Unfolded shell structural count remains 13 non-script elements and 5 unique IDs.
- No Reports redesign is included.
- No server/account synchronization is introduced.

## Deterministic verification completed

- Project / Runtime identity test: pass.
- Project-scoped Settings + mixed-scope backup test: pass.
- Explicit Batch candidate/membership migration and selection test: pass.
- Lifecycle v2 migration and canonical-stage verifier test: pass.
- Director completion ownership test: pass.
- All JavaScript syntax checks: pass.
- Script load-order and cache-version audit: pass.
- CSS identity check: pass.
- AI analysis / 60-40 implementation identity check: pass.

## Device acceptance check

1. Open v0.9.40.37 and confirm the visible build label says v0.9.40.37.
2. Run ordinary Origin → Queue → AI work and confirm behavior is unchanged.
3. Send at least two images through Bundle into Inbox and give them Batch-eligible outcomes (Depot/Delete/Reject).
4. Open Batch and choose **Load eligible Inbox**. They should appear as candidates, but should not all be preselected automatically.
5. Select only one candidate and Batch it. Only that selected image should be committed; the other eligible Inbox image should remain waiting for a later Batch.
6. Optional: open Settings → Project and confirm Project ID and Runtime ID are separate values.
