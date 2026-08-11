"use client"

import html2canvas from "html2canvas-pro"
import { useRef, useState } from "react"

import {
  CATEGORIES,
  SLIDE_TEMPLATES,
  type SlideTemplate,
} from "@/components/carousels/templates"

const TILE_W = 1080
const TILE_H = 1350
const PAD = 36
const GAP = 28
const HEADER_H = 84
const CAPTION_H = 64
const SHEET_W = PAD * 2 + TILE_W * 3 + GAP * 2
const PREVIEW_W = 1180

type Sheet = {
  id: string
  title: string
  meta: string
  templates: SlideTemplate[]
}

function chunkBalanced<T>(items: T[], max: number): T[][] {
  const count = Math.ceil(items.length / max)
  const base = Math.floor(items.length / count)
  const remainder = items.length % count
  const chunks: T[][] = []
  let index = 0

  for (let chunk = 0; chunk < count; chunk += 1) {
    const size = base + (chunk < remainder ? 1 : 0)
    chunks.push(items.slice(index, index + size))
    index += size
  }

  return chunks
}

const SHEETS: Sheet[] = CATEGORIES.flatMap((category) => {
  const templates = SLIDE_TEMPLATES.filter(
    (template) => template.category === category.key,
  )
  const chunks = chunkBalanced(templates, 6)

  return chunks.map((chunk, index) => ({
    id: `blend-ig-${category.key}-${index + 1}`,
    title: `${category.title.replace(/^\d+ · /, "").toUpperCase()} — SHEET ${index + 1}/${chunks.length}`,
    meta: `${chunk.length} TEMPLATES · 1080×1350 EACH`,
    templates: chunk,
  }))
})

function sheetHeight(sheet: Sheet) {
  const rows = Math.ceil(sheet.templates.length / 3)
  return PAD * 2 + HEADER_H + rows * (TILE_H + CAPTION_H) + (rows - 1) * GAP
}

function SheetBoard({ sheet }: { sheet: Sheet }) {
  return (
    <div className="bg-[hsl(var(--card))]" style={{ width: SHEET_W, padding: PAD }}>
      <div
        className="flex items-baseline justify-between font-mono font-semibold text-[hsl(var(--foreground)/0.60)]"
        style={{ height: HEADER_H }}
      >
        <span className="text-[30px] tracking-[0.18em]">
          BLEND IG — {sheet.title}
        </span>
        <span className="text-[26px] tracking-[0.14em]">{sheet.meta}</span>
      </div>
      <div className="grid grid-cols-3" style={{ gap: GAP }}>
        {sheet.templates.map((template) => (
          <div key={template.key} style={{ width: TILE_W }}>
            <div className="overflow-hidden" style={{ width: TILE_W, height: TILE_H }}>
              {template.render()}
            </div>
            <p
              className="flex items-center font-mono text-[26px] font-semibold tracking-[0.12em] text-[hsl(var(--foreground)/0.55)]"
              style={{ height: CAPTION_H }}
            >
              {template.key}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

async function downloadSheet(node: HTMLDivElement, filename: string) {
  await document.fonts.ready
  const canvas = await html2canvas(node, {
    backgroundColor: null,
    logging: false,
    scale: 1,
    width: SHEET_W,
    height: node.offsetHeight,
    windowWidth: SHEET_W,
    windowHeight: node.offsetHeight,
  })
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png", 1)
  })
  if (!blob) throw new Error("The browser could not render this sheet.")

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.png`
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export function TemplateSheets() {
  const refs = useRef<Record<string, HTMLDivElement | null>>({})
  const [busy, setBusy] = useState<string | null>(null)

  const exportOne = async (id: string) => {
    const node = refs.current[id]
    if (!node) return

    setBusy(id)
    try {
      await downloadSheet(node, id)
    } finally {
      setBusy(null)
    }
  }

  const exportAll = async () => {
    setBusy("all")
    try {
      for (const sheet of SHEETS) {
        const node = refs.current[sheet.id]
        if (node) await downloadSheet(node, sheet.id)
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <main data-palette="newport" className="font-sans">
      <div
        data-ig-palette="p6"
        className="min-h-screen bg-[hsl(var(--secondary))] px-8 pb-32 pt-14 text-[hsl(var(--foreground))]"
      >
        <div className="mx-auto max-w-[1240px]">
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Template sheets
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[hsl(var(--foreground)/0.65)]">
                Every template at native 1080×1350, grouped by category, max
                six per sheet. Exports are rendered from the DOM at full
                resolution — not screen captures — so nothing is lost to your
                display size.
              </p>
              <a
                href="/carousels/templates"
                className="mt-3 inline-block text-sm font-semibold text-[hsl(var(--primary))]"
              >
                ← Back to the lab
              </a>
            </div>
            <button
              type="button"
              onClick={exportAll}
              disabled={busy !== null}
              className="rounded-full bg-[hsl(var(--foreground))] px-6 py-3 text-sm font-semibold text-[hsl(var(--card))] disabled:opacity-50"
            >
              {busy === "all" ? "Exporting…" : `Export all ${SHEETS.length} sheets`}
            </button>
          </header>

          <div className="mt-12 flex flex-col gap-16">
            {SHEETS.map((sheet) => {
              const height = sheetHeight(sheet)
              const scale = PREVIEW_W / SHEET_W

              return (
                <section key={sheet.id}>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs font-semibold tracking-[0.14em] text-[hsl(var(--foreground)/0.60)]">
                        {sheet.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[hsl(var(--foreground)/0.45)]">
                        {sheet.id}.png · {SHEET_W}×{height}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => exportOne(sheet.id)}
                      disabled={busy !== null}
                      className="rounded-full border border-[hsl(var(--foreground)/0.25)] px-5 py-2 text-sm font-semibold disabled:opacity-50"
                    >
                      {busy === sheet.id ? "Exporting…" : "Export PNG"}
                    </button>
                  </div>
                  <div
                    className="overflow-hidden rounded-lg shadow-[0_6px_30px_hsl(var(--foreground)/0.10)]"
                    style={{ width: PREVIEW_W, height: height * scale }}
                  >
                    <div
                      style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                      }}
                    >
                      <div
                        ref={(element) => {
                          refs.current[sheet.id] = element
                        }}
                        style={{ width: SHEET_W }}
                      >
                        <SheetBoard sheet={sheet} />
                      </div>
                    </div>
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
