# Genreactrix v0.9.40.38 — Portable Persistence + Migration Hardening

Accepted source baseline: **v0.9.40.37**.

This release repairs the browser-local backup/restore boundary before the final integration/layout work. It does not add cloud synchronization and does not redesign any Genreactrix layout.

## What changed

### 1. Portable full-data backup format

A new nonvisual `persistence-engine.js` owns complete project backup and restore.

The backup format is now schema version 3 (`genreactrix-portable-idb-v1`) and preserves:

- every `genreactrix-*` IndexedDB database discovered by the browser;
- database versions;
- object-store key paths and auto-increment behavior;
- primary keys, including out-of-line keys;
- index names, key paths, uniqueness, and multi-entry rules;
- normal structured data;
- Blob/File bytes and MIME types;
- ArrayBuffer / typed-array bytes;
- project-scoped local-storage mirrors needed by the current local model;
- Project/Runtime scope metadata.

Binary data is explicitly encoded rather than passed through ordinary JSON serialization. This fixes the old failure mode where an IndexedDB `Blob` became `{}` in a JSON backup.

### 2. Backup integrity verification

Each portable backup carries a SHA-256 integrity digest plus manifest counts for:

- databases;
- records;
- binary objects;
- binary bytes;
- project/runtime/mixed database scope counts.

A full restore refuses a legacy backup whose binary/schema safety cannot be verified and refuses a backup whose integrity digest does not match.

### 3. Real full-database restore

Maintenance → Restore backup now delegates to the portable persistence engine.

Restore preserves the backed-up object-store schema instead of guessing a schema from the first row.

Two modes remain:

- **Merge by immutable IDs** — permitted only when the backup and current Project IDs match. Existing matching records are updated and unrelated existing records remain.
- **Replace current project** — creates a verified emergency backup first, removes the current Genreactrix local databases, recreates the backed-up databases from their recorded schema, restores all records/binary assets, adopts the backed-up Project, and reloads the app.

If Merge encounters a backed-up database that does not yet exist locally, the database is created from the recorded backup schema rather than creating an unusable empty database.

### 4. Project identity remains distinct from Runtime identity

A restore may move/copy a Project and its physical working assets to another browser/runtime.

The backed-up `projectId` is restored. The target browser's `runtimeId` is **not replaced by the source Runtime ID**. Source Runtime records remain useful provenance; the target Runtime registers itself separately after restore.

Restored local blobs are then registered as physical asset locations on the target Runtime.

The one-time asset backfill marker is now keyed by both Project ID and Runtime ID so switching/replacing Projects on one browser cannot suppress the required local asset scan.

### 5. Project data is brought current before backup

Before a portable backup is captured, the existing Project migration helpers finish copying known legacy custom vocabulary/evaluation keys into Project-owned storage and finish Project-scope record stamping. Backup therefore snapshots the canonical logical Project state rather than racing those background migrations.

### 6. Settings / Maintenance UI behavior

- Settings → Backups → **Create data backup** now creates the portable verified format.
- Settings file import remains a settings-only operation.
- A full backup selected there is verified and redirected to Maintenance for full restore rather than silently importing only its settings.
- Maintenance restore preview displays verified database, record, binary-object, and binary-byte counts.
- Restore creates a portable emergency backup before making changes.
- The page reloads after a successful full restore so all in-memory engine caches are rebuilt from restored storage.

Full data backups may contain the locally stored AI access key because that key is part of the local settings database. Treat backup files as private project data.

## What did not change

- 60/40 Reaction calculation.
- AI Attempt/Artifact version semantics.
- Queue / Bundle / Inbox / Batch ownership.
- Explicit Batch membership introduced in v0.9.40.37.
- Director Review / Depot / Delete / Reject behavior.
- Keep / Recycle / Purgatory semantics.
- Origin Packs / Dupe / Repeat / Quarantine behavior.
- Layout geometry, CSS, or breakpoints.
- Reports implementation.
- Cloud/server synchronization (still deferred).

## Deterministic verification completed

- Portable codec round-trip: Blob, typed array, Date, BigInt, Map — PASS.
- Full IndexedDB portable round-trip: indexed logical record + out-of-line-key Blob — PASS.
- Blob MIME type and all bytes restored byte-for-byte — PASS.
- Database version, object-store key path, and index restored — PASS.
- Tampered backup rejected by SHA-256 verification — PASS.
- Replace restore adopts Project ID but retains target Runtime ID — PASS.
- Merge across different Project IDs rejected — PASS.
- Project/Runtime identity regression — PASS.
- Project Settings regression — PASS.
- AI Artifact history regression — PASS.
- AI rerun/version-chain integration regression — PASS.
- Explicit Batch membership regression — PASS.
- Director state regression — PASS.
- Lifecycle state regression — PASS.
- All top-level JavaScript files parse — PASS.

## Layout / behavior preservation audit

Against accepted v0.9.40.37:

- `styles.css` is byte-for-byte identical.
- `ai-analysis-engine.js` is byte-for-byte identical; the 60/40 implementation was not touched.
- Non-script HTML structural sequence is identical: 1,549 elements.
- Existing IDs/classes/order are unchanged; only backup explanatory text, visible build number, and script loading/version references changed.
- One new release file: `persistence-engine.js`.
- Release contains 73 files total and remains shallow except for the required Worker folder.

## Real-device acceptance gate

v0.9.40.37 remains the accepted rollback until v0.9.40.38 is tested on-device.

Minimum safe test:

1. Open v0.9.40.38 over existing v0.9.40.37 data and confirm normal Origin → Queue → AI / Inbox behavior still works.
2. Settings → Backups → Create data backup. Confirm a backup file downloads.
3. Open Maintenance → Restore backup and select that file. The preview must say **Verified** and show nonzero binary asset/byte counts when the project contains image blobs.
4. Preferably perform **Replace** in a secondary browser/runtime that does not contain irreplaceable local work. After automatic reload, verify the Project ID, settings/custom vocabulary, images/thumbnails, AI history, and normal workflow are present.
5. If a secondary runtime is not available, do not risk valuable browser-local data merely for acceptance; creation + verified preview can be accepted provisionally and the cross-runtime restore gate can remain pending.

