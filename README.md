# Genreactrix v0.9.40.39 — Operational Integration Closure

Accepted source baseline: **v0.9.40.38**.

This is the final non-layout integration/ownership audit before the Layout phase. It does not redesign any Genreactrix interface and does not begin Reports work.

## What changed

### 1. Daily Housekeeping now exclusively owns automatic non-AI recovery/retention

The previous source had two independent startup paths that could purge expired Recycle assets:

- `app.js` invoked `purgeExpired()` directly during startup; and
- `housekeeping-engine.js` invoked the same retention action as part of Daily Housekeeping.

The direct `app.js` automatic purge has been removed. Automatic retention is now invoked only by Daily Housekeeping.

Daily Housekeeping continues to perform only the canonical non-AI operational work:

- retry eligible Purgatory/Post-processing plans;
- retry eligible Retry Import Source cases;
- purge full-resolution Recycle assets older than the configured retention period.

It does **not** launch/retry AI and does **not** touch Quarantine.

### 2. Housekeeping daily state is Project + Runtime scoped

The old `genreactrix-housekeeping-last-daily-v1` marker was browser-global. That meant replacing/restoring a different Project in the same browser on the same day could cause the new Project to inherit the old Project's “already ran today” state.

v0.9.40.39 uses a Project + Runtime scoped marker:

`genreactrix-housekeeping-last-daily-v2:<projectId>:<runtimeId>`

Consequences:

- same Project + Runtime runs no more than once per local day unless explicitly forced;
- another Project in the same browser receives its own daily run;
- another Runtime for the same Project receives its own local operational run;
- no historical Runtime identity is fabricated.

### 3. Recycle retention preserves thumbnail-safety ordering

The old startup chain backfilled missing permanent thumbnails before invoking retention purge.

That safety ordering is preserved. `app.js` exposes the existing startup thumbnail-backfill promise; Daily Housekeeping waits for it before purging expired Recycle assets.

If startup thumbnail preparation fails, Housekeeping records the error and **skips Recycle purge** for that run rather than risk deleting the only available full-resolution source before permanent lightweight record material is secured.

### 4. Bundle cross-reference integrity verifier

`bundle-engine.js` now verifies:

- Bundle members resolve to real Image Records;
- Bundle records carry Project identity;
- current Image Record Bundle references resolve to real Bundle records;
- active Bundle membership exists only while Inbox/Post-processing/Purgatory owns the image;
- an `inbox-working` image has an active Bundle association.

The verifier is registered with Maintenance as a quick checker.

### 5. AI Attempt / Artifact history is now part of full Maintenance integrity checking

The existing AI Artifact verifier already checks:

- AI Attempts reference real images;
- Attempts reference existing output Artifacts;
- Artifacts reference existing Attempts when applicable;
- current Image Record artifact references resolve;
- combined Reaction artifacts remain reconstructable from their exact Theme + direct-Reaction artifact dependencies.

v0.9.40.39 registers that verifier with Maintenance as a full-project checker. No AI history semantics or 60/40 math changed.

### 6. Portable persistence capability is now part of full Maintenance integrity checking

The portable persistence engine now exposes a lightweight integrity check for:

- IndexedDB database enumeration support;
- Web Crypto SHA-256 availability;
- current Project context;
- current Runtime context.

It does not create a full backup during a Maintenance scan.

### 7. Maintenance coverage now spans the operational spine

Through existing and newly registered checkers, Maintenance can validate the current core architecture across:

- Images/storage;
- Origin Packs;
- Origin Gates;
- Lifecycle Spine;
- Queue;
- Bundles;
- AI execution;
- AI Attempt/Artifact history;
- Quarantine;
- Director state;
- Batch;
- Post-processing/Purgatory;
- Daily Housekeeping;
- Home authoritative counts;
- Project / Runtime identity;
- Project Settings;
- Portable Persistence.

Reports/analytics/research integrity checkers remain separate existing subsystems and are not redesigned in this pass.

## What did not change

- Origin → Queue → AI → Staged → Bundle → Inbox → Batch → Post-processing lifecycle.
- Queue ownership of AI-in-progress work.
- Automatic Flow-through / Buffer policy.
- Explicit Batch membership from v0.9.40.37.
- Post-processing atomicity / Purgatory semantics.
- Quarantine / Defective behavior.
- Dupe / Repeat / Import Failure behavior.
- 60/40 Reaction math.
- AI rerun behavior or artifact versioning.
- Project / Runtime identity rules.
- Portable backup/restore format or restore semantics, except its build metadata is now 0.9.40.39.
- Director Review / Depot / Delete / Reject and independent Keep behavior.
- Layout geometry, CSS, breakpoints, or interface structure.
- Reports implementation.

## Deterministic verification completed

- All 62 top-level JavaScript files parse — PASS.
- Housekeeping same Project + Runtime runs once/day — PASS.
- Different Project on same Runtime receives independent daily run — PASS.
- Different Runtime for same Project receives independent daily run — PASS.
- Housekeeping AI calls — **0** — PASS.
- Housekeeping Quarantine calls — **0** — PASS.
- Recycle purge skipped when startup thumbnail preparation fails — PASS.
- Direct automatic `app.js -> purgeExpired()` path absent — PASS.
- Automatic `purgeExpired()` caller is Housekeeping only — PASS.
- Bundle cross-reference verifier detects missing Bundle member Image Record — PASS.
- Bundle verifier detects missing Bundle record reference — PASS.
- Bundle verifier detects Inbox ownership/membership mismatch — PASS.

## Preservation audit against accepted v0.9.40.38

- `styles.css` is byte-for-byte identical.
- `ai-analysis-engine.js` is byte-for-byte identical; the 60/40 implementation was not touched.
- `index.html` retains exactly 1,549 non-script elements and 673 IDs in the same structural sequence.
- `unfolded.html` structure is unchanged.
- No new release files were added; release remains 73 files total and shallow except for the required Worker folder.
- Source changes are limited to Housekeeping ownership/integrity wiring, Bundle/AI-history/persistence verifier registration, build references, and the app startup retention handoff.

## Real-device acceptance gate

v0.9.40.38 remains the accepted rollback until v0.9.40.39 is tested on-device.

Minimum test:

1. Open v0.9.40.39 over existing data and confirm the visible version is correct.
2. Use normal Origin → Queue → AI / Bundle / Inbox operation briefly; nothing should feel different.
3. Open Maintenance & Recovery and run **Quick check**. It should complete without a new critical lifecycle/Bundle/Housekeeping issue on healthy data.
4. Reopen/reload Genreactrix. Normal data/counts should remain unchanged; Daily Housekeeping should not create duplicated work.

A real Purgatory/source-recovery/expired-Recycle failure does not need to be manufactured for acceptance; those branches have deterministic coverage and should be observed opportunistically when genuine cases exist.

After this acceptance, the next bounded project phase is Layout/UI operational refinement before Reports.
