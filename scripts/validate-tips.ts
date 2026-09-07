import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

import { ZodError } from "zod"

import { tipPostSchema } from "../lib/tips/schema"
import {
  TIP_SLOT_KEYS,
  TIP_SYSTEMS,
  parseTipTemplateKey,
  slotFromSlideId,
  tipTemplateKey,
} from "../lib/tips/systems"

function assertCatalog() {
  const ids = new Set<string>()
  for (const system of TIP_SYSTEMS) {
    if (ids.has(system.id)) {
      throw new Error(`Duplicate tip system id "${system.id}"`)
    }
    ids.add(system.id)

    for (const slot of TIP_SLOT_KEYS) {
      const key = tipTemplateKey(system.id, slot)
      const parsed = parseTipTemplateKey(key)
      if (!parsed || parsed.systemId !== system.id || parsed.slot !== slot) {
        throw new Error(`Template key "${key}" does not round-trip`)
      }
    }
  }

  const readyA = TIP_SYSTEMS.filter(
    (system) => system.band === "A" && system.status === "ready",
  )
  if (readyA.length !== 10) {
    throw new Error(`Expected 10 ready A-band systems, found ${readyA.length}`)
  }

  const stubs = TIP_SYSTEMS.filter((system) => system.status === "stub")
  if (stubs.length !== 20) {
    throw new Error(`Expected 20 B/C stub systems, found ${stubs.length}`)
  }

  console.log(
    `✓ catalog — ${TIP_SYSTEMS.length} systems, ${readyA.length} A-band ready, ${stubs.length} stubs`,
  )
}

async function main() {
  let failures = 0

  try {
    assertCatalog()
  } catch (error) {
    failures += 1
    console.error("✗ catalog")
    console.error(`  ${error instanceof Error ? error.message : String(error)}`)
  }

  const directory = path.join(process.cwd(), "content", "tips")
  const filenames = (await readdir(directory))
    .filter((filename) => filename.endsWith(".json"))
    .sort()

  for (const filename of filenames) {
    try {
      const raw = await readFile(path.join(directory, filename), "utf8")
      const post = tipPostSchema.parse(JSON.parse(raw))
      const expectedId = filename.replace(/\.json$/, "")

      if (post.id !== expectedId) {
        throw new Error(
          `id "${post.id}" must match filename "${expectedId}.json"`,
        )
      }

      for (const version of post.versions) {
        const slots = new Set<string>()
        for (const slide of version.slides) {
          const parsed = parseTipTemplateKey(slide.template)
          if (!parsed) {
            throw new Error(`Unknown template "${slide.template}"`)
          }
          slots.add(parsed.slot)
          const fromId = slotFromSlideId(slide.id)
          if (fromId && fromId !== parsed.slot) {
            throw new Error(
              `slide "${slide.id}" implies slot ${fromId} but template is ${parsed.slot}`,
            )
          }
        }
        if (!slots.has("cover") || !slots.has("cta")) {
          throw new Error(
            `version "${version.id}" needs at least a cover and a CTA slide`,
          )
        }
      }

      const promptChars = post.versions.flatMap((version) =>
        version.slides.map((slide) => slide.content.prompt?.length ?? 0),
      )
      const longestPrompt = Math.max(0, ...promptChars)

      if (post.id === "terminal-stack-prompt" && longestPrompt < 1500) {
        throw new Error(
          "A4 sample must include a long prompt (>= 1500 characters)",
        )
      }

      const slides = post.versions.reduce(
        (count, version) => count + version.slides.length,
        0,
      )
      console.log(
        `✓ ${filename} — system ${post.system}, ${post.versions.length} version(s), ${slides} slide(s), longest prompt ${longestPrompt} chars`,
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

  if (filenames.length === 0) console.log("No tip JSON files found.")
  if (failures > 0) process.exitCode = 1
}

void main()
