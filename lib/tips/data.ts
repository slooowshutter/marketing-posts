import "server-only"

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

import { connection } from "next/server"
import { ZodError } from "zod"

import { tipPostSchema, type TipPost } from "./schema"

export const TIPS_DIRECTORY = path.join(process.cwd(), "content", "tips")

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export type TipIndex = {
  posts: TipPost[]
  errors: { file: string; message: string }[]
}

export class TipFileError extends Error {
  constructor(
    public readonly file: string,
    message: string,
  ) {
    super(message)
    this.name = "TipFileError"
  }
}

function formatZodError(error: ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ")
}

async function parseTipFile(filename: string): Promise<TipPost> {
  const filepath = path.join(TIPS_DIRECTORY, filename)

  try {
    const raw = await readFile(filepath, "utf8")
    const post = tipPostSchema.parse(JSON.parse(raw))
    const expectedId = filename.replace(/\.json$/, "")

    if (post.id !== expectedId) {
      throw new TipFileError(
        filename,
        `id must match the filename (${expectedId})`,
      )
    }

    return post
  } catch (error) {
    if (error instanceof TipFileError) throw error
    if (error instanceof ZodError) {
      throw new TipFileError(filename, formatZodError(error))
    }
    if (error instanceof SyntaxError) {
      throw new TipFileError(filename, `Invalid JSON: ${error.message}`)
    }
    throw error
  }
}

export async function getTipIndex(): Promise<TipIndex> {
  await connection()

  const filenames = (await readdir(TIPS_DIRECTORY))
    .filter((filename) => filename.endsWith(".json"))
    .sort()

  const settled = await Promise.allSettled(filenames.map(parseTipFile))
  const posts: TipPost[] = []
  const errors: TipIndex["errors"] = []

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

export async function getTipPost(slug: string) {
  await connection()
  if (!SAFE_SLUG.test(slug)) return null

  try {
    return await parseTipFile(`${slug}.json`)
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
