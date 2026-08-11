import { z } from "zod"

export const TEMPLATE_KEYS = [
  "cover-photo",
  "cover-serif-statement",
  "cover-annotated",
  "cover-type-pop",
  "cover-stat-chip",
  "cover-lower-third",
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
})

export const slideContentSchema = z.object({
  text: z.record(z.string(), z.string()).default({}),
  images: z.record(z.string(), slideImageSchema).default({}),
})

export const carouselSlideSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  template: z.enum(TEMPLATE_KEYS),
  content: slideContentSchema.default({ text: {}, images: {} }),
  review: reviewStatusSchema.default("draft"),
})

export const carouselVersionSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  label: z.string().min(1),
  review: reviewStatusSchema.default("draft"),
  slides: z.array(carouselSlideSchema).min(2),
})

export const carouselPostSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  summary: z.string().min(1).optional(),
  caption: z.string().optional(),
  platforms: z.array(z.enum(["instagram", "tiktok"])).default(["instagram"]),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  versions: z.array(carouselVersionSchema).min(1),
})

export type TemplateKey = (typeof TEMPLATE_KEYS)[number]
export type ReviewStatus = z.infer<typeof reviewStatusSchema>
export type SlideImage = z.infer<typeof slideImageSchema>
export type SlideContent = z.infer<typeof slideContentSchema>
export type CarouselSlide = z.infer<typeof carouselSlideSchema>
export type CarouselVersion = z.infer<typeof carouselVersionSchema>
export type CarouselPost = z.infer<typeof carouselPostSchema>
