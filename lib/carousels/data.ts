import "server-only"

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

import { connection } from "next/server"
import { ZodError } from "zod"

import { carouselPostSchema, type CarouselPost } from "./schema"

export const CAROUSELS_DIRECTORY = path.join(
  process.cwd(),
  "content",
  "carousels",
)

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export type CarouselIndex = {
  posts: CarouselPost[]
  errors: { file: string; message: string }[]
}

export class CarouselFileError extends Error {
  constructor(
    public readonly file: string,
    message: string,
  ) {
    super(message)
    this.name = "CarouselFileError"
  }
}

function formatZodError(error: ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ")
}

async function parseCarouselFile(filename: string): Promise<CarouselPost> {
  const filepath = path.join(CAROUSELS_DIRECTORY, filename)

  try {
    const raw = await readFile(filepath, "utf8")
    const post = carouselPostSchema.parse(JSON.parse(raw))
    const expectedId = filename.replace(/\.json$/, "")

    if (post.id !== expectedId) {
      throw new CarouselFileError(
        filename,
        `id must match the filename (${expectedId})`,
      )
    }

    return post
  } catch (error) {
    if (error instanceof CarouselFileError) throw error
    if (error instanceof ZodError) {
      throw new CarouselFileError(filename, formatZodError(error))
    }
    if (error instanceof SyntaxError) {
      throw new CarouselFileError(filename, `Invalid JSON: ${error.message}`)
    }
    throw error
  }
}

export async function getCarouselIndex(): Promise<CarouselIndex> {
  await connection()

  const filenames = (await readdir(CAROUSELS_DIRECTORY))
    .filter((filename) => filename.endsWith(".json"))
    .sort()

  const settled = await Promise.allSettled(filenames.map(parseCarouselFile))
  const posts: CarouselPost[] = []
  const errors: CarouselIndex["errors"] = []

  settled.forEach((result, index) => {
    if (result.status === "fulfilled") {
      posts.push(result.value)
      return
    }

    const reason = result.reason
    errors.push({
      file: filenames[index],
      message: reason instanceof Error ? reason.message : String(reason),
    })
  })

  posts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return { posts, errors }
}

export async function getCarouselPost(slug: string) {
  await connection()
  if (!SAFE_SLUG.test(slug)) return null

  try {
    return await parseCarouselFile(`${slug}.json`)
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null
    }
    throw error
  }
}
