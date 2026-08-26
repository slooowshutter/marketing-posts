"use client"

/**
 * The wide-artboard ("canvas slice") primitive.
 *
 * A version declares ONE composition that is `slices * 1080` wide and 1350
 * tall — think a Figma artboard at roughly 8:1 — and every `canvas-slice`
 * slide is a 1080x1350 window onto it. Swiping the carousel pans across a
 * single design, so photos and words are cut by the slide edge on purpose.
 *
 * Authoring lives in JSON (content/carousels/FORMATS.md); nothing here is
 * post-specific. Coordinates are artboard pixels with the origin top-left,
 * so a block at x: 1020 straddles the seam between slide 1 and slide 2.
 */

import { createContext, useContext, type CSSProperties } from "react"

import type {
  CanvasBlock,
  CarouselCanvas,
} from "@/lib/carousels/schema"

export const CANVAS_SLICE_W = 1080
export const CANVAS_SLICE_H = 1350

/* ── colour tokens ──────────────────────────────────────────────────────
 * Authors write `ink`, `orange`, or `ink/40`; anything else (hex, rgba,
 * gradients) passes straight through so one-off treatments stay possible.
 */
const COLOR_TOKENS: Record<string, string> = {
  cream: "--background",
  paper: "--card",
  ink: "--foreground",
  orange: "--primary",
  stone: "--accent",
  photo: "--photo",
}

export function canvasColor(value: string | undefined, fallback = "ink") {
  const raw = value ?? fallback
  const [name, alpha] = raw.split("/")
  const token = COLOR_TOKENS[name.trim()]
  if (!token) return raw
  if (alpha === undefined) return `hsl(var(${token}))`
  return `hsl(var(${token}) / ${Number(alpha) / 100})`
}

const FONT_STACKS: Record<string, string> = {
  sans: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  serif: "var(--font-ig-serif), Georgia, serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  hand: "var(--font-ig-hand), cursive",
}

function blockTransform(rotate: number | undefined) {
  return rotate ? `rotate(${rotate}deg)` : undefined
}

function ImageBlock({ block }: { block: Extract<CanvasBlock, { type: "image" }> }) {
  const filters = [
    block.blur ? `blur(${block.blur}px)` : null,
    block.grayscale ? "grayscale(1)" : null,
  ].filter(Boolean)

  // A blurred backdrop must not show its own soft edges, and `scale` crops to
  // a detail. Both zoom from the same origin the fit already framed.
  const zoom = (block.blur ? 1.12 : 1) * (block.scale ?? 1)

  return (
    <div
      style={{
        position: "absolute",
        left: block.x,
        top: block.y,
        width: block.w,
        height: block.h,
        zIndex: block.z ?? 0,
        opacity: block.opacity ?? 1,
        borderRadius: block.radius ?? 0,
        overflow: "hidden",
        transform: blockTransform(block.rotate),
        boxShadow: block.shadow
          ? "0 30px 90px hsl(var(--foreground) / 0.30)"
          : undefined,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- the artboard
          sizes every block itself and html2canvas exports plain <img> most
          reliably; assets are local and already sized. */}
      <img
        src={block.src}
        alt={block.alt}
        width={block.w}
        height={block.h}
        style={{
          width: "100%",
          height: "100%",
          objectFit: block.fit,
          objectPosition: block.position ?? "center",
          filter: filters.length ? filters.join(" ") : undefined,
          transform: zoom === 1 ? undefined : `scale(${zoom})`,
          transformOrigin: block.position ?? "center",
          display: "block",
        }}
      />
    </div>
  )
}

function TextBlock({ block }: { block: Extract<CanvasBlock, { type: "text" }> }) {
  const style: CSSProperties = {
    position: "absolute",
    left: block.x,
    top: block.y,
    width: block.w,
    zIndex: block.z ?? 1,
    opacity: block.opacity ?? 1,
    transform: blockTransform(block.rotate),
    transformOrigin: "left top",
    fontFamily: FONT_STACKS[block.font],
    fontSize: block.size,
    fontWeight: block.weight ?? (block.font === "serif" ? 400 : 800),
    fontStyle: block.italic ? "italic" : "normal",
    lineHeight: block.lineHeight ?? 1.02,
    letterSpacing: block.tracking ? `${block.tracking}em` : undefined,
    textAlign: block.align,
    textTransform: block.uppercase ? "uppercase" : undefined,
    color: canvasColor(block.color),
    whiteSpace: "pre-wrap",
    margin: 0,
  }

  return <p style={style}>{block.value}</p>
}

function BoxBlock({ block }: { block: Extract<CanvasBlock, { type: "box" }> }) {
  return (
    <div
      style={{
        position: "absolute",
        left: block.x,
        top: block.y,
        width: block.w,
        height: block.h,
        zIndex: block.z ?? 0,
        opacity: block.opacity ?? 1,
        transform: blockTransform(block.rotate),
        background: block.fill ? canvasColor(block.fill) : undefined,
        border: block.border
          ? `${block.borderWidth ?? 3}px solid ${canvasColor(block.border)}`
          : undefined,
        borderRadius: block.radius ?? 0,
      }}
    />
  )
}

function Block({ block }: { block: CanvasBlock }) {
  if (block.type === "image") return <ImageBlock block={block} />
  if (block.type === "text") return <TextBlock block={block} />
  return <BoxBlock block={block} />
}

/* ── slice context ──────────────────────────────────────────────────────
 * SlideRenderer keeps its `render: () => ReactNode` signature, so the
 * canvas and the slide's column travel through context the same way slide
 * content already does.
 */
export type CanvasSliceValue = { canvas: CarouselCanvas | null; slice: number }

export const CanvasSliceContext = createContext<CanvasSliceValue>({
  canvas: null,
  slice: 0,
})

export function WideCanvasSlice() {
  const { canvas, slice } = useContext(CanvasSliceContext)
  const board = canvas ?? DEMO_CANVAS
  const index = Math.min(Math.max(slice, 0), board.slices - 1)
  const artboardWidth = board.slices * CANVAS_SLICE_W

  return (
    <div
      className="relative overflow-hidden font-sans antialiased"
      style={{
        width: CANVAS_SLICE_W,
        height: CANVAS_SLICE_H,
        background: canvasColor(board.background, "cream"),
        color: canvasColor("ink"),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: -index * CANVAS_SLICE_W,
          width: artboardWidth,
          height: CANVAS_SLICE_H,
        }}
      >
        {board.blocks.map((block, blockIndex) => (
          <Block key={`${block.type}-${blockIndex}`} block={block} />
        ))}

        {board.seams &&
          Array.from({ length: board.slices - 1 }, (_, seam) => (
            <div
              key={`seam-${seam}`}
              style={{
                position: "absolute",
                top: 0,
                left: (seam + 1) * CANVAS_SLICE_W - 1,
                width: 2,
                height: CANVAS_SLICE_H,
                background: "hsl(var(--primary))",
                opacity: 0.55,
                zIndex: 999,
              }}
            />
          ))}
      </div>
    </div>
  )
}

/**
 * Shown on /carousels/templates, where no post canvas is in context. Small
 * on purpose — three slices that demonstrate the one thing that matters:
 * a headline and a photo cut by the slide edge.
 */
export const DEMO_CANVAS: CarouselCanvas = {
  slices: 3,
  background: "cream",
  seams: false,
  blocks: [
    { type: "box", x: 0, y: 940, w: 3240, h: 6, fill: "ink/15" },
    {
      type: "text",
      x: 90,
      y: 210,
      w: 2400,
      value: "one artboard, cut into slides",
      size: 210,
      font: "sans",
      weight: 800,
      color: "ink",
      align: "left",
      lineHeight: 0.98,
      tracking: -0.045,
    },
    {
      type: "text",
      x: 92,
      y: 1010,
      w: 900,
      value: "SWIPE — IT IS ONE IMAGE",
      size: 26,
      font: "mono",
      weight: 600,
      color: "ink/50",
      align: "left",
      tracking: 0.2,
    },
    {
      type: "box",
      x: 880,
      y: 560,
      w: 620,
      h: 340,
      fill: "orange",
      radius: 10,
      rotate: -2,
      z: 2,
    },
    {
      type: "text",
      x: 930,
      y: 640,
      w: 520,
      value: "the seam falls\nwherever you\nwant it to",
      size: 62,
      font: "serif",
      italic: true,
      weight: 400,
      color: "paper",
      align: "left",
      lineHeight: 1.1,
      rotate: -2,
      z: 3,
    },
    {
      type: "box",
      x: 1900,
      y: 380,
      w: 900,
      h: 520,
      fill: "stone",
      radius: 14,
      z: 1,
    },
  ],
}
