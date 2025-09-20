<<<<<<< HEAD
# Veracity UI (demo)

MIT-licensed Next.js (v14+) TypeScript frontend that reproduces the core UX of the Veracity / veri-fact.ai demo. Uses Sass for styling, Chart.js for visualizations, React Query for data fetching, and Zustand for lightweight client state. Mock API routes let the UI run locally without a backend.

## Tech stack
- Next.js App Router, TypeScript
- Sass (SCSS modules)
- Chart.js via react-chartjs-2
- @tanstack/react-query for fetching
- Zustand for conversation state
- ESLint + Prettier
- Jest + React Testing Library (sample test)

## Getting started
```bash
pnpm install
pnpm dev
# or: npm install && npm run dev
```
App runs at http://localhost:3000

### Env variables
Create `.env.local` as needed:
```bash
# Optional: point server routes to real backend
DEV_PROXY_TARGET=https://api.truthx.local
```

By default, the app uses mocked routes under `app/api/*`. To connect a real backend, set `DEV_PROXY_TARGET` and update the dev/production rewrites as described below.

## Project structure
```
app/
  page.tsx               # main chat UI
  dashboard/page.tsx     # expert dashboard
  api/claim/submit/route.ts
  api/claim/status/route.ts
  api/feedback/route.ts
components/
  Header.tsx, Sidebar.tsx
  Chat/Conversation.tsx, Chat/MessageBubble.tsx
  ClaimComposer.tsx, VerdictCard.tsx, SourceItem.tsx, ScoreChart.tsx
  Dashboard/* charts
hooks/useConversation.ts
lib/types.ts, lib/api.ts, lib/react-query-provider.tsx
mock/seed.ts, mock/dashboard.ts
styles/_variables.scss, _mixins.scss
```

## Backend integration
- Replace calls to `/api/*` in `lib/api.ts` with your FastAPI endpoints.
- Option A (recommended): keep `/api/*` Next routes as a server-side proxy to FastAPI. In each route (e.g., `app/api/claim/submit/route.ts`), forward the request to `process.env.DEV_PROXY_TARGET`.
- Option B: configure `next.config.js` rewrites to forward `/api/*` directly in production.

Example forwarding (inside a route handler):
```ts
const target = process.env.DEV_PROXY_TARGET;
if (target) {
  const resp = await fetch(`${target}/claim/submit`, { method: 'POST', body: await req.text(), headers: { 'content-type': 'application/json' }});
  return new NextResponse(await resp.text(), { status: resp.status, headers: { 'content-type': 'application/json' }});
}
```

## Unit tests
```bash
pnpm test
```
Example test: `components/__tests__/VerdictCard.test.tsx` verifies score and source rendering.

## Accessibility & UX
- Keyboard-friendly composer (Enter to send; Shift+Enter for newline)
- Roles and labels on lists and charts
- Responsive layout: collapsible sidebar on small screens

## Deployment (Vercel)
- Add env var `DEV_PROXY_TARGET` if proxying to a backend.
- Ensure serverless functions can reach your FastAPI endpoint.
- Suggested build settings: Node 18+, `pnpm build`.

### Example `.env.production`
```bash
DEV_PROXY_TARGET=https://api.truthx.yourdomain
```

## Security notes
- Do not embed API keys in the frontend.
- Call LLM providers via your server-side (Next API routes or FastAPI) with proper auth.
- Validate and sanitize user input on the server.

## License
MIT — see LICENSE

## API contract (mocked)
POST `/api/claim/submit`
Request:
```json
{ "text": "string", "lang": "en|hi|string" }
```
Response:
```json
{
  "claim_id": "c123",
  "status": "done",
  "verdict": {
    "score": 72,
    "label": "Mostly True",
    "justification": "...",
    "sources": [{"id":"s1","domain":"example.com","credibility":78,"snippet":"...","url":"https://example.com/article"}]
  },
  "timestamp": "2025-09-01T12:00:00Z"
}
```
POST `/api/feedback` -> `{ claim_id, feedback_type: "upvote"|"downvote"|"report", comment?: string }`
GET `/api/claim/status?claim_id=c123` -> same as submit response

## Postman collection / curl
```bash
# Submit a claim
curl -X POST http://localhost:3000/api/claim/submit \
  -H 'content-type: application/json' \
  -d '{"text":"The earth is warming faster than expected","lang":"en"}'

# Feedback
curl -X POST http://localhost:3000/api/feedback \
  -H 'content-type: application/json' \
  -d '{"claim_id":"c123","feedback_type":"upvote"}'

# Status
curl "http://localhost:3000/api/claim/status?claim_id=c123"
```

## Important files to open
- `app/page.tsx`
- `components/Chat/Conversation.tsx`
- `app/api/claim/submit/route.ts`
=======
# GenAI_Truth-AI
>>>>>>> b8e26857f72a2295456d0a8c07d782be0f4bd0ad
