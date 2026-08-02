# Genreactrix v0.9.2h — Clean Classification Storage

Portrait corrective build based on v0.9.2f.

## Change

- Uses a new `genreactrix-v0.9.2h-records` namespace for classification data.
- Uses a new `genreactrix-v0.9.2h-ai-runs` namespace for AI run data.
- Does not automatically migrate earlier classification records because prior faulty builds may have saved identical Theme values under multiple image keys.
- Leaves all earlier browser-storage namespaces untouched as an archive.
- Demo images therefore begin with independent clean classification records in this build.

## Test target

1. Select Theme 1 on one demo image and allow the app to advance.
2. Confirm the next demo image does not inherit Theme 1/2/3.
3. Cycle through all demo images and confirm their classification states remain independent.
4. Retest Undo/Redo only after independent state is confirmed.


## v0.9.2h

- Rebuilt Theme 1/2/3 persistence around explicit per-image record keys.
- Added immediate browser-storage write verification and visible save-failure status.
- Theme 1 now commits the source record before loading a clean destination record.
