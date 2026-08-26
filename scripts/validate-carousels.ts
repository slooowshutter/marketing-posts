import { access, readFile, readdir } from "node:fs/promises"
import path from "node:path"

import { ZodError } from "zod"

import {
  carouselPostSchema,
  type CarouselPost,
  type CarouselVersion,
} from "../lib/carousels/schema"

const PUBLIC_DIR = path.join(process.cwd(), "public")

/**
 * Templates that are nothing but their photo. A slide on one of these with no
 * image renders a placeholder box — worth flagging, but the original IG Post
 * Lab sample is deliberately all placeholders, so it warns rather than fails.
 */
const PHOTO_ONLY_TEMPLATES = new Set([
  "cover-photo",
  "cover-serif-statement",
  "cover-annotated",
  "cover-type-pop",
  "cover-stat-chip",
  "cover-lower-third",
  "cover-blur-fit",
  "result-full",
  "macro-serif",
  "cta-photo",
])

/** Every image the post points at, slide content and wide artboards alike. */
async function missingAssets(post: CarouselPost) {
  const referenced = new Set<string>()

  for (const version of post.versions) {
    for (const slide of version.slides) {
      for (const image of Object.values(slide.content.images)) {
        referenced.add(image.src)
      }
    }
    for (const block of version.canvas?.blocks ?? []) {
      if (block.type === "image") referenced.add(block.src)
    }
  }

  const missing: string[] = []
  await Promise.all(
    [...referenced].map(async (src) => {
      try {
        await access(path.join(PUBLIC_DIR, src.replace(/^\//, "")))
      } catch {
        missing.push(src)
      }
    }),
  )

  return missing.sort()
}

function reviewNotes(version: CarouselVersion) {
  const notes = version.slides
    .filter(
      (slide) =>
        PHOTO_ONLY_TEMPLATES.has(slide.template) &&
        Object.keys(slide.content.images).length === 0,
    )
    .map(
      (slide) =>
        `slide renders an image placeholder: ${version.id}/${slide.id} (${slide.template})`,
    )

  if (version.canvas?.seams) {
    notes.push(
      `${version.id}: canvas.seams is on — the cut guides would ship in the PNGs`,
    )
  }

  return notes
}

async function main() {
  const directory = path.join(process.cwd(), "content", "carousels")
  const filenames = (await readdir(directory))
    .filter((filename) => filename.endsWith(".json"))
    .sort()

  let failures = 0
  let warnings = 0

  for (const filename of filenames) {
    try {
      const raw = await readFile(path.join(directory, filename), "utf8")
      const post = carouselPostSchema.parse(JSON.parse(raw))
      const expectedId = filename.replace(/\.json$/, "")

      if (post.id !== expectedId) {
        throw new Error(
          `id "${post.id}" must match filename "${expectedId}.json"`,
        )
      }

      const missing = await missingAssets(post)
      if (missing.length > 0) {
        throw new Error(
          missing.map((src) => `image not found in public/: ${src}`).join("\n  "),
        )
      }

      const slides = post.versions.reduce(
        (count, version) => count + version.slides.length,
        0,
      )
      const canvases = post.versions.filter((version) => version.canvas).length
      const artboards = canvases > 0 ? `, ${canvases} wide artboard(s)` : ""

      console.log(
        `✓ ${filename} — ${post.versions.length} version(s), ${slides} slide(s)${artboards}`,
      )

      for (const version of post.versions) {
        for (const note of reviewNotes(version)) {
          warnings += 1
          console.warn(`  ! ${note}`)
        }
      }
    } catch (error) {
      failures += 1
      console.error(`✗ ${filename}`)
      if (error instanceof ZodError) {
        for (const issue of error.issues) {
          console.error(`  ${issue.path.join(".") || "root"}: ${issue.message}`)
        }
      } else {
        console.error(
          `  ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }
  }

  if (filenames.length === 0) console.log("No carousel JSON files found.")
  if (warnings > 0) console.warn(`\n${warnings} warning(s) — not blocking.`)
  if (failures > 0) process.exitCode = 1
}

void main()
