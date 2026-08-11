"use client"

import type { ReactNode } from "react"

import {
  CATEGORIES,
  IG,
  SAMPLE_CAROUSEL,
  SAMPLE_GRID,
  SLIDE_H,
  SLIDE_TEMPLATES,
  SLIDE_W,
} from "@/components/carousels/templates"

const PALETTE_CANDIDATES = [
  { key: "p1", name: "01 · Newport", pair: "#f4f1ea / #3b2a1f" },
  {
    key: "p2",
    name: "02 · Editorial chocolate",
    pair: "#f0ece4 / #382215",
  },
  {
    key: "p3",
    name: "03 · Espresso contrast",
    pair: "#f7f4ed / #271a11",
  },
  { key: "p4", name: "04 · Caramel milk", pair: "#f1ece2 / #4e3b2c" },
  { key: "p5", name: "05 · Sienna", pair: "#f6f0ea / #3c231b" },
  {
    key: "p6",
    name: "06 · Espresso cream × Newport brown",
    pair: "#f7f4ed / #3b2a1f",
  },
]

function Scaled({ s, children }: { s: number; children: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-[0_6px_30px_hsl(var(--foreground)/0.12)]"
      style={{ width: SLIDE_W * s, height: SLIDE_H * s }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${s})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  )
}

function GridCrop({ h, children }: { h: number; children: ReactNode }) {
  const s = h / SLIDE_H

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: h * 0.75, height: h }}
    >
      <div
        className="absolute top-0"
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          left: -(SLIDE_W * s - h * 0.75) / 2,
          transform: `scale(${s})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint: string
  children: ReactNode
}) {
  return (
    <section className="mt-20">
      <h2 className="text-lg font-semibold tracking-tight text-[hsl(var(--foreground))]">
        {title}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-[hsl(var(--foreground)/0.60)]">
        {hint}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

const byKey = new Map(SLIDE_TEMPLATES.map((template) => [template.key, template]))

export function IgPostLab({ fontClassName }: { fontClassName: string }) {
  return (
    <main data-palette="newport" className={`${fontClassName} font-sans`}>
      <div
        data-ig-palette="p6"
        className="min-h-screen bg-[hsl(var(--card))] px-8 pb-32 pt-14 text-[hsl(var(--foreground))]"
      >
        <div className="mx-auto max-w-[1240px]">
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                IG Post Lab
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[hsl(var(--foreground)/0.65)]">
                The reference account&apos;s slide system rebuilt on the Newport
                palette — cream, ink, orange, Geist headlines with Instrument
                Serif accents. Dashed boxes are image slots; drop real photos in
                later without touching the layouts.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {[IG.cream, IG.stone, IG.orange, IG.ink, IG.photo].map(
                  (color) => (
                    <span
                      key={color}
                      className="h-8 w-8 rounded-full border border-[hsl(var(--foreground)/0.10)]"
                      style={{ background: color }}
                    />
                  ),
                )}
              </div>
              <a
                href="/carousels/templates/sheets"
                className="rounded-full bg-[hsl(var(--foreground))] px-5 py-2.5 text-sm font-semibold text-[hsl(var(--card))]"
              >
                Export sheets →
              </a>
            </div>
          </header>

          <Section
            title="Palette candidates — pick the cream/brown pair"
            hint="Exact mirror model: light slide = cream background + brown ink; dark slide = brown background + cream ink. Photos stay black. Same two slides, five pairs — say the number."
          >
            <div className="flex flex-wrap gap-8">
              {PALETTE_CANDIDATES.map((palette) => (
                <div key={palette.key} data-ig-palette={palette.key}>
                  <div className="flex flex-col gap-3">
                    <Scaled s={0.19}>
                      {byKey.get("statement")?.render()}
                    </Scaled>
                    <Scaled s={0.19}>{byKey.get("cta-end")?.render()}</Scaled>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{palette.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] tracking-wide text-[hsl(var(--foreground)/0.50)]">
                    {palette.pair}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="A carousel, assembled"
            hint="One post start to finish: hook cover → value slides → proof → comment CTA. Scroll sideways."
          >
            <div className="flex snap-x gap-6 overflow-x-auto pb-4">
              {SAMPLE_CAROUSEL.map((key, index) => {
                const template = byKey.get(key)
                if (!template) return null

                return (
                  <div key={key} className="snap-start">
                    <Scaled s={0.42}>{template.render()}</Scaled>
                    <p className="mt-2 font-mono text-[11px] tracking-wide text-[hsl(var(--foreground)/0.50)]">
                      {String(index + 1).padStart(2, "0")} · {template.name}
                    </p>
                  </div>
                )
              })}
            </div>
          </Section>

          {CATEGORIES.map((category) => (
            <Section
              key={category.key}
              title={category.title}
              hint={category.hint}
            >
              <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
                {SLIDE_TEMPLATES.filter(
                  (template) => template.category === category.key,
                ).map((template) => (
                  <div key={template.key}>
                    <Scaled s={0.36}>{template.render()}</Scaled>
                    <p className="mt-3 text-sm font-semibold">
                      {template.name}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[hsl(var(--foreground)/0.55)]">
                      {template.note}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          ))}

          <Section
            title="Profile grid preview"
            hint="The grid shows each post's first slide — always a full-bleed cover. 3:4 crop, like Instagram's grid."
          >
            <div className="inline-grid grid-cols-3 gap-[3px] rounded-md bg-[hsl(var(--card))] p-[3px] shadow-sm">
              {SAMPLE_GRID.map((key, index) => {
                const template = byKey.get(key)
                if (!template) return null

                return (
                  <GridCrop key={`${key}-${index}`} h={392}>
                    {template.render()}
                  </GridCrop>
                )
              })}
            </div>
          </Section>
        </div>
      </div>
    </main>
  )
}
