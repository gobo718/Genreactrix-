# Genreactrix v0.3.13 — Picture/Data State Controls

Genreactrix is a local-first browser workspace for reviewing image folders, assigning reactions and genres, managing review queues, validating records, running guarded batch operations, and exporting annotation data.

## Run

Open `index.html` directly in a modern browser. Folder access, annotations, taxonomy, automation rules, flag vocabulary, and recovery checkpoints remain local to that browser profile. For offline installation/service-worker caching, serve this folder over HTTP(S).

## Current capabilities

- Folder-based image review with previous/next and unreviewed navigation.
- Editable 13×13 reaction taxonomy with stable numeric reaction indexes.
- Genres, confidence, favorites, review queue, duplicate warnings, undo, and reusable flags.
- Separate picture/data actions:
  - **Clear Picture** saves the current annotation when necessary, removes the picture from the active workspace, and preserves its data for reports.
  - **Reset Data** keeps the picture loaded and clears its saved research data for a fresh pass.
  - **Delete Picture + Data** removes the picture from the active workspace and removes its saved research data.
- Flag reasons use an open vocabulary: typing a new reason and flagging the image adds that reason to future choices.
- Search, relationship ranking, validation, conflict detection, and guarded batch operations.
- JSON/CSV export, JSON import, and named/automatic recovery checkpoints.

## Data compatibility

The existing local-storage key is intentionally unchanged. Workspace schema version 3 adds `flags` and `flagReasons`; older saved workspaces normalize forward automatically.
