# Genreactrix v0.9.40.56 — Theme Rerun Preview Request

Built directly from v0.9.40.48. The accepted Landscape arrangement remains the visual baseline.

## AI Description rerun workspace

Opening **AI Rerun Description** temporarily repurposes the existing Reaction rectangle as a guidance/current-work text field. The surrounding Landscape regions do not move or resize. AI Themes and AI Description remain visible, and the rerun control band occupies the existing 4×2 AI-button footprint.

Button order, left-to-right then top-to-bottom:

**Save Draft · Select Draft · Preview Request · Submit**

**Review Reactions · Descriptions · Clear · Return**

### Current state and drafts

- Guidance and rerun choices are Current state and remain sticky through Return and repeated submissions until explicitly cleared or finalized through Batch.
- Blank/whitespace-only guidance is omitted from the AI request.
- Save Draft stores the complete current rerun setup as an **AI Desc Rerun Draft**.
- Select Draft restores the complete saved setup; the main Undo/Redo controls can reverse/reapply that restore.
- Immediately before Batch commitment, meaningful Current rerun state is automatically saved as an **AI Desc Rerun Draft**, then its live Current state is cleared.
- Portable Project backup already captures the project-scoped Current localStorage state; saved drafts live on the permanent Image Record.

### Selectable context

- The image is always included.
- Each of the 3 Director Themes and 3 AI Themes can be independently selected/deselected as AI context.
- **Descriptions** normal tap prefers the most recent prior Description. Long press opens the dated Description-version list.
- Descriptions checkboxes independently include any number of Description versions as AI context. Populating a Description does not automatically include it.
- The populated Description has a mirrored Include checkbox on the existing AI Description display.

### Edit mode from the existing AI Description field

No separate mode buttons are added.

- No deliberate cursor/highlight: **ALL / Rewrite All**.
- Blinking cursor in nonblank Description text: **ADD at cursor**.
- One contiguous highlighted span: **REPLACE highlighted section**.
- Add/Replace targeting turns the entire AI Description field **maroon**.
- Manual typing/pasting into the AI Description target is blocked; it is a targeting surface, not a direct editor.
- For Add/Replace the Worker returns only the insertion/replacement fragment. Genreactrix splices that fragment into the target locally, preserving all text outside the allowed boundary.

### Preview, review, clear, and return

- Preview Request exposes the complete request before an AI call, including operation, always-included image, guidance/no guidance, selected Themes/no Themes, included Description versions/no Descriptions, and exact cursor/highlight target.
- Review Reactions is press-and-hold reference viewing only. Releasing restores the rerun workspace unchanged.
- Clear offers **Clear Text Entry** and **Clear Highlights/Cursor** independently; its Submit path requires confirmation.
- Return exits without discarding Current rerun state.

### Immutable AI history

Every actual Description submission creates a new AI attempt/artifact version. The exact structured rerun request is retained with attempt/history metadata. Add/Replace also preserves the raw returned edit fragment in immutable history while the live Description projection contains only the complete resulting Description.

## Worker contract

This build extends the bundled Cloudflare Worker to accept structured Description rerun context: selected Themes, included Description versions, and All/Add/Replace target information. The Worker version is **0.9.6.25-description-rerun-workspace**.

The updated Worker must be deployed before testing actual structured Submit calls. UI-only inspection does not require a Worker call.

## Protected scope

- No existing Landscape CSS rule was edited; v0.9.40.48 CSS remains an exact prefix of this build and the new workstation styles are scoped/appended.
- No existing image, Director Theme, AI Theme, AI Description, drawer, or surrounding panel geometry was moved.
- Existing v0.9.40.48 AI-drawer load defaults remain intact outside rerun mode.
- 60/40 Reaction architecture is unchanged.

Real-device/browser acceptance is still required.


## v0.9.40.50 surgical correction
- The populated-Description **Include** checkbox now receives the same measured vertical offset as the AI Description panel.
- This keeps the checkbox with the populated AI Description field instead of falling back onto the Submit-button row.
- No rerun behavior, surrounding geometry, typography, Worker contract, or other UI logic changed.


## v0.9.40.52 — Theme Rerun PrimPicker visual pass

- Adds the Landscape Theme Rerun 4×2 control shell.
- Adds PrimPicker with code-backed P01–P14 rows, fixed ascending order, one-emoji-width spacing, and centered status dots.
- AI Theme cells cycle Neutral → Replace (red) → Preserve (green) → Neutral. Replace slots create Theme-specific PrimPicker rows; General fills the remaining row until all three slots are specific.
- Tap cycles Mandatory → Preferred → Optional → Discouraged → Forbidden → Unchosen. Long-press opens direct status selection or Clear.
- Destructive row loss requires confirmation; Clear resets PrimPicker assignments while retaining Theme selections/rows.
- Theme rerun submission/history/exclusions/description-context actions remain reserved for a later bounded pass; Worker is unchanged.
- Renames the AI Description rerun control label Classics → Descriptions.

## v0.9.40.52 — PrimPicker Discouraged Dot Contrast
- Darkens the Discouraged red-orange status dot to a deeper red-orange so it is visually distinct from Forbidden hot magenta.
- No PrimPicker behavior or surrounding Landscape geometry changed.
- Worker unchanged from v0.9.40.51.


## v0.9.40.53 — Theme Exclusions

- Theme Exclusions is now a working Theme-rerun control.
- The exclusion catalog is generated from stable PFM codes (PFM0102 through the canonical non-diagonal PrimFusion set); visible Theme words are resolved from those codes at render time.
- Tap a Theme to prohibit it from being returned by this rerun; tap again to remove the prohibition.
- Exclusions are stored in Current rerun state by PFM code, persist per image, and survive closing/reopening the Theme rerun workspace.
- The exclusion dialog is searchable by displayed Theme name (and internally by PFM code), with selected exclusions shown in hot magenta.
- A preserved/green current Theme cannot simultaneously be excluded; the UI blocks either conflicting action instead of silently resolving it.
- PrimPicker behavior and accepted Landscape geometry are unchanged from v0.9.40.52.
- Theme Exclusions are state/UI only in this bounded pass; Preview/Submit wiring remains for subsequent Theme-rerun passes. Worker files are unchanged.


## v0.9.40.54 — Theme Rerun Description Context

- The Theme Rerun **Descriptions** control now reuses the established AI Description-rerun history behavior.
- On the first Theme-rerun Current state for an image, the current AI Description is populated and included by default, preserving the Image + current Description failsafe.
- Normal tap on **Descriptions** populates the most recent prior Description when one exists. Long press opens the dated/versioned Description history.
- Every history row has an independent **Include** checkbox; any number of Description artifacts may be included simultaneously.
- Tapping a history row populates it for inspection but does not change its Include state.
- The populated Description receives the same mirrored **Include** checkbox beside the existing AI Description field.
- Theme-rerun Description state stores artifact IDs/references, not human-readable labels; immutable Description history remains the authority.
- Existing PrimPicker, Theme Exclusions, Theme-state controls, and accepted Landscape geometry are unchanged.
- This is a UI/state pass only. Preview Request and Submit do not consume the selected Description context yet. Worker files are unchanged from v0.9.40.53.


## v0.9.40.55 — Saved Draft deletion

- **Select Draft** entries now support deletion by long-press.
- A long-press opens a destructive confirmation before removing that saved AI Description rerun draft.
- A normal tap still restores the draft exactly as before.
- This pass does not change Theme Rerun state, AI request behavior, Worker code, or accepted Landscape geometry.


## v0.9.40.56 — Theme Rerun Preview Request

- **Preview Request** now renders the complete current Theme-rerun request without sending an AI call.
- The preview always identifies the image as included.
- All three current Theme slots are shown with their Neutral / Red / Green instruction and whether PrimPicker guidance applies. Green/protected Theme slots are explicitly marked untouched.
- PrimPicker preview is grouped by its active Theme/General scopes. Primitive identity remains code-backed; the interface resolves the current human-readable Prim names from those P-codes.
- Prim states are displayed in the locked order: Mandatory, Preferred, Optional, Discouraged, Forbidden, Unchosen. Unchosen is shown with its derived 40/50 effective weight for that scope; it is not treated as a selectable 40/50 state.
- Theme Exclusions are previewed from their stored PFM codes while displaying the current Theme names.
- Included Description artifacts are shown with date/time, version, and full text. The preview explicitly says when no descriptions or no exclusions are included.
- **Submit** and **Theme History** remain intentionally unwired in this bounded pass. Preview performs no Worker call.
- The v0.9.40.55 long-press Saved Draft deletion fix is carried forward.
- Preview uses the established scrollable request-preview modal language; no accepted Landscape workspace geometry was changed. Worker files are unchanged.
