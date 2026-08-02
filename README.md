# Genreactrix v0.9.2l — MATRIX_LABEL_FIT Repair

Corrective build for the blocking runtime error in v0.9.2k.

## Changes

- Restores the missing `MATRIX_LABEL_FIT` configuration before first use.
- Uses the existing verified `genreactrix-v0.9.2j-records` and `genreactrix-v0.9.2j-ai-runs` storage namespaces so current diagnostic data remains available.
- Keeps the v0.9.2k navigation-state diagnostic behavior.
- Uses uniquely named v0.9.2l assets to avoid stale browser/CDN assets.

## Validation

- JavaScript syntax checked with `node --check`.
- All referenced local assets are included in the package.
- ZIP integrity checked.
