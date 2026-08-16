# Genreactrix AI Worker

Current bundled Worker: v0.9.6.28-theme-rerun-text-protocol.

Adapted from the Billy Labs Cloudflare Workers AI Vision infrastructure.

1. Install dependencies: `npm install`
2. Set the analysis secret: `npx wrangler secret put ANALYSIS_KEY`
3. Accept the configured Workers AI model license in Cloudflare if prompted.
4. Deploy: `npm run deploy`
5. Enter the deployed Worker URL and the same analysis key in Genreactrix → AI.

The browser never receives provider credentials. The Worker accepts authenticated `POST /api/genreactrix/analyze` for AI results and `POST /api/genreactrix/image` as a bounded image-fetch proxy used when browser CORS would otherwise prevent Import from creating its required 64×64 thumbnail.


## Theme Rerun Submit

The analyze endpoint accepts a structured `themeRerun` context for Theme-only reruns. Stable PFM/P codes are authoritative. Preserve, Replace, PrimPicker, Theme Exclusions, and included Description references are enforced in the Worker before/while selecting the three Theme results.

Worker v0.9.6.28 moves Theme Rerun provider output off JSON Mode and onto a compact pipe-delimited text protocol. Preserved slots are resolved locally; only open slots are requested from the vision model. The Worker still validates every returned PFM against the exact slot candidate set and enforces final uniqueness. This specifically addresses the all-Neutral failure where the vision provider returned invalid JSON. Deploy this Worker before retesting Genreactrix v0.9.40.61 Theme Rerun Submit.
