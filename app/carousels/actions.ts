"use server"

import { randomUUID } from "node:crypto"
import { readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { CAROUSELS_DIRECTORY } from "@/lib/carousels/data"
import {
  carouselPostSchema,
  reviewStatusSchema,
  type ReviewStatus,
} from "@/lib/carousels/schema"

const updateReviewInputSchema = z.object({
  postId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  versionId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  slideId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  review: reviewStatusSchema,
})

export async function updateCarouselReview(input: {
  postId: string
  versionId: string
  slideId?: string
  review: ReviewStatus
}) {
  const parsedInput = updateReviewInputSchema.parse(input)
  const filepath = path.join(
    CAROUSELS_DIRECTORY,
    `${parsedInput.postId}.json`,
  )
  const raw = await readFile(filepath, "utf8")
  const post = carouselPostSchema.parse(JSON.parse(raw))
  const version = post.versions.find(
    (candidate) => candidate.id === parsedInput.versionId,
  )

  if (!version) throw new Error("Carousel version not found")

  if (parsedInput.slideId) {
    const slide = version.slides.find(
      (candidate) => candidate.id === parsedInput.slideId,
    )
    if (!slide) throw new Error("Carousel slide not found")
    slide.review = parsedInput.review
  } else {
    version.review = parsedInput.review
  }

  post.updatedAt = new Date().toISOString()

  const temporaryPath = `${filepath}.${randomUUID()}.tmp`
  await writeFile(temporaryPath, `${JSON.stringify(post, null, 2)}\n`, "utf8")
  await rename(temporaryPath, filepath)

  revalidatePath("/carousels")
  revalidatePath(`/carousels/posts/${post.id}`)

  return { updatedAt: post.updatedAt }
}
