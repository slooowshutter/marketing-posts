<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## BlendAI Carousel Studio

When creating or editing a social carousel, read
`content/carousels/README.md` first.

- Create content in `content/carousels/<post-id>.json`; do not create a new
  React route for each post.
- Put post assets in `public/carousels/<post-id>/`.
- Do not edit `components/carousels/templates.tsx` for ordinary content work.
- Run `npm run carousel:validate` before sharing a review URL.
- Preserve review states written by the dashboard. Never replace an approved
  version; add a new version instead.
- Publishing automation may only use a version marked `approved`.

## Tip channel templates

When creating or editing a Social Ops tip carousel, read
`content/tips/README.md` first.

- Create content in `content/tips/<post-id>.json`; do not create a new
  React route for each post.
- Put post assets in `public/tips/<post-id>/`.
- Do not edit `components/tips/` for ordinary content work.
- Do not apply Blend cream / brown / orange studio skins to tip brands.
- Run `npm run tip:validate` before sharing a review URL.
- Preserve review states written by the dashboard. Never replace an approved
  version; add a new version instead.
- Publishing automation may only use a version marked `approved`.
- Prompt text goes in `content.prompt` (multi-paragraph). The panel wraps and
  scrolls; it must never clip mid-word.
