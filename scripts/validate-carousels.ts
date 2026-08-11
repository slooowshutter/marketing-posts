import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

import { ZodError } from "zod"

import { carouselPostSchema } from "../lib/carousels/schema"

async function main() {
  const directory = path.join(process.cwd(), "content", "carousels")
  const filenames = (await readdir(directory))
    .filter((filename) => filename.endsWith(".json"))
    .sort()

  let failures = 0

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

      const slides = post.versions.reduce(
        (count, version) => count + version.slides.length,
        0,
      )
      console.log(
        `✓ ${filename} — ${post.versions.length} version(s), ${slides} slide(s)`,
      )
    } catch (error) {
      failures += 1
      console.error(`✗ ${filename}`)
      if (error instanceof ZodError) {
        for (const issue of error.issues) {
          console.error(
            `  ${issue.path.join(".") || "root"}: ${issue.message}`,
          )
        }
      } else {
        console.error(
          `  ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }
  }

  if (filenames.length === 0) console.log("No carousel JSON files found.")
  if (failures > 0) process.exitCode = 1
}

void main()
