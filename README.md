# Genreactrix v0.9.40.113 — Theme reasoning cache loop correction

## v0.9.40.113

- Corrects the v0.9.40.112 startup/render regression caused by a stale Theme-change-reasoning cache mapping.
- A stale mapping now triggers at most one guarded forced reload for that image/artifact.
- The UI re-renders only when the reload actually matches the image's current immutable Theme artifact.
- A stale or failed reload cannot recursively schedule another render.
- Retains v0.9.40.112 Theme-change reasoning, #FFAF4D changed-Theme state, default-on Explain Theme changes, and shared page-origin correction.
- No Prim/PrimFusion semantic definition changes. PrimFusion Matrix remains 0.0.0.0.
