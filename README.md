# Genreactrix v0.9.2o — Clean Portrait QA Baseline

This build is derived directly from the tested v0.9.2m startup-hydration build.

## Retained verified fixes

- Theme 1 commit-and-advance stores the source image classification before advancing.
- Theme 1, Theme 2, and Theme 3 use per-image records.
- Next and Back synchronize the displayed image with the active record key.
- Startup loads the current image's saved classification before Home renders.
- Theme values persist through navigation and browser refresh.

## Cleanup in this build

- Removed temporary Theme diagnostic output and diagnostic error overlays.
- Removed obsolete versioned JavaScript and CSS assets from the package.
- Restored the standard project files: `app.js` and `styles.css`.
- Added query-string cache busting in `index.html` without creating additional repository files.
- Preserved the verified v0.9.2j browser-storage namespace so existing v0.9.2m test records remain available.

## Current scope

Portrait QA remains in progress. This build is the clean baseline for testing Theme 3, Undo/Redo, Reset Current Changes, Clear Data, Home, Director, AI Console, and Image Console behavior.

## v0.9.2o changes

- Empty and duplicate Undo/Redo operations no longer add history depth.
- The shared 13-primitive layout uses a 7/6 stagger with a half-slot offset on the lower row.
- Temporary diagnostic output is not present in the production interface.
