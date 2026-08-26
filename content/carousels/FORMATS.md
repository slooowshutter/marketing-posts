# Post formats

Not every workflow post is the same shape. Pick the format from what the
workflow actually proves, then build it. Authoring rules live in
`README.md`; this file only decides which shape to reach for.

## The four types

| Format | Use it when | Slides | Templates | Images per slide |
|---|---|---|---|---|
| **Before / after** | One input → one output. The change *is* the story. | 2–4 | `before-after`, `comparison`, `cover-blur-fit` | 2 (the pair) |
| **Multi-result** | One workflow, many outputs. Range is the story. | 4–6 (5 is the default) | `result-full`, `cover-blur-fit`, any cover, any CTA | 1 full result |
| **Canvas slice** | The post is one continuous designed strip. Swipe is the story. | 6–10 | `canvas-slice` + an optional CTA slide | mixed sizes, set on the artboard |
| **Classic pack** | There is something to teach around the result. | 3–7 | existing cover / content / CTA templates | whatever the template asks for |

## Four rules

1. **8:1 is a canvas, not a default.** Reach for `canvas-slice` only when the
   slides are cuts of one composition. A before/after wants 2 slides. A
   result pack wants about 5. Ten slices of the same cover template is ten
   posters, not an artboard.
2. **One result per slide, whole.** In a multi-result pack every slide
   carries exactly one output at full width and full frame. No 3+2 grids, no
   five-up collages, no contain-fitting a 4:3 into the middle of a tall cream
   slide. If a crop is unavoidable, nudge it toward the stamp — clipped stamp
   type is the failure everyone sees.
3. **Cut on the canvas, never on the result.** Inside `canvas-slice`,
   headlines and photos crossing a slide edge are the point. Keep whole
   *units of meaning* — a stamp roundel, a price, a name — inside one slide;
   run sentences and photo bodies straight through the seam.
4. **The closer asks for a comment.** `cta-end`, `cta-scribble`,
   `cta-strategy` or `cta-photo`, all built around "comment blend". Never a
   large URL on the slide, never a type-only beige card, never a "not posted"
   footer baked into the graphic.

## Authoring a wide artboard

A version gains a `canvas`; its `canvas-slice` slides are windows onto it.

```json
"canvas": {
  "slices": 8,
  "background": "cream",
  "seams": false,
  "blocks": [
    { "type": "image", "x": 300, "y": 520, "w": 1200, "h": 900,
      "src": "/carousels/stamp-notes/067-arc-de-triomphe.jpg",
      "alt": "…", "fit": "contain", "rotate": -1.5, "shadow": true },
    { "type": "text", "x": 76, "y": 196, "w": 1000, "size": 138,
      "value": "one photo in.", "font": "sans", "color": "ink" }
  ]
}
```

Three things to know:

1. **The artboard is `slices * 1080` wide and 1350 tall.** Coordinates are
   artboard pixels from the top-left, so a block at `x: 1020` straddles the
   seam between slide 1 and slide 2. Seams fall at every multiple of 1080.
2. **Slides claim columns in order.** One `canvas-slice` slide per slice,
   left to right; set `"slice": 3` on a slide only to jump out of order.
   `npm run carousel:validate` fails if the counts disagree.
3. **Check the cuts on the review page.** A version with a canvas gets an
   "artboard, uncut" strip above the slides: every slide edge to edge at
   whatever scale fits, with the cut lines marked. Use it to confirm nothing
   you need whole — a stamp roundel, a number, a name — lands on one.
   (`"seams": true` draws the same guides into the artboard itself, but they
   then ship in the exported PNGs, so prefer the review strip.)

Blocks are `image` (`fit`, `position`, `rotate`, `radius`, `shadow`, `blur`,
`grayscale`), `text` (`size`, `font` sans/serif/mono/hand, `weight`, `align`,
`lineHeight`, `tracking`, `italic`, `uppercase`) and `box` (`fill`, `border`,
`radius`). Colours take palette tokens — `ink`, `cream`, `paper`, `orange`,
`stone`, with optional alpha as `ink/40` — or any raw CSS colour. Later
blocks paint over earlier ones; `z` overrides that.
