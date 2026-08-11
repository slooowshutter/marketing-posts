import type { Metadata } from "next"
import { Caveat, Geist, Instrument_Serif } from "next/font/google"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PostWorkbench } from "@/components/carousels/post-workbench"
import { CarouselFileError, getCarouselPost } from "@/lib/carousels/data"

const SWATCHES = [
  "hsl(var(--background))",
  "hsl(var(--accent))",
  "hsl(var(--primary))",
  "hsl(var(--foreground))",
  "hsl(from hsl(var(--lime)) h 100% 50%)",
]

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-ig-serif",
})

const caveat = Caveat({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ig-hand",
})

export const metadata: Metadata = {
  title: "Carousel Review",
}

async function loadPost(slug: string) {
  try {
    return { post: await getCarouselPost(slug), error: null }
  } catch (error) {
    if (!(error instanceof CarouselFileError)) throw error
    return { post: null, error }
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export default async function CarouselPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const result = await loadPost(slug)

  if (result.error) {
    return (
      <main className="min-h-svh bg-red-50 px-8 py-14 text-red-950">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs font-semibold tracking-wide text-red-700">
            INVALID CAROUSEL JSON · {result.error.file}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
            This post cannot be rendered yet.
          </h1>
          <p className="mt-4 font-mono text-xs leading-6 text-red-800">
            {result.error.message}
          </p>
          <Link
            href="/carousels"
            className="mt-6 inline-block text-sm font-semibold"
          >
            ← Back to all posts
          </Link>
        </div>
      </main>
    )
  }

  if (!result.post) notFound()
  const post = result.post

  return (
    <main
      data-palette="newport"
      className={`${geist.variable} ${instrumentSerif.variable} ${caveat.variable} font-sans`}
    >
      <div
        data-ig-palette="p6"
        className="min-h-screen bg-[hsl(var(--card))] px-8 pb-32 pt-14 text-[hsl(var(--foreground))]"
      >
        <div className="mx-auto max-w-[1240px]">
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--foreground)/0.50)]">
                {post.platforms.map((platform) => (
                  <span key={platform}>{platform}</span>
                ))}
                <span>·</span>
                <span>Updated {formatDate(post.updatedAt)}</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
                {post.title}
              </h1>
              {post.summary && (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[hsl(var(--foreground)/0.65)]">
                  {post.summary}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {SWATCHES.map((color) => (
                    <span
                      key={color}
                      className="h-8 w-8 rounded-full border border-[hsl(var(--foreground)/0.10)]"
                      style={{ background: color }}
                    />
                  ))}
              </div>
              <Link
                href="/carousels"
                className="rounded-full bg-[hsl(var(--foreground))] px-5 py-2.5 text-sm font-semibold text-[hsl(var(--card))]"
              >
                All posts →
              </Link>
            </div>
          </header>

          <PostWorkbench post={post} />

          {post.caption && (
            <section className="mt-20">
              <h2 className="text-lg font-semibold tracking-tight">
                Caption
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-[hsl(var(--foreground)/0.60)]">
                The publishing copy stored alongside this carousel.
              </p>
              <p className="mt-6 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-[hsl(var(--foreground)/0.75)]">
                {post.caption}
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
