"use client"

import Image from "next/image"
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react"

import type { InsetPosition, TipSlideContent } from "@/lib/tips/schema"
import { cn } from "@/lib/utils"

export const SLIDE_W = 1080
export const SLIDE_H = 1350
export const TIP_SAFE = 72

export const TIP = {
  paper: "#eef3f8",
  ink: "#0b1220",
  mist: "#d5dee8",
  charcoal: "#12151c",
  phosphor: "#3dff8a",
  stamp: "#e11d48",
  sticky: "#ffe56a",
  stickyInk: "#3b2f0b",
  film: "#070707",
  halo: "#f8fafc",
  magazine: "#0f0f10",
  notebook: "#f4efe2",
  rule: "#93c5fd",
  teal: "#0f766e",
  violet: "#7c3aed",
} as const

export const SERIF: CSSProperties = {
  fontFamily: "var(--font-ig-serif), Georgia, serif",
}
export const HAND: CSSProperties = {
  fontFamily: "var(--font-ig-hand), cursive",
}
export const MONO: CSSProperties = {
  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
}

export const EMPTY_TIP_CONTENT: TipSlideContent = {
  text: {},
  images: {},
  inset: "br",
}

export const TipContentContext = createContext<TipSlideContent>(EMPTY_TIP_CONTENT)

export function useTipContent() {
  return useContext(TipContentContext)
}

export function normalizeCopy(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

export function replaceCopy(
  node: ReactNode,
  replacements: Record<string, string>,
): ReactNode {
  if (typeof node === "string") {
    const replacement = replacements[normalizeCopy(node)]
    if (replacement === undefined) return node
    const leadingWhitespace = node.match(/^\s*/)?.[0] ?? ""
    const trailingWhitespace = node.match(/\s*$/)?.[0] ?? ""
    return `${leadingWhitespace}${replacement}${trailingWhitespace}`
  }

  if (Array.isArray(node)) {
    return Children.map(node, (child) => replaceCopy(child, replacements))
  }

  if (
    !isValidElement<{ children?: ReactNode }>(node) ||
    node.props.children === undefined
  ) {
    return node
  }

  return cloneElement(
    node as ReactElement<{ children?: ReactNode }>,
    undefined,
    replaceCopy(node.props.children, replacements),
  )
}

export function usePromptText(fallback: string) {
  const content = useTipContent()
  const fromField = content.prompt?.trim()
  if (fromField) return fromField
  const mapped = content.text.PROMPT?.trim()
  if (mapped) return mapped
  const replaced = content.text[normalizeCopy(fallback)]
  if (replaced !== undefined) return replaced
  return fallback
}

export function Hand({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span className={cn("block leading-[1.05]", className)} style={{ ...HAND, ...style }}>
      {children}
    </span>
  )
}

export function Serif({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span className={cn("italic", className)} style={{ ...SERIF, ...style }}>
      {children}
    </span>
  )
}

export function Mono({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span className={className} style={{ ...MONO, ...style }}>
      {children}
    </span>
  )
}

export function TipMark({
  className,
  tone = "light",
}: {
  className?: string
  tone?: "light" | "dark"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-[22px] py-[10px] font-mono text-[18px] font-semibold tracking-[0.22em]",
        tone === "light"
          ? "bg-white/90 text-[#0b1220]"
          : "bg-[#0b1220]/80 text-[#eef3f8]",
        className,
      )}
    >
      TIP
    </span>
  )
}

export function TipSlot({
  label = "IMAGE",
  className,
  style,
}: {
  label?: string
  className?: string
  style?: CSSProperties
}) {
  const { images } = useTipContent()
  const image = images[label]

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        className,
      )}
      style={{ backgroundColor: "#1a2330", ...style }}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          unoptimized
          sizes="1080px"
          className="object-cover"
          style={{ objectPosition: image.position ?? "center" }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[10px] px-[28px] text-center">
          <span className="text-[28px] font-extrabold tracking-[0.02em] text-[#8aa0b8]">
            REPLACE WITH IMAGE
          </span>
          <span
            className="font-mono text-[18px] font-semibold tracking-[0.16em] text-[#6d8298]"
            style={MONO}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  )
}

export function TipCanvas({
  bg = TIP.charcoal,
  color = TIP.halo,
  children,
  className,
}: {
  bg?: string
  color?: string
  children: ReactNode
  className?: string
}) {
  const { text } = useTipContent()
  const content = Object.keys(text).length === 0 ? children : replaceCopy(children, text)

  return (
    <div
      className={cn("relative flex flex-col overflow-hidden antialiased", className)}
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        background: bg,
        color,
        fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {content}
    </div>
  )
}

const INSET_STYLE: Record<InsetPosition, CSSProperties> = {
  br: { bottom: TIP_SAFE, right: TIP_SAFE, top: "auto", left: "auto" },
  bl: { bottom: TIP_SAFE, left: TIP_SAFE, top: "auto", right: "auto" },
  tr: { top: TIP_SAFE, right: TIP_SAFE, bottom: "auto", left: "auto" },
  tl: { top: TIP_SAFE, left: TIP_SAFE, bottom: "auto", right: "auto" },
}

export function InsetAnchor({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const { inset } = useTipContent()
  const position = inset ?? "br"

  return (
    <div
      className={cn("absolute z-20", className)}
      style={{ ...INSET_STYLE[position], ...style }}
    >
      {children}
    </div>
  )
}

export function Scrim({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        background:
          "linear-gradient(180deg, rgba(8,12,20,0.28) 0%, rgba(8,12,20,0.04) 38%, rgba(8,12,20,0.55) 100%)",
      }}
    />
  )
}

export const IMAGE = {
  result: "RESULT · FULL BLEED",
  original: "ORIGINAL · INSET",
  still: "AI STILL",
  gridA: "GRID A",
  gridB: "GRID B",
  gridC: "GRID C",
} as const
