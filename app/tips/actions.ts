"use server"

import { randomUUID } from "node:crypto"
import { readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { TIPS_DIRECTORY } from "@/lib/tips/data"
import {
  reviewStatusSchema,
  tipPostSchema,
  type ReviewStatus,
} from "@/lib/tips/schema"

const updateReviewInputSchema = z.object({
  postId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  versionId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  slideId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  review: reviewStatusSchema,
})

export async function updateTipReview(input: {
  postId: string
  versionId: string
  slideId?: string
  review: ReviewStatus
}) {
  const parsedInput = updateReviewInputSchema.parse(input)
  const filepath = path.join(TIPS_DIRECTORY, `${parsedInput.postId}.json`)
  const raw = await readFile(filepath, "utf8")
  const post = tipPostSchema.parse(JSON.parse(raw))
  const version = post.versions.find(
    (candidate) => candidate.id === parsedInput.versionId,
  )

  if (!version) throw new Error("Tip version not found")

  if (parsedInput.slideId) {
    const slide = version.slides.find(
      (candidate) => candidate.id === parsedInput.slideId,
    )
    if (!slide) throw new Error("Tip slide not found")
    slide.review = parsedInput.review
  } else {
    version.review = parsedInput.review
  }

  post.updatedAt = new Date().toISOString()

  const temporaryPath = `${filepath}.${randomUUID()}.tmp`
  await writeFile(temporaryPath, `${JSON.stringify(post, null, 2)}\n`, "utf8")
  await rename(temporaryPath, filepath)

  revalidatePath("/tips")
  revalidatePath(`/tips/posts/${post.id}`)

  return { updatedAt: post.updatedAt }
}
