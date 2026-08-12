# Genreactrix AI Worker

Current bundled Worker: v0.9.6.23-registry.

Adapted from the Billy Labs Cloudflare Workers AI Vision infrastructure.

1. Install dependencies: `npm install`
2. Set the analysis secret: `npx wrangler secret put ANALYSIS_KEY`
3. Accept the configured Workers AI model license in Cloudflare if prompted.
4. Deploy: `npm run deploy`
5. Enter the deployed Worker URL and the same analysis key in Genreactrix → AI.

The browser never receives provider credentials. The Worker accepts `POST /api/genreactrix/analyze` and returns validated component results.
