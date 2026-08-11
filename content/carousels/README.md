# Carousel authoring contract

This directory is the agent-facing input to the BlendAI Carousel Studio. Create
one `<post-id>.json` file per social post. The filename and top-level `id`
must match and must use lowercase kebab-case.

Start by copying `from-chaos-to-system.json`.

## Required shape

```json
{
  "id": "post-id",
  "title": "Human-readable title",
  "summary": "What the post is trying to communicate.",
  "caption": "Optional social caption.",
  "platforms": ["instagram", "tiktok"],
  "createdAt": "2026-08-11T10:00:00.000Z",
  "updatedAt": "2026-08-11T10:00:00.000Z",
  "versions": [
    {
      "id": "version-a",
      "label": "Version A",
      "review": "draft",
      "slides": [
        {
          "id": "hook",
          "template": "cover-photo",
          "review": "draft",
          "content": {
            "text": {
              "Stop prompting.": "Your replacement line",
              "directing.": "Your emphasized line"
            },
            "images": {
              "COVER PHOTO · FULL BLEED": {
                "src": "/carousels/post-id/cover.jpg",
                "alt": "Useful description of the image",
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

A version needs at least two slides. Use the same slide `id` across versions
when the slides have the same role (`hook`, `problem`, `proof`, `closer`).

## Choose a template

Open `/carousels/templates` or inspect
`components/carousels/templates.tsx`. Valid template IDs are:

- Covers: `cover-photo`, `cover-serif-statement`, `cover-annotated`,
  `cover-type-pop`, `cover-stat-chip`, `cover-lower-third`
- Content: `editorial-collage`, `annotated-ui`, `prompt-annotated`,
  `numbered-grid`, `photo-grid-6`, `before-after`, `comparison`,
  `macro-serif`, `question-photos`, `showcase-card`, `statement`,
  `problem-card`, `use-dont-use`, `steps-timeline`, `checklist`,
  `stat-big`, `photo-pair-tilt`, `arrow-flow`
- CTAs: `cta-end`, `cta-strategy`, `cta-scribble`,
  `cta-testimonial`, `cta-cream`, `cta-photo`

## Replace copy

`content.text` is a map from the exact visible default phrase to its
replacement. Whitespace is normalized, but spelling and punctuation must match.

```json
"text": {
  "Stop prompting.": "Stop collecting prompts.",
  "directing.": "Build a system."
}
```

Only include phrases that need to change. If a key does not match, the original
phrase remains visible. Preview every slide before handing it over for review.

## Replace images

Image keys are the labels visible in placeholder boxes, for example
`COVER PHOTO · FULL BLEED`, `BEFORE · PHONE SHOT`, or `SCENE A`.

1. Put the image in `public/carousels/<post-id>/`.
2. Reference it with a root-relative path beginning with `/carousels/`.
3. Add meaningful `alt` text.
4. Use optional CSS `object-position` syntax in `position` when the crop
   needs adjustment.

Remote URLs and parent-directory paths are intentionally rejected. Keeping
assets local makes previews and exports reliable on the home Mac.

## Review-state rules

The app writes `review` and `updatedAt` back to this file.

- Never overwrite an approved version.
- If copy or visuals must change after review, create a new version.
- Preserve slide review values when changing unrelated metadata.
- Publishing automation must only use a version whose `review` is
  `approved`.

## Before sharing the URL

```bash
npm run carousel:validate
```

Then open `/carousels/posts/<post-id>` and check every slide at least once.
