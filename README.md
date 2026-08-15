# Genreactrix v0.9.40.40 — Inbox Filter Repair + Investigation Interfaces

Accepted rollback baseline: **v0.9.40.38**.

v0.9.40.39 was partially real-device tested. Its Automatic Flow / AI → Staged → Bundle → Inbox path worked under a large live population, but the build was not accepted because Landscape Inbox could report a nonzero matching population while the Director view displayed zero images. v0.9.40.40 is built from .39 and repairs that blocker while adding the reusable evidence interfaces discovered during the same test session.

## 1. Landscape Inbox filter/population repair

Observed on-device in .39:

- Inbox contained 97 images across 11 Bundles.
- Filter reported `97 images match`.
- `All` was selected.
- Director view simultaneously displayed `No images match this filter.`

The filter calculation itself was therefore finding the records; the break was between record selection and the visible working-file population.

v0.9.40.40 hardens that boundary in three ways:

1. `workingFiles()` is now item-isolated. One record whose local/full-resolution asset cannot be materialized no longer rejects hydration of the entire Inbox population.
2. A record with no displayable full-resolution source or thumbnail remains in the visible population as an explicit **Image unavailable** placeholder rather than silently disappearing.
3. Landscape feed rehydration is generation-guarded. A slower stale refresh cannot overwrite a newer refresh after rapid Bundle/filter events.
4. Bundle Engine no longer invokes a second immediate rehydration in parallel with the app's existing scheduled Bundle-event refresh.
5. Opening Filter while the current feed is empty but the selected filter has matching records triggers a reconciliation refresh.

This does not change Filter meaning, Bundle membership, Director state, or lifecycle ownership.

## 2. Two reusable human-investigation interfaces

Instead of building bespoke evidence screens for every exception workflow, .40 introduces exactly two reusable interfaces.

### Single Image Inspector

Used when one image/record must be investigated. It provides:

- large image preview;
- tap image for close-up/pannable full-size view;
- pixel dimensions when resolvable from the full image/source;
- file size;
- filename;
- format/MIME;
- Image ID / lifecycle state;
- source/original location;
- Origin Pack and Import Job;
- created / last-modified timestamps;
- SHA-256 and thumbnail hash when present;
- dataset / license / attribution / provenance when present;
- Project / Runtime identity;
- recent Image Record history;
- contextual diagnostic history and workflow actions.

Current integrations include:

- Quarantine — failure evidence, ordered AI attempt/error history, Release, Defective;
- Import Failure — available candidate evidence and Retry;
- Retry Import Source — known Image Record/thumbnail/source evidence and Retry;
- Saved / Flagged / Recycle / Failure / History record lists — Inspect;
- Recycle — Restore from the Inspector;
- Purgatory images surfaced by Maintenance — intended Batch decision/routing, ordered post-processing attempts, Retry;
- Maintenance findings that resolve to an Image Record — Inspect.

Unavailable metadata is not invented.

### Two-Image Comparator

Used when a decision requires candidate-vs-known-image evidence.

Current integrations:

- Dupe — Candidate vs Original, Sustain / Overrule;
- Repeat — Candidate vs Original, Re-evaluate.

The interface is a true side-by-side comparison at every viewport size:

- Candidate preview left;
- Original preview right;
- tap either image for close-up;
- one metadata table underneath with the **same field on the same row**: `Field | Candidate | Original`;
- match evidence included with the comparison;
- workflow-specific decision buttons stay in the comparison view.

The comparator deliberately does not render all Candidate metadata followed by all Original metadata.

## 3. Origin Add cleanup

The redundant single-file-only control is removed from `+ Origin → Add`.

Remaining file control:

- **Choose Files** — the existing multi-file picker, which also permits selecting only one file.

The URL document/spreadsheet loader remains unchanged.

## 4. Landscape Filter modal fit

The existing scrollable Filter modal remains structurally the same. On short landscape viewports its internal spacing/padding is reduced so more controls fit onscreen at once. This is a targeted fit adjustment, not a Landscape redesign.

## What did not change

- 60/40 Reaction calculation.
- AI execution/rerun semantics.
- AI Attempt/Artifact history.
- Origin gate decision semantics, including Overrule being encounter-specific and Sustain retaining the permanent duplicate suppression behavior.
- Queue ownership and Automatic Flow/Buffer policy.
- Bundle formation semantics.
- explicit Batch membership.
- Post-processing atomicity/Purgatory rules.
- Project/Runtime boundary.
- portable backup/restore format.
- Reports implementation.
- established Director/AI/PrimFusion geometry outside the targeted investigation/filter dialogs.

## Deterministic verification

- All 63 top-level JavaScript files parse — PASS.
- HTML IDs remain unique — PASS (696/696).
- Working-file population preservation: one asset-materialization failure among two selected records still returns two visible population members, with the bad record represented by a placeholder — PASS.
- Concurrent Landscape rehydration: a slower stale refresh is superseded and cannot overwrite the newer result — PASS.
- Dupe Comparator functional harness: Candidate + Original side-by-side metadata, dimensions, Sustain + Overrule controls — PASS.
- Quarantine Inspector functional harness: image metadata, failure diagnostics, Release + Defective controls — PASS.
- `ai-analysis-engine.js` is byte-for-byte identical to .39 — PASS.
- `post-processing-engine.js`, `persistence-engine.js`, and `lifecycle-engine.js` are byte-for-byte identical to .39 — PASS.

## Source-diff containment

Against v0.9.40.39, the release changes only:

- `app.js` — feed hydration hardening + build number;
- `bundle-engine.js` — remove duplicate direct feed refresh;
- `images-console.js` — investigation entry points + redundant picker removal;
- `queue-engine.js` — Quarantine Inspector entry point;
- `maintenance-engine.js` — image Inspector entry point;
- `investigation-ui.js` — new shared Inspector/Comparator implementation;
- `index.html` — investigation dialogs / script wiring / file-picker cleanup;
- `styles.css` — investigation surfaces + targeted short-landscape Filter fit;
- `unfolded.html` — build reference;
- `README.md`.

Release remains shallow; only the required Worker directory is nested.

## Real-device acceptance gate

v0.9.40.38 remains the accepted rollback until .40 passes.

Minimum useful test:

1. Confirm visible build `v0.9.40.40`.
2. Open the Landscape Director view with existing Inbox data.
3. Open Filter and select **All**. A nonzero `images match` count must result in actual images being visible/navigable.
4. Open an existing Dupe or Repeat in `+ Origin → Gates` and press **Compare**. Confirm true side-by-side images and row-aligned metadata; tap either image for close-up. You do not need to change the existing gate decision just to test the view.
5. If a Quarantine case is already available, tap the Quarantine row to Inspect it. Do not manufacture an AI failure solely for this test.
6. Confirm `+ Origin → Add` now has one multi-file **Choose Files** control rather than separate Choose Files / Choose File controls.
7. Once the Inbox is visible again, resume the Batch test that .39 blocked.
