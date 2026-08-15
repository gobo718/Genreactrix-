# Genreactrix v0.9.40.43 — Director Hydration Window

Source: v0.9.40.42 reliable Inbox asset hydration candidate.
Protected accepted rollback: v0.9.40.38.

## Bounded purpose

v0.9.40.43 addresses the real-device symptom where an Inbox image could appear briefly, then be replaced by the black **Loading image…** screen, and where a 97-image Inbox produced widespread asset-hydration failures.

The logical Inbox population remains complete for filtering/navigation, but Director no longer tries to hydrate every image asset at once.

## Changes

- Hydration is limited to the current Director image plus one immediate neighbor on each side (maximum three image assets at a time).
- Navigation immediately prioritizes the destination image.
- Feed/filter refresh preserves an already-resolved visible image instead of replacing it with a new loading shell.
- The display resolver reuses an existing runtime object URL for an image instead of repeatedly revoking/recreating it during overlapping display requests.
- Missing assets may still be retried on a later feed refresh; a confirmed missing state is not permanently converted into a fake success.
- Full logical Inbox records remain present even when their image bytes have not yet been hydrated.
- The existing bounded 12-second lookup termination remains: a genuinely unresolved current/window image becomes **Image unavailable** instead of loading forever.
- Maintenance hydration diagnostics now judge stuck work only inside the active three-image hydration window rather than treating intentionally unhydrated offscreen records as stuck.

## Explicitly unchanged

- No layout redesign.
- No 60/40 AI changes.
- No lifecycle, Bundle, Batch, Project/Runtime, persistence, or Reports changes.
- Dupe/Repeat Comparator and Single Image Inspector from v0.9.40.40+ remain included.
- Multi-file **Choose Files** remains the Origin picker.

## Device acceptance

1. Confirm the site reports **v0.9.40.43**.
2. Open the existing 97-image Inbox in Landscape with Filter = All.
3. Navigate through at least 10 images, including images that flashed/disappeared or became unavailable in v0.9.40.42.
4. A successfully displayed image must remain displayed; it must not revert to **Loading image…** because other Inbox assets are hydrating.
5. The current image should load without waiting for the rest of the Inbox. Nearby images may prefetch.
6. Any truly unresolved image must end as **Image unavailable** rather than remain loading indefinitely.
7. If image display is reliable, continue into the previously blocked Batch test.
