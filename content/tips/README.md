# Tip channel authoring contract

This directory is the agent-facing input for **Social Ops tip brands**
(Prompt Stash, Edit Nudge, Look Recipe, Shot Swap, Prompt Kitchen). It mirrors
Blend carousels (`content/carousels`) but is a **separate** template family.

Do not use Blend cream / brown / orange studio skins on tip posts. Do not edit
`components/carousels/templates.tsx` for this work. Do not create a React route
per post.

Start by copying `polaroid-warm-swap.json` (A1) or `terminal-stack-prompt.json`
(A4).

## Required shape

```json
{
  "id": "post-id",
  "title": "Human-readable title",
  "system": "inset-polaroid-ba",
  "summary": "What the post is trying to communicate.",
  "caption": "Optional social caption.",
  "platforms": ["instagram"],
  "createdAt": "2026-09-07T12:00:00.000Z",
  "updatedAt": "2026-09-07T12:00:00.000Z",
  "versions": [
    {
      "id": "version-a",
      "label": "Version A",
      "review": "draft",
      "slides": [
        {
          "id": "cover",
          "template": "inset-polaroid-ba-cover",
          "review": "draft",
          "content": {
            "text": { "Warm it up.": "Your cover line" },
            "images": {
              "RESULT · FULL BLEED": {
                "src": "/tips/post-id/result.png",
                "alt": "Useful description",
                "position": "50% 35%"
              }
            }
          }
        }
      ]
    }
  ]
}
```

The filename and top-level `id` must match (lowercase kebab-case). `system`
must be a registered tip system id. Every slide `template` must belong to that
system.

A version needs at least a **cover** and a **CTA**. Ship the full set:

1. `cover`
2. `content-ba` (and optional `content-ba-2`, `content-ba-3`, …)
3. `content-prompt` (and optional `content-prompt-2`, …)
4. `cta`

Middle content slides reuse the same visual system. Extra stills keep the same
template key and change only the slide `id`.

## Template IDs

`{system-id}-{slot}` where slot is `cover` | `content-ba` | `content-prompt` | `cta`.

A-band (ready for fill):

| ID | Name | CTA keyword |
| --- | --- | --- |
| `inset-polaroid-ba` | Inset Polaroid BA | PROMPT |
| `split-halo` | Split Halo | LOOK |
| `magazine-cover` | Magazine Cover | RECIPE |
| `terminal-prompt` | Terminal Prompt | STACK |
| `sticky-note-ba` | Sticky Note BA | TIP |
| `glass-card-stack` | Glass Card Stack | STASH |
| `film-strip` | Film Strip | FRAME |
| `bold-stamp` | Bold Stamp | NUDGE |
| `soft-gradient-ribbon` | Soft Gradient Ribbon | LOOK |
| `grid-hero` | Grid Hero | GRID |

B and C systems are registered stubs with the same four slots. Hold them until
Marc picks brands. Full gallery: `/tips/templates`.

## Image keys

Use these labels unless a slide is a grid cover:

- `RESULT · FULL BLEED` — cover, BA result, most CTAs
- `ORIGINAL · INSET` — the before/source still
- `AI STILL` — prompt-slide still
- `GRID A` / `GRID B` / `GRID C` — Grid Hero cover (fourth cell is the “?” tease)

1. Put the file in `public/tips/<post-id>/`.
2. Reference it with a root-relative path beginning with `/tips/`.
3. Add meaningful `alt` text.
4. Optional CSS `object-position` in `position`.

Remote URLs and `..` paths are rejected.

## Before/after inset

`content.inset` is `br` | `bl` | `tr` | `tl`. Default `br`. Result is always
full-bleed; the original sits in the inset.

## Long prompt

Do **not** stuff a long prompt into `content.text` phrase replacement.

Set `content.prompt` on the `content-prompt` slide (multi-paragraph string).
`content.text.PROMPT` also works. The panel auto-fits down to a readable size,
then **scrolls**. It wraps on word boundaries and never ellipsizes mid-word.

## Replace other copy

`content.text` maps the exact visible default phrase to its replacement.
Whitespace is normalized; spelling must match. Only include phrases that need
to change.

A1 cover default: `Warm it up.`
A4 cover default: `$ stack --look`
A2 cover default: `GLOW`

Preview every slide at `/tips/posts/<post-id>` before review.

## Review-state rules

The app writes `review` and `updatedAt` back to this file.

- Never overwrite an approved version.
- If copy or visuals must change after review, create a new version.
- Preserve slide review values when changing unrelated metadata.
- Publishing automation must only use a version whose `review` is `approved`.

## Before sharing the URL

```bash
npm run tip:validate
```

Then open `/tips/posts/<post-id>` and check every slide, especially the prompt
panel with a long paste.
