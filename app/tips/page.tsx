import type { Metadata } from "next"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  LayoutTemplate,
  Plus,
  Sticker,
} from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { getTipIndex } from "@/lib/tips/data"
import { getTipSystem } from "@/lib/tips/systems"
import type { ReviewStatus } from "@/lib/tips/schema"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Tip templates",
  description: "Social Ops tip-channel carousels for Charlot, separate from Blend.",
}

const reviewLabels: Record<ReviewStatus, string> = {
  draft: "Draft",
  approved: "Approved",
  "changes-requested": "Changes requested",
}

function reviewClass(review: ReviewStatus) {
  if (review === "approved") return "bg-emerald-100 text-emerald-800"
  if (review === "changes-requested") return "bg-amber-100 text-amber-800"
  return "bg-slate-200 text-slate-600"
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export default async function TipsPage() {
  const { posts, errors } = await getTipIndex()

  return (
    <main className="min-h-svh bg-[#e8eef4] text-slate-950">
      <PageHeader
        eyebrow="PROJECT / TIP CHANNELS"
        title="Tip posts"
        actions={
          <Link
            href="/tips/templates"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-300 bg-white px-3 text-xs font-bold text-slate-800 transition hover:border-slate-500"
          >
            <LayoutTemplate className="size-4" />
            <span className="hidden sm:inline">30 systems</span>
          </Link>
        }
      />

      <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-8 md:py-14">
        <section className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-9 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-teal-800">
              SOCIAL OPS · TIP BRANDS
            </p>
            <h1 className="mt-3 max-w-4xl text-5xl font-black tracking-[-0.055em] md:text-7xl">
              Fill A-band systems
              <br />
              without Blend chrome.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
              Cover, before/after, long-prompt, and CTA slots for Prompt Stash,
              Edit Nudge, Look Recipe, Shot Swap, and Prompt Kitchen. Agents
              write JSON; you review at 1080 × 1350.
            </p>
          </div>

          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-5 lg:w-[360px]">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-white">
                <Plus className="size-4" />
              </span>
              <div>
                <p className="text-sm font-bold">Marketer fills JSON</p>
                <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                  content/tips/&lt;post-id&gt;.json
                </p>
              </div>
            </div>
          </div>
        </section>

        {errors.length > 0 && (
          <section className="mt-8 rounded-[24px] border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="size-4" />
              {errors.length} invalid tip file{errors.length === 1 ? "" : "s"}
            </div>
            <ul className="mt-3 space-y-2 font-mono text-xs leading-5 text-amber-800">
              {errors.map((error) => (
                <li key={error.file}>
                  <strong>{error.file}</strong>: {error.message}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-[-0.035em]">All tip posts</h2>
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-slate-400">
              {posts.length} TOTAL
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[30px] border border-dashed border-slate-300 bg-white/60 px-6 text-center">
              <Sticker className="size-10 text-slate-300" />
              <h3 className="mt-5 text-xl font-black">No tip JSON yet</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Copy a sample in content/tips and give it a unique slug.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {posts.map((post) => {
                const latestVersion = post.versions[0]
                const slideCount = latestVersion.slides.length
                const system = getTipSystem(post.system)

                return (
                  <Link
                    key={post.id}
                    href={`/tips/posts/${post.id}`}
                    className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_80px_-58px_rgba(8,12,20,0.55)] transition hover:-translate-y-0.5 hover:border-slate-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={cn(
                          "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-bold",
                          reviewClass(latestVersion.review),
                        )}
                      >
                        {reviewLabels[latestVersion.review]}
                      </span>
                      <ArrowUpRight className="size-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-950" />
                    </div>

                    <p className="mt-8 font-mono text-[11px] font-semibold tracking-[0.14em] text-teal-800">
                      {system
                        ? `${system.band}${String(system.number).padStart(2, "0")} · ${system.name}`
                        : post.system}
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                      {post.title}
                    </h3>
                    {post.summary && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {post.summary}
                      </p>
                    )}

                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 font-mono text-[10px] font-semibold tracking-[0.08em] text-slate-400">
                      <span>
                        {post.versions.length} VERSION
                        {post.versions.length === 1 ? "" : "S"}
                      </span>
                      <span>{slideCount} SLIDES</span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3" />
                        {formatDate(post.updatedAt)}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
