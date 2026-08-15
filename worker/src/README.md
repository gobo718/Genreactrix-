# Genreactrix v0.9.40.42 — Reliable Inbox Asset Hydration

Accepted rollback baseline: **v0.9.40.38**.

v0.9.40.41 partially repaired the Landscape Inbox blocker: the Director population now surfaces correctly, but real-device testing showed per-image asset hydration remained unreliable. Some Inbox records displayed normally while others remained indefinitely on **Loading image…** even though their Image Record and AI Description were present.

## 1. Scope

This release changes only the Director/Inbox image-display hydration path. It does not redesign Layouts, change Filter semantics, alter Queue/Bundle/Batch ownership, or modify AI/60-40 behavior.

## 2. Root causes addressed

### Display no longer performs source-recovery work

The prior display path could fall through from local asset lookup into source recovery, including network retrieval attempts. That made a Director paint operation wait on work that belongs to explicit source recovery / Daily Housekeeping.

v0.9.40.42 adds a dedicated display resolver:

1. runtime-local working/kept full-resolution asset;
2. permanent thumbnail;
3. recorded direct URL if one exists;
4. explicit **Image unavailable** placeholder.

Normal Director hydration calls this resolver with source recovery disabled. Existing source-recovery behavior remains available to the actual recovery workflows.

### Current image gets urgent hydration

Background population hydration is no longer the only way an image can receive its bytes. Whenever navigation lands on a still-loading record, that Image ID receives an independent urgent hydration request. Therefore the Director does not have to wait for the destination image's position in a large background queue.

### Loading cannot be permanent

Each display lookup has a bounded 12-second completion gate. If the local resolver never completes, the record remains in the Director population but its preview becomes **Image unavailable** with an explicit timeout message.

If a URL/object URL resolves but the browser cannot decode or display the image, the image element error is also converted into the explicit unavailable state.

### Hydration integrity diagnostics

Maintenance → Quick check now detects a Director record that remains in a loading shell beyond the permitted hydration window and reports `inbox-feed-asset-hydration-stuck`.

## 3. Existing work retained

The .40/.41 work remains present:

- immediate record-first Inbox population;
- Filter population synchronization protections;
- Single Image Inspector;
- Two-Image Comparator for Dupe/Repeat;
- Candidate | Original aligned metadata comparison and close-up;
- Quarantine inspection/diagnostics;
- multi-file **Choose Files** control with redundant single-file picker removed;
- explicit Batch membership;
- Project/Runtime and portable persistence work.

## 4. Verification performed

- All 63 top-level JavaScript files parse successfully.
- Actual hydration helper harness: never-resolving display Promise terminates in explicit missing-asset state — PASS.
- Actual hydration helper harness: urgent navigation to a second loading Image ID hydrates independently of the first request — PASS.
- Display resolver defaults to `allowRecovery=false`; network/source recovery is gated behind an explicit opt-in — PASS.
- Maintenance source contains stuck-hydration detection — PASS.
- `styles.css` is byte-for-byte identical to v0.9.40.41 — PASS.
- `ai-analysis-engine.js` is byte-for-byte identical to v0.9.40.41 — PASS.
- Portrait HTML structure remains 1,589 non-script elements / 695 unique IDs in both v0.9.40.41 and v0.9.40.42 — PASS.
- Local headless Chromium smoke attempt did not complete within the environment timeout, so no browser/device pass is claimed from that attempt.

## 5. Real-device acceptance gate

v0.9.40.38 remains the accepted rollback until this passes on Billy's device.

1. Confirm **v0.9.40.42**.
2. Landscape → Filter → **All**.
3. Navigate through images that previously showed hit-or-miss loading.
4. Every record must reach one of two terminal display states: the actual image/thumbnail, or explicit **Image unavailable**. It must not remain indefinitely on **Loading image…**.
5. Navigation to a loading image should begin that image's hydration immediately rather than waiting behind the rest of the Inbox.
6. Maintenance → Quick check should not report `inbox-feed-asset-hydration-stuck` after hydration has settled.
7. If the Inbox is usable, continue the previously blocked Batch test.
