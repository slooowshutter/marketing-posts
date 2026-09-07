import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { TipPostWorkbench } from "@/components/tips/post-workbench"
import { TipFileError, getTipPost } from "@/lib/tips/data"
import { getTipSystem } from "@/lib/tips/systems"

export const metadata: Metadata = {
  title: "Tip post review",
}

async function loadPost(slug: string) {
  try {
    return { post: await getTipPost(slug), error: null }
  } catch (error) {
    if (!(error instanceof TipFileError)) throw error
    return { post: null, error }
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export default async function TipPostPage({
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
            INVALID TIP JSON · {result.error.file}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
            This post cannot be rendered yet.
          </h1>
          <p className="mt-4 font-mono text-xs leading-6 text-red-800">
            {result.error.message}
          </p>
          <Link href="/tips" className="mt-6 inline-block text-sm font-semibold">
            ← Back to all tip posts
          </Link>
        </div>
      </main>
    )
  }

  if (!result.post) notFound()
  const post = result.post
  const system = getTipSystem(post.system)

  return (
    <main className="min-h-svh bg-[#e8eef4] font-sans text-slate-950">
      <div className="px-8 pb-32 pt-14">
        <div className="mx-auto max-w-[1240px]">
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {system ? (
                  <span>
                    {system.band}
                    {String(system.number).padStart(2, "0")} · {system.name}
                  </span>
                ) : (
                  <span>{post.system}</span>
                )}
                <span>·</span>
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
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                  {post.summary}
                </p>
              )}
            </div>
            <Link
              href="/tips"
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
            >
              All tip posts →
            </Link>
          </header>

          <TipPostWorkbench post={post} />

          {post.caption && (
            <section className="mt-20">
              <h2 className="text-lg font-semibold tracking-tight">Caption</h2>
              <p className="mt-6 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {post.caption}
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
