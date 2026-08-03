# Genreactrix v0.9.2m — Startup Hydration Repair

Portrait corrective build based on v0.9.2l.

## Change

- Removed the premature initial render that occurred before the current image record was loaded.
- Startup now loads the current image classification from browser storage before Home and the consoles render.
- Preserves the existing v0.9.2j storage namespace so the current Theme 1 and Theme 2 diagnostic records remain available.
- Keeps the Theme diagnostic line for verification.

## Expected verification

After refreshing on demo image 1, Home and the Theme screen should immediately show the saved Theme values. The diagnostic should show matching `active` and `stored` values.
