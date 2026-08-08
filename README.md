# v0.9.39.55 — Image View Ring Center + Touch Calibration (Cache-Busted)

Continuation of v0.9.39.54 with the deployment/version defect corrected.

Changes in this build:
- Bumps every visible/internal page build marker to v0.9.39.55.
- Bumps `styles.css` and `app.js` cache-busting query strings to v0.9.39.55 so the browser must load the new Image View geometry.
- Preserves the v0.9.39.54 Image View calibration: 50px rings, 17px glyphs, one shared 50px center box, and ring/emoji `50%/50%` centering.
- Preserves the accepted canonical/custom four-row slot engine and all unrelated UI.

The previous v0.9.39.54 archive contained the CSS calibration but still referenced v0.9.39.53 in `index.html`, allowing the browser to reuse the old cached stylesheet.
