# Genreactrix v0.9.40.41 — Inbox Feed Identity / Asset Hydration Separation

Accepted rollback baseline: **v0.9.40.38**.

v0.9.40.40 was rejected on real-device acceptance. Billy repeatedly closed/reopened the Landscape Filter with **All** selected; the Filter consistently reported **97 images match · 11 Bundles in Inbox**, while the Director view still displayed **No images match this filter**. That proves the record/filter population existed and the failure was downstream in visible-feed construction.

## 1. Root failure fixed in .41

In .40, `rehydrateLandscapeFeed()` did this in one blocking sequence:

1. calculate the matching Image Records;
2. ask the Images Engine to materialize every selected image asset;
3. only after all materialization completed, replace the Director feed.

That coupled **population identity** to **full-resolution/thumbnail asset retrieval**. With a large Inbox, slow or unavailable assets could leave the visible feed at its previous empty state even though the Filter already knew that 97 records matched.

v0.9.40.41 separates those responsibilities.

### Authoritative population first

- Matching Inbox Image Records immediately become the Director feed population.
- Each record receives a temporary loading shell carrying the real Image ID and Image Record.
- `feedEmpty` therefore reflects the record population, not whether 97 blobs have finished loading.
- The Director can navigate the known Inbox population immediately.

### Asset hydration second

- Actual image assets hydrate asynchronously underneath the already-visible record population.
- The current image is prioritized first.
- Up to four assets hydrate concurrently instead of one giant sequential all-or-nothing feed build.
- A successfully hydrated asset replaces only its own loading shell.
- Missing/unavailable assets retain the existing explicit **Image unavailable** placeholder from .40 rather than removing the record from the feed.
- A stale hydration generation cannot overwrite a newer Filter/Bundle population.

This means a slow, missing, remote, or damaged image can affect **that image's preview**, but cannot make the entire Inbox population disappear.

## 2. Inbox feed integrity checker

Maintenance Quick Check now includes an **Inbox feed** invariant.

It compares:

- records expected from the current Landscape Filter;
- Image IDs actually represented in the Director feed;
- `feedEmpty` state;
- outstanding asset hydration count.

A nonzero expected population with a smaller visible population or a false empty state is reported as a critical feed-population issue.

## 3. .40 investigation/UI work retained

The .40 human-investigation work remains intact in .41:

- Single Image Inspector for Quarantine, Import Failure, Retry Import Source, Recycle, Purgatory/Maintenance and other individual records;
- Two-Image Comparator for Dupe and Repeat;
- Candidate | Original side-by-side previews;
- row-aligned metadata comparison;
- tap either image for close-up;
- context-specific actions (Sustain/Overrule, Re-evaluate, Release/Defective, Retry, Restore);
- multi-file **Choose Files** remains; redundant single-file picker remains removed;
- targeted short-landscape Filter modal fit remains.

## 4. What did not change

- 60/40 Reaction calculation or AI rerun semantics.
- AI Attempt/Artifact history.
- Origin gate semantics.
- Queue/Buffer/Automatic Flow policy.
- Bundle formation semantics.
- explicit Batch membership.
- Post-processing/Purgatory behavior.
- Project/Runtime boundary.
- portable backup/restore format.
- Reports implementation.
- established Director/AI/PrimFusion geometry.

## 5. Deterministic verification

- Actual .41 feed-construction function tested with **97 matching records while every asset-hydration Promise remains permanently unresolved**: Director feed immediately contains all 97 record shells and `feedEmpty=false` — PASS.
- Generation-isolation test: an older 97-record hydration resolving after a newer 2-record Filter result cannot overwrite the newer population — PASS.
- Maintenance feed-integrity checker reports 97 expected / 97 visible as healthy — PASS.
- All JavaScript parses — PASS.
- `styles.css`, `ai-analysis-engine.js`, `bundle-engine.js`, `images-console.js`, `queue-engine.js`, `maintenance-engine.js`, and `investigation-ui.js` are byte-for-byte identical to .40 — PASS.

## 6. Source-diff containment

Against v0.9.40.40, substantive behavior changes are confined to:

- `app.js` — immediate record-shell population, background per-image hydration, current-image priority, Inbox feed integrity checker, build number;
- `index.html` / `unfolded.html` — build/cache references;
- `README.md`.

No layout redesign is included.

## Real-device acceptance gate

v0.9.40.38 remains the accepted rollback until .41 passes.

Minimum test:

1. Confirm visible build **v0.9.40.41**.
2. Open Landscape Director with the existing 97-image Inbox.
3. Filter → **All**.
4. The Director population must appear immediately. Some images may briefly show **Loading image…** while their bytes hydrate; that is acceptable. **No images match this filter** is not acceptable when the Filter count is nonzero.
5. Navigate through several images. A missing asset may show **Image unavailable**, but navigation/population must remain intact.
6. Run Maintenance → Quick check; it should not report an **Inbox feed** population mismatch.
7. If the Inbox is visible, continue the Batch test that .39/.40 blocked.
