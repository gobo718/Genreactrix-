# Genreactrix v0.9.40.167 — AI Description reporting

Report-only release based on v0.9.40.166.

## Change
- Adds **AI Description** as an optional Custom Reports module.
- Exports the exact current Description projected on each Image Record.
- Reads preserved AI Description artifacts/attempts when available.
- Links the current Theme artifact to the Description artifact from the **same AI attempt** when that relationship is provable.
- Includes provider/model, prompt versions, generated timestamps, Description history, and same-attempt preliminary Themes/Description-stage diagnostics when preserved in the Theme artifact.
- Explicitly reports when a same-attempt Theme/Description link cannot be proven rather than inferring it.

## Not changed
- No Worker change. Keep Genreactrix AI Worker v0.9.6.115.
- No Theme-selection, Description-generation, Reaction, recovery, provider-routing, or concurrency behavior changed.
- No report scope/filter semantics changed.
- No non-Reports UI geometry changed.
