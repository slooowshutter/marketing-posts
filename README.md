# Charlo Computer

Charlo Computer is a private, file-backed dashboard for work created by agents
on the home Mac. The first project is **BlendAI Carousels**: agents write JSON,
the app renders the original BlendAI Instagram templates, and Marc reviews and
exports the result from a browser.

No database or external image-generation API is required. The filesystem is the
database.

## What works

- Dashboard sidebar with a BlendAI Carousels collection
- All 30 original IG Lab layouts: 6 covers, 18 content slides, 6 CTAs
- One dynamic URL per post: `/carousels/posts/<post-id>`
- Multiple creative versions in one JSON file
- Runtime validation with useful errors
- Text and local-image replacement without editing React
- Version-level and slide-level approval / changes-requested states
- Native 1080 × 1350 PNG export and whole-version ZIP export
- New JSON files appear without rebuilding the production app

## Start locally

```bash
npm install
npm run carousel:validate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For another device on the same network:

```bash
npm run dev:network
```

For the always-on home Mac:

```bash
npm run build
npm run start:network
```

The production server uses port 3000 unless `PORT` is set.

## Private Tailscale URL

Run the app on the home Mac first, then expose that local port only to the
tailnet:

```bash
tailscale serve --bg 3000
tailscale serve status
```

Tailscale prints the private `https://<device>.<tailnet>.ts.net` URL. Keep this
as **Serve**, not Funnel: Funnel is public, while Serve follows the tailnet
access policy. To remove the proxy:

```bash
tailscale serve off
```

See the official [Tailscale Serve examples](https://tailscale.com/docs/reference/examples/serve).
Installing the production server as a login/background service should be done
on the home Mac, where its final checkout path and Node installation are known.

## Create a carousel

Read [content/carousels/README.md](content/carousels/README.md), then copy
`content/carousels/from-chaos-to-system.json` to a new slug:

```text
content/carousels/why-agents-need-memory.json
                       └───────────────┘
                       id must be identical
```

Place image assets under:

```text
public/carousels/why-agents-need-memory/
```

Validate and open:

```bash
npm run carousel:validate
open http://localhost:3000/carousels/posts/why-agents-need-memory
```

The running production app reads carousel files per request, so a new or edited
post does not require `next build` or a server restart.

## Project map

```text
app/carousels/                  Routes, review action, scoped palette
components/carousels/           Original templates, previews, export UI
content/carousels/              One JSON file per post
lib/carousels/                  Zod schema and filesystem loader
public/carousels/<post-id>/      Images used by that post
scripts/validate-carousels.ts   Agent/CI validation command
```

The template source is [components/carousels/templates.tsx](components/carousels/templates.tsx).
Do not change it for ordinary posts; use JSON overrides.
