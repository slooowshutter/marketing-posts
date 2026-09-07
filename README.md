# Charlo Computer

Charlo Computer is a private, file-backed dashboard for work created by agents
on the home Mac. Projects: **BlendAI Carousels** (Blend product posts) and
**Tip templates** (Social Ops tip brands). Agents write JSON, the app renders
1080 × 1350 slides, and Marc reviews from a browser.

No database or external image-generation API is required. The filesystem is the
database.

## What works

- Dashboard sidebar with BlendAI Carousels and Tip templates
- All 30 original Blend IG Lab layouts: 6 covers, 18 content slides, 6 CTAs
- Tip-channel A1–A10 systems (cover / before-after / long prompt / CTA) plus B/C stubs
- One dynamic URL per Blend post: `/carousels/posts/<post-id>`
- One dynamic URL per tip post: `/tips/posts/<post-id>`
- Tip gallery at `/tips/templates`
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
npm run tip:validate
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

## Create a tip post

Read [content/tips/README.md](content/tips/README.md), then copy
`content/tips/polaroid-warm-swap.json` (A1) or
`content/tips/terminal-stack-prompt.json` (A4) to a new slug.

Place image assets under `public/tips/<post-id>/`. Put long prompt copy in
`content.prompt` on the image+prompt slide.

```bash
npm run tip:validate
open http://localhost:3000/tips/posts/polaroid-warm-swap
open http://localhost:3000/tips/templates
```

Do not reuse Blend cream/brown studio skins on tip brands.

## Project map

```text
app/carousels/                  Blend routes, review action, scoped palette
components/carousels/           Original Blend templates, previews, export UI
content/carousels/              One JSON file per Blend post
lib/carousels/                  Zod schema and filesystem loader
public/carousels/<post-id>/     Images used by that Blend post
scripts/validate-carousels.ts   Blend validation command
app/tips/                       Tip routes and review action
components/tips/                Tip systems A1–A10, B/C stubs, gallery
content/tips/                   One JSON file per tip post
lib/tips/                       Tip schema, systems catalog, loader
public/tips/<post-id>/          Images used by that tip post
scripts/validate-tips.ts        Tip validation command
```

The Blend template source is [components/carousels/templates.tsx](components/carousels/templates.tsx).
Do not change it for ordinary Blend posts; use JSON overrides.

The tip template source is [components/tips/](components/tips/).
Do not change it for ordinary tip posts; use JSON overrides.
