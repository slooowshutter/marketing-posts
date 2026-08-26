import { z } from "zod"

export const TEMPLATE_KEYS = [
  "cover-photo",
  "cover-serif-statement",
  "cover-annotated",
  "cover-type-pop",
  "cover-stat-chip",
  "cover-lower-third",
  "cover-blur-fit",
  "editorial-collage",
  "annotated-ui",
  "prompt-annotated",
  "numbered-grid",
  "photo-grid-6",
  "before-after",
  "comparison",
  "macro-serif",
  "question-photos",
  "showcase-card",
  "statement",
  "problem-card",
  "use-dont-use",
  "steps-timeline",
  "checklist",
  "stat-big",
  "photo-pair-tilt",
  "arrow-flow",
  "result-full",
  "canvas-slice",
  "cta-end",
  "cta-strategy",
  "cta-scribble",
  "cta-testimonial",
  "cta-cream",
  "cta-photo",
] as const

export const reviewStatusSchema = z.enum([
  "draft",
  "approved",
  "changes-requested",
])

const localAssetPathSchema = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith("/") && !value.startsWith("//") && !value.includes(".."),
    "Image paths must be local public paths such as /carousels/post-id/cover.jpg",
  )

export const slideImageSchema = z.object({
  src: localAssetPathSchema,
  alt: z.string().min(1),
  position: z.string().min(1).optional(),
  /** Slots crop to fill by default; "contain" shows the whole frame. */
  fit: z.enum(["cover", "contain"]).default("cover"),
})

export const slideContentSchema = z.object({
  text: z.record(z.string(), z.string()).default({}),
  images: z.record(z.string(), slideImageSchema).default({}),
})

/* ═══════════════ wide artboard ("canvas slice") primitive ═══════════════
 *
 * One continuous composition, `slices * 1080` wide by 1350 tall, cut into
 * 4:5 slides. Coordinates are artboard pixels, origin top-left — a block at
 * x: 1020 with w: 400 straddles the seam between slide 1 and slide 2 and is
 * deliberately cut by the slide edge. See content/carousels/FORMATS.md.
 */

export const CANVAS_SLICE_W = 1080
export const CANVAS_SLICE_H = 1350

const canvasColorSchema = z.string().min(1)

const canvasBlockBaseShape = {
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  rotate: z.number().min(-90).max(90).optional(),
  opacity: z.number().min(0).max(1).optional(),
  z: z.number().int().optional(),
}

export const canvasImageBlockSchema = z.object({
  ...canvasBlockBaseShape,
  type: z.literal("image"),
  h: z.number().positive(),
  src: localAssetPathSchema,
  alt: z.string().min(1),
  fit: z.enum(["cover", "contain"]).default("cover"),
  position: z.string().min(1).optional(),
  radius: z.number().min(0).optional(),
  shadow: z.boolean().optional(),
  /** Zoom in on `position` — 1 fills the block, 3 crops to a detail. */
  scale: z.number().min(1).max(8).optional(),
  blur: z.number().min(0).max(80).optional(),
  grayscale: z.boolean().optional(),
})

export const canvasTextBlockSchema = z.object({
  ...canvasBlockBaseShape,
  type: z.literal("text"),
  value: z.string().min(1),
  size: z.number().positive(),
  font: z.enum(["sans", "serif", "mono", "hand"]).default("sans"),
  weight: z.number().int().min(100).max(900).optional(),
  color: canvasColorSchema.optional(),
  align: z.enum(["left", "center", "right"]).default("left"),
  lineHeight: z.number().positive().optional(),
  tracking: z.number().optional(),
  italic: z.boolean().optional(),
  uppercase: z.boolean().optional(),
})

export const canvasBoxBlockSchema = z.object({
  ...canvasBlockBaseShape,
  type: z.literal("box"),
  h: z.number().positive(),
  fill: canvasColorSchema.optional(),
  border: canvasColorSchema.optional(),
  borderWidth: z.number().min(0).optional(),
  radius: z.number().min(0).optional(),
})

export const canvasBlockSchema = z.discriminatedUnion("type", [
  canvasImageBlockSchema,
  canvasTextBlockSchema,
  canvasBoxBlockSchema,
])

export const carouselCanvasSchema = z.object({
  slices: z.number().int().min(2).max(12),
  background: canvasColorSchema.default("cream"),
  seams: z.boolean().default(false),
  blocks: z.array(canvasBlockSchema).min(1),
})

export const carouselSlideSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  template: z.enum(TEMPLATE_KEYS),
  content: slideContentSchema.default({ text: {}, images: {} }),
  /** Which 1080px column of the version canvas this slide shows. */
  slice: z.number().int().min(0).optional(),
  review: reviewStatusSchema.default("draft"),
})

export const carouselVersionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    label: z.string().min(1),
    review: reviewStatusSchema.default("draft"),
    canvas: carouselCanvasSchema.optional(),
    slides: z.array(carouselSlideSchema).min(2),
  })
  .superRefine((version, ctx) => {
    const sliceSlides = version.slides.filter(
      (slide) => slide.template === "canvas-slice",
    )

    if (sliceSlides.length > 0 && !version.canvas) {
      ctx.addIssue({
        code: "custom",
        path: ["canvas"],
        message:
          'a version using "canvas-slice" slides must define a "canvas"',
      })
      return
    }

    if (!version.canvas) return

    if (sliceSlides.length !== version.canvas.slices) {
      ctx.addIssue({
        code: "custom",
        path: ["slides"],
        message: `canvas.slices is ${version.canvas.slices} but the version has ${sliceSlides.length} canvas-slice slide(s) — they must match`,
      })
    }

    const seen = new Set<number>()
    version.slides.forEach((slide, index) => {
      if (slide.template !== "canvas-slice") return
      const slice = slide.slice ?? sliceSlides.indexOf(slide)

      if (slice >= version.canvas!.slices) {
        ctx.addIssue({
          code: "custom",
          path: ["slides", index, "slice"],
          message: `slice ${slice} is outside the canvas (0–${version.canvas!.slices - 1})`,
        })
        return
      }

      if (seen.has(slice)) {
        ctx.addIssue({
          code: "custom",
          path: ["slides", index, "slice"],
          message: `slice ${slice} is used by more than one slide`,
        })
      }
      seen.add(slice)
    })
  })

export const carouselPostSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  summary: z.string().min(1).optional(),
  caption: z.string().optional(),
  format: z
    .enum(["before-after", "multi-result", "canvas-slice", "classic-pack"])
    .optional(),
  platforms: z.array(z.enum(["instagram", "tiktok"])).default(["instagram"]),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  versions: z.array(carouselVersionSchema).min(1),
})

export type TemplateKey = (typeof TEMPLATE_KEYS)[number]
export type ReviewStatus = z.infer<typeof reviewStatusSchema>
export type SlideImage = z.infer<typeof slideImageSchema>
export type SlideContent = z.infer<typeof slideContentSchema>
export type CanvasBlock = z.infer<typeof canvasBlockSchema>
export type CanvasImageBlock = z.infer<typeof canvasImageBlockSchema>
export type CanvasTextBlock = z.infer<typeof canvasTextBlockSchema>
export type CanvasBoxBlock = z.infer<typeof canvasBoxBlockSchema>
export type CarouselCanvas = z.infer<typeof carouselCanvasSchema>
export type CarouselSlide = z.infer<typeof carouselSlideSchema>
export type CarouselVersion = z.infer<typeof carouselVersionSchema>
export type CarouselPost = z.infer<typeof carouselPostSchema>
