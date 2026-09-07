"use client"

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import { MONO, usePromptText } from "./canvas"

export const GALLERY_PROMPT = [
  "A sunlit kitchen at 8am, 35mm still, slight film grain, woman in a linen shirt pouring coffee, steam catching window light, shallow depth of field, Kodak Portra warmth without orange crush, muted teal shadows, candid not posed.",
  "",
  "Keep skin texture honest. No beauty-filter smoothing. Hands in frame. Background slightly messy — toast rack, open cookbook, a plant that needs water.",
  "",
  "Camera: 50mm, f/1.8, ISO 200, backlight from camera-left. Color grade: lift shadows toward cool gray-blue, hold highlights on the cream of the mug, never crush blacks.",
  "",
  "Negative: plastic skin, extra fingers, warped mugs, brand logos, oversaturated orange, centered stock-photo smile, text overlays, watermarks.",
].join("\n")

const PROMPT_CSS: CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "normal",
  whiteSpace: "pre-wrap",
  hyphens: "manual",
  overflowX: "hidden",
  overflowY: "auto",
  textOverflow: "clip",
  WebkitHyphens: "manual",
}

function fitPrompt(node: HTMLDivElement, minFontPx: number, maxFontPx: number) {
  let size = maxFontPx
  node.style.fontSize = `${size}px`
  if (node.clientHeight < 8) return
  while (size > minFontPx && node.scrollHeight > node.clientHeight + 1) {
    size -= 1
    node.style.fontSize = `${size}px`
  }
}

export function PromptPanel({
  className,
  style,
  minFontPx = 28,
  maxFontPx = 36,
  fallback = GALLERY_PROMPT,
  tone = "plain",
}: {
  className?: string
  style?: CSSProperties
  minFontPx?: number
  maxFontPx?: number
  fallback?: string
  tone?: "plain" | "mono" | "serif"
}) {
  const prompt = usePromptText(fallback)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return

    const run = () => fitPrompt(node, minFontPx, maxFontPx)
    run()
    const observer = new ResizeObserver(run)
    observer.observe(node)
    return () => observer.disconnect()
  }, [prompt, minFontPx, maxFontPx])

  const family: CSSProperties =
    tone === "mono"
      ? MONO
      : tone === "serif"
        ? { fontFamily: "var(--font-ig-serif), Georgia, serif" }
        : {}

  return (
    <div
      ref={ref}
      data-tip-prompt="true"
      className={cn("min-h-0 overflow-x-hidden overflow-y-auto", className)}
      style={{
        ...PROMPT_CSS,
        ...family,
        fontSize: maxFontPx,
        lineHeight: 1.38,
        ...style,
      }}
    >
      {prompt}
    </div>
  )
}

export function PromptLabel({
  children = "PROMPT",
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "font-mono text-[18px] font-semibold tracking-[0.22em] uppercase",
        className,
      )}
      style={MONO}
    >
      {children}
    </span>
  )
}
