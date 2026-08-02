# Genreactrix v0.9.2g — Clean Classification Storage

Portrait corrective build based on v0.9.2f.

## Change

- Uses a new `genreactrix-v0.9.2g-records` namespace for classification data.
- Uses a new `genreactrix-v0.9.2g-ai-runs` namespace for AI run data.
- Does not automatically migrate earlier classification records because prior faulty builds may have saved identical Theme values under multiple image keys.
- Leaves all earlier browser-storage namespaces untouched as an archive.
- Demo images therefore begin with independent clean classification records in this build.

## Test target

1. Select Theme 1 on one demo image and allow the app to advance.
2. Confirm the next demo image does not inherit Theme 1/2/3.
3. Cycle through all demo images and confirm their classification states remain independent.
4. Retest Undo/Redo only after independent state is confirmed.
