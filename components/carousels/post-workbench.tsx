"use client"

import html2canvas from "html2canvas-pro"
import JSZip from "jszip"
import {
  Archive,
  Check,
  Download,
  LoaderCircle,
  MessageSquareWarning,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"

import { updateCarouselReview } from "@/app/carousels/actions"
import {
  getSlideTemplate,
  SLIDE_H,
  SLIDE_W,
  SlideRenderer,
} from "@/components/carousels/templates"
import type {
  CarouselPost,
  CarouselSlide,
  CarouselVersion,
  ReviewStatus,
} from "@/lib/carousels/schema"
import { cn } from "@/lib/utils"

const PREVIEW_SCALE = 0.42

const REVIEW_LABELS: Record<ReviewStatus, string> = {
  draft: "Draft",
  approved: "Approved",
  "changes-requested": "Changes requested",
}

function reviewTone(review: ReviewStatus) {
  if (review === "approved") return "bg-emerald-100 text-emerald-800"
  if (review === "changes-requested") return "bg-amber-100 text-amber-900"
  return "bg-[hsl(var(--accent))] text-[hsl(var(--foreground)/0.65)]"
}

function ReviewBadge({ review }: { review: ReviewStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold",
        reviewTone(review),
      )}
    >
      {REVIEW_LABELS[review]}
    </span>
  )
}

async function waitForSlideAssets(node: HTMLElement) {
  await document.fonts.ready
  const images = Array.from(node.querySelectorAll("img"))
  await Promise.all(
    images.map((image) => {
      if (image.complete) return image.decode().catch(() => undefined)
      return new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true })
        image.addEventListener("error", () => resolve(), { once: true })
      })
    }),
  )
}

async function renderSlide(node: HTMLElement) {
  const exportRoot = document.createElement("div")
  const clone = node.cloneNode(true) as HTMLElement
  const sourceStyles = getComputedStyle(node)

  exportRoot.dataset.palette = "newport"
  exportRoot.dataset.igPalette = "p6"
  exportRoot.style.cssText = [
    "position:fixed",
    "inset:0 auto auto 0",
    `width:${SLIDE_W}px`,
    `height:${SLIDE_H}px`,
    "overflow:hidden",
    "pointer-events:none",
    "z-index:-2147483648",
  ].join(";")
  exportRoot.style.setProperty(
    "--font-sans",
    sourceStyles.getPropertyValue("--font-sans"),
  )
  exportRoot.style.setProperty(
    "--font-ig-serif",
    sourceStyles.getPropertyValue("--font-ig-serif"),
  )
  exportRoot.style.setProperty(
    "--font-ig-hand",
    sourceStyles.getPropertyValue("--font-ig-hand"),
  )
  clone.style.width = `${SLIDE_W}px`
  clone.style.height = `${SLIDE_H}px`
  clone.querySelectorAll("img").forEach((image) => {
    image.loading = "eager"
  })
  exportRoot.appendChild(clone)
  document.body.appendChild(exportRoot)

  try {
    await waitForSlideAssets(clone)
    const canvas = await html2canvas(clone, {
      backgroundColor: null,
      logging: false,
      scale: 1,
      useCORS: true,
      width: SLIDE_W,
      height: SLIDE_H,
      windowWidth: SLIDE_W,
      windowHeight: SLIDE_H,
    })

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png", 1)
    })

    if (!blob) throw new Error("The browser could not render this slide.")
    return blob
  } finally {
    exportRoot.remove()
  }
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

/**
 * A `canvas-slice` slide may name its column explicitly; otherwise it takes
 * the next one, so a straight run of slices needs no numbering by hand.
 */
function sliceIndexes(slides: CarouselSlide[]) {
  const indexes = new Map<string, number>()
  let next = 0

  for (const slide of slides) {
    if (slide.template !== "canvas-slice") continue
    const slice = slide.slice ?? next
    indexes.set(slide.id, slice)
    next = slice + 1
  }

  return indexes
}

/**
 * A wide artboard cannot be judged one slide at a time — the whole point is
 * what happens across the cuts. This lays every slide of the version edge to
 * edge at whatever scale fits the page, which is the closest a desktop gets
 * to the swipe. Read-only: reviewing and exporting stay on the strip below.
 */
function ContinuityStrip({
  version,
  slices,
}: {
  version: CarouselVersion
  slices: Map<string, number>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [showCuts, setShowCuts] = useState(true)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const scale = width > 0 ? width / (version.slides.length * SLIDE_W) : 0

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            The artboard, uncut
          </h3>
          <p className="mt-0.5 text-xs text-[hsl(var(--foreground)/0.55)]">
            Every slide edge to edge. Check that nothing you need whole — a
            stamp, a number, a name — lands on a cut.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCuts((current) => !current)}
          aria-pressed={showCuts}
          className={cn(
            "h-8 rounded-full px-3 text-xs font-semibold transition",
            showCuts
              ? "bg-[hsl(var(--foreground))] text-[hsl(var(--card))]"
              : "bg-[hsl(var(--accent))] text-[hsl(var(--foreground)/0.65)]",
          )}
        >
          {showCuts ? "Hide cuts" : "Show cuts"}
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative mt-4 overflow-hidden rounded-lg shadow-[0_6px_30px_hsl(var(--foreground)/0.12)]"
        style={{ height: scale > 0 ? SLIDE_H * scale : undefined }}
      >
        <div className="flex">
          {version.slides.map((slide) => (
            <div
              key={slide.id}
              className="relative shrink-0 overflow-hidden"
              style={{ width: SLIDE_W * scale, height: SLIDE_H * scale }}
            >
              <div
                className="absolute left-0 top-0"
                style={{
                  width: SLIDE_W,
                  height: SLIDE_H,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                <SlideRenderer
                  template={slide.template}
                  content={slide.content}
                  canvas={version.canvas ?? null}
                  slice={slices.get(slide.id) ?? 0}
                />
              </div>
            </div>
          ))}
        </div>

        {showCuts &&
          scale > 0 &&
          version.slides.slice(1).map((slide, index) => (
            <span
              key={`cut-${slide.id}`}
              aria-hidden
              className="pointer-events-none absolute top-0 h-full w-px bg-[hsl(var(--primary)/0.75)]"
              style={{ left: (index + 1) * SLIDE_W * scale }}
            />
          ))}
      </div>
    </section>
  )
}

function slideFilename(
  post: CarouselPost,
  versionId: string,
  slide: CarouselSlide,
  index: number,
) {
  return `${post.id}-${versionId}-${String(index + 1).padStart(2, "0")}-${slide.template}.png`
}

export function PostWorkbench({ post }: { post: CarouselPost }) {
  const router = useRouter()
  const [selectedVersionId, setSelectedVersionId] = useState(post.versions[0].id)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReviewing, startReviewTransition] = useTransition()
  const slideRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const version =
    post.versions.find((candidate) => candidate.id === selectedVersionId) ??
    post.versions[0]
  const slices = sliceIndexes(version.slides)

  const updateReview = (review: ReviewStatus, slideId?: string) => {
    setError(null)
    startReviewTransition(async () => {
      try {
        await updateCarouselReview({
          postId: post.id,
          versionId: version.id,
          slideId,
          review,
        })
        router.refresh()
      } catch (reviewError) {
        setError(
          reviewError instanceof Error
            ? reviewError.message
            : "Could not update the review.",
        )
      }
    })
  }

  const downloadSlide = async (slide: CarouselSlide, index: number) => {
    const node = slideRefs.current[slide.id]
    if (!node) return

    setError(null)
    setBusy(slide.id)
    try {
      const blob = await renderSlide(node)
      saveBlob(blob, slideFilename(post, version.id, slide, index))
    } catch (exportError) {
      setError(
        exportError instanceof Error
          ? exportError.message
          : "Could not export this slide.",
      )
    } finally {
      setBusy(null)
    }
  }

  const downloadZip = async () => {
    setError(null)
    setBusy("zip")

    try {
      const zip = new JSZip()
      for (const [index, slide] of version.slides.entries()) {
        const node = slideRefs.current[slide.id]
        if (!node) throw new Error(`Slide ${index + 1} is not ready yet.`)
        zip.file(
          slideFilename(post, version.id, slide, index),
          await renderSlide(node),
        )
      }
      if (post.caption) zip.file("caption.txt", post.caption)
      zip.file("post.json", `${JSON.stringify(post, null, 2)}\n`)
      saveBlob(
        await zip.generateAsync({ type: "blob" }),
        `${post.id}-${version.id}.zip`,
      )
    } catch (exportError) {
      setError(
        exportError instanceof Error
          ? exportError.message
          : "Could not export the carousel.",
      )
    } finally {
      setBusy(null)
    }
  }

  return (
    <section className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Carousel versions
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[hsl(var(--foreground)/0.60)]">
            Pick a version, scroll sideways, and approve the complete carousel
            or individual slides.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isReviewing}
            onClick={() => updateReview("changes-requested")}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-4 text-sm font-semibold disabled:opacity-50"
          >
            <MessageSquareWarning className="size-4" />
            Needs changes
          </button>
          <button
            type="button"
            disabled={isReviewing}
            onClick={() => updateReview("approved")}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-700 px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isReviewing ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            Approve version
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={downloadZip}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[hsl(var(--foreground))] px-4 text-sm font-semibold text-[hsl(var(--card))] disabled:opacity-50"
          >
            {busy === "zip" ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Archive className="size-4" />
            )}
            Export ZIP
          </button>
        </div>
      </div>

      <div
        className="mt-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Post versions"
      >
        {post.versions.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            role="tab"
            aria-selected={candidate.id === version.id}
            onClick={() => {
              setSelectedVersionId(candidate.id)
              setError(null)
            }}
            className={cn(
              "flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition",
              candidate.id === version.id
                ? "bg-[hsl(var(--foreground))] text-[hsl(var(--card))]"
                : "bg-[hsl(var(--accent))] text-[hsl(var(--foreground)/0.65)] hover:text-[hsl(var(--foreground))]",
            )}
          >
            {candidate.label}
            <span className="text-[11px] opacity-65">
              {candidate.slides.length} slides
            </span>
          </button>
        ))}
        <ReviewBadge review={version.review} />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {version.canvas && (
        <ContinuityStrip version={version} slices={slices} />
      )}

      <div className="mt-6 flex snap-x gap-6 overflow-x-auto pb-4">
        {version.slides.map((slide, index) => {
          const template = getSlideTemplate(slide.template)

          return (
            <article
              key={slide.id}
              className="shrink-0 snap-start"
              style={{ width: SLIDE_W * PREVIEW_SCALE }}
            >
              <div
                className="relative overflow-hidden rounded-lg shadow-[0_6px_30px_hsl(var(--foreground)/0.12)]"
                style={{
                  width: SLIDE_W * PREVIEW_SCALE,
                  height: SLIDE_H * PREVIEW_SCALE,
                }}
              >
                <div
                  className="absolute left-0 top-0"
                  style={{
                    width: SLIDE_W,
                    height: SLIDE_H,
                    transform: `scale(${PREVIEW_SCALE})`,
                    transformOrigin: "top left",
                  }}
                >
                  <div
                    ref={(node) => {
                      slideRefs.current[slide.id] = node
                    }}
                    style={{ width: SLIDE_W, height: SLIDE_H }}
                  >
                    <SlideRenderer
                      template={slide.template}
                      content={slide.content}
                      canvas={version.canvas ?? null}
                      slice={slices.get(slide.id) ?? 0}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] tracking-wide text-[hsl(var(--foreground)/0.50)]">
                    {String(index + 1).padStart(2, "0")} · {template?.name}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-[hsl(var(--foreground)/0.38)]">
                    {slide.template}
                  </p>
                </div>
                <ReviewBadge review={slide.review} />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  disabled={isReviewing}
                  onClick={() => updateReview("changes-requested", slide.id)}
                  className="rounded-full bg-[hsl(var(--accent))] px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                >
                  Needs changes
                </button>
                <button
                  type="button"
                  disabled={isReviewing}
                  onClick={() => updateReview("approved", slide.id)}
                  className="rounded-full bg-[hsl(var(--accent))] px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => downloadSlide(slide, index)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-semibold disabled:opacity-50"
                >
                  {busy === slide.id ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <Download className="size-3.5" />
                  )}
                  PNG
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
