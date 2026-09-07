import { z } from "zod"

import {
  INSET_POSITIONS,
  TIP_SYSTEMS_BY_ID,
  TIP_TEMPLATE_KEYS,
  parseTipTemplateKey,
} from "./systems"

export const reviewStatusSchema = z.enum([
  "draft",
  "approved",
  "changes-requested",
])

const localAssetPathSchema = z
  .string()
  .min(1)
  .refine(
    (value) =>
      value.startsWith("/") && !value.startsWith("//") && !value.includes(".."),
    "Image paths must be local public paths such as /tips/post-id/result.png",
  )

export const slideImageSchema = z.object({
  src: localAssetPathSchema,
  alt: z.string().min(1),
  position: z.string().min(1).optional(),
})

export const tipSlideContentSchema = z.object({
  text: z.record(z.string(), z.string()).default({}),
  images: z.record(z.string(), slideImageSchema).default({}),
  prompt: z.string().optional(),
  inset: z.enum(INSET_POSITIONS).default("br"),
})

export const tipSlideSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  template: z.enum(TIP_TEMPLATE_KEYS),
  content: tipSlideContentSchema.default({
    text: {},
    images: {},
    inset: "br",
  }),
  review: reviewStatusSchema.default("draft"),
})

export const tipVersionSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  label: z.string().min(1),
  review: reviewStatusSchema.default("draft"),
  slides: z.array(tipSlideSchema).min(2),
})

export const tipPostSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    system: z.string().min(1),
    summary: z.string().min(1).optional(),
    caption: z.string().optional(),
    platforms: z.array(z.enum(["instagram", "tiktok"])).default(["instagram"]),
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
    versions: z.array(tipVersionSchema).min(1),
  })
  .superRefine((post, ctx) => {
    if (!TIP_SYSTEMS_BY_ID[post.system]) {
      ctx.addIssue({
        code: "custom",
        path: ["system"],
        message: `Unknown tip system "${post.system}"`,
      })
    }

    post.versions.forEach((version, versionIndex) => {
      version.slides.forEach((slide, slideIndex) => {
        const parsed = parseTipTemplateKey(slide.template)
        if (!parsed) return
        if (parsed.systemId !== post.system) {
          ctx.addIssue({
            code: "custom",
            path: ["versions", versionIndex, "slides", slideIndex, "template"],
            message: `template "${slide.template}" does not belong to system "${post.system}"`,
          })
        }
      })
    })
  })

export type ReviewStatus = z.infer<typeof reviewStatusSchema>
export type SlideImage = z.infer<typeof slideImageSchema>
export type TipSlideContent = z.infer<typeof tipSlideContentSchema>
export type TipSlide = z.infer<typeof tipSlideSchema>
export type TipVersion = z.infer<typeof tipVersionSchema>
export type TipPost = z.infer<typeof tipPostSchema>
export type InsetPosition = (typeof INSET_POSITIONS)[number]
