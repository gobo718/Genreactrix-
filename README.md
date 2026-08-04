# Genreactrix v0.9.4.2

Portrait Control Station: working quick-add amount and AI look-ahead queue foundation.

- Correctly places the editable default quick-add amount on the portrait panel.
- Keeps the amount persistent between sessions.
- Adds an orientation-neutral AI look-ahead queue engine.
- Automatically maintains the configured 25-image AI queue buffer.
- “Queue more for AI” adds the configured quick block (default 100) without fabricating analysis results.
- Shows queued and available unanalyzed counts on the portrait Control Station.
- Leaves landscape, tablet, desktop, shared classification logic, and existing dialogs unchanged.

This release establishes real queue state. It does not pretend that external AI analysis is connected.
