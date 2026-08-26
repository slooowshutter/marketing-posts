# Carousel authoring contract

This directory is the agent-facing input to the BlendAI Carousel Studio. Create
one `<post-id>.json` file per social post. The filename and top-level `id`
must match and must use lowercase kebab-case.

Read [FORMATS.md](./FORMATS.md) first — it decides which of the four post
shapes you are building. Then copy the nearest existing post:
`stamp-notes-results.json` for a result pack, `stamp-notes-canvas.json` for a
wide artboard, `stamp-notes-before-after.json` for a pair.

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
  `cover-type-pop`, `cover-stat-chip`, `cover-lower-third`,
  `cover-blur-fit`
- Content: `editorial-collage`, `annotated-ui`, `prompt-annotated`,
  `numbered-grid`, `photo-grid-6`, `before-after`, `comparison`,
  `macro-serif`, `question-photos`, `showcase-card`, `statement`,
  `problem-card`, `use-dont-use`, `steps-timeline`, `checklist`,
  `stat-big`, `photo-pair-tilt`, `arrow-flow`, `result-full`,
  `canvas-slice`
- CTAs: `cta-end`, `cta-strategy`, `cta-scribble`,
  `cta-testimonial`, `cta-cream`, `cta-photo`

Three of these are newer than the rest:

- `cover-blur-fit` shows the whole photo inside the 4:5 frame and fills the
  bands above and below with the same shot, cover-fit and blurred. Use it
  when the image must not be cropped.
- `result-full` puts one uncropped result per slide on ink, with a place
  name, a note and an index. This is the body of a multi-result pack.
- `canvas-slice` is a window onto the version's wide artboard. It is the
  only template whose content lives on the version rather than the slide —
  see [FORMATS.md](./FORMATS.md).

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
5. Set `"fit": "contain"` when the whole frame has to survive. Slots crop to
   fill by default, which will clip a 4:3 result placed in a tall slot. If
   you do crop one of the stamped sheets, nudge `position` toward the stamp
   (`"90% 50%"`) so the roundel stays whole.

Remote URLs and parent-directory paths are intentionally rejected. Keeping
assets local makes previews and exports reliable on the home Mac.

## Wide artboards

A version may carry a `canvas`; its `canvas-slice` slides are 1080-wide
windows onto it, left to right. The artboard is `slices * 1080` wide and
1350 tall. [FORMATS.md](./FORMATS.md) has the block reference and the three
rules that matter.

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
