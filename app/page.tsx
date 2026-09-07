import Link from "next/link"
import {
  ArrowUpRight,
  CheckCircle2,
  GalleryHorizontal,
  LayoutTemplate,
  Sparkles,
  Sticker,
} from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { getCarouselIndex } from "@/lib/carousels/data"
import { getTipIndex } from "@/lib/tips/data"

export default async function Home() {
  const { posts } = await getCarouselIndex()
  const { posts: tipPosts } = await getTipIndex()
  const versions = posts.reduce((sum, post) => sum + post.versions.length, 0)
  const approved = posts.filter((post) =>
    post.versions.some((version) => version.review === "approved"),
  ).length

  return (
    <main className="min-h-svh bg-[#f8f5ef] text-stone-900">
      <PageHeader eyebrow="CHARLO COMPUTER" title="Overview" />

      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-12">
        <section className="relative overflow-hidden rounded-[36px] bg-[#302219] px-6 py-12 text-[#f8f4ec] shadow-[0_40px_100px_-60px_rgba(35,24,17,0.85)] md:px-12 md:py-16">
          <div className="absolute -right-24 -top-28 size-[420px] rounded-full bg-[#dd4d20] opacity-90 blur-[1px]" />
          <div className="absolute right-16 top-12 size-28 rounded-full border border-white/20" />
          <div className="absolute bottom-[-75px] right-[27%] size-44 rotate-12 rounded-[32px] border border-[#f8f4ec]/10" />
          <div className="relative max-w-3xl">
            <div className="mb-10 flex size-11 items-center justify-center rounded-2xl bg-[#dd4d20] text-white">
              <Sparkles className="size-5" />
            </div>
            <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-[#eaa07f]">
              YOUR PRIVATE OPERATING SURFACE
            </p>
            <h1 className="mt-4 text-5xl font-black leading-[0.98] tracking-[-0.055em] md:text-7xl">
              Work made visible,
              <br />
              decisions made simple.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-[#d8cec5] md:text-lg">
              Agents create structured work on this Mac. You open one private
              URL, review the result, and decide what moves forward.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Carousel posts", value: posts.length, note: "JSON-backed drafts" },
            { label: "Creative versions", value: versions, note: "Ready to compare" },
            { label: "Approved posts", value: approved, note: "Cleared by you" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[26px] border border-stone-200/80 bg-white p-6 shadow-[0_20px_70px_-55px_rgba(49,35,23,0.65)]"
            >
              <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-stone-400">
                {stat.label.toUpperCase()}
              </p>
              <p className="mt-4 text-5xl font-black tracking-[-0.06em]">{stat.value}</p>
              <p className="mt-2 text-sm text-stone-500">{stat.note}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#dd4d20]">
                PROJECT 01
              </p>
              <h2 className="mt-1 text-3xl font-black tracking-[-0.045em]">
                BlendAI Carousels
              </h2>
            </div>
            <Link
              href="/carousels"
              className="hidden items-center gap-1 text-sm font-bold text-stone-600 hover:text-stone-950 sm:flex"
            >
              Open project <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Link
              href="/carousels"
              className="group relative overflow-hidden rounded-[30px] border border-stone-200 bg-[#f0e8dc] p-7 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_30px_80px_-55px_rgba(49,35,23,0.7)]"
            >
              <GalleryHorizontal className="size-8 text-[#dd4d20]" />
              <h3 className="mt-16 text-3xl font-black tracking-[-0.045em]">
                Review generated posts
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
                Compare versions, approve whole posts or individual slides, and
                export production-ready 1080 × 1350 images.
              </p>
              <ArrowUpRight className="absolute right-7 top-7 size-6 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/carousels/templates"
              className="group relative overflow-hidden rounded-[30px] bg-[#dd4d20] p-7 text-white transition hover:-translate-y-0.5 hover:shadow-[0_30px_80px_-55px_rgba(221,77,32,0.9)]"
            >
              <LayoutTemplate className="size-8" />
              <h3 className="mt-16 text-3xl font-black tracking-[-0.045em]">
                Browse 30 templates
              </h3>
              <p className="mt-3 text-sm leading-6 text-orange-100">
                Six covers, eighteen content layouts, and six closers copied
                from the original BlendAI lab.
              </p>
              <CheckCircle2 className="absolute right-7 top-7 size-6" />
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-teal-800">
                PROJECT 02
              </p>
              <h2 className="mt-1 text-3xl font-black tracking-[-0.045em]">
                Tip templates
              </h2>
            </div>
            <Link
              href="/tips"
              className="hidden items-center gap-1 text-sm font-bold text-slate-600 hover:text-slate-950 sm:flex"
            >
              Open project <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Link
              href="/tips"
              className="group relative overflow-hidden rounded-[30px] border border-slate-200 bg-[#e8eef4] p-7 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_30px_80px_-55px_rgba(8,12,20,0.55)]"
            >
              <Sticker className="size-8 text-teal-800" />
              <h3 className="mt-16 text-3xl font-black tracking-[-0.045em]">
                Review tip posts
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                {tipPosts.length} JSON-backed draft
                {tipPosts.length === 1 ? "" : "s"} for Social Ops tip brands.
                Cover, before/after, long prompt, CTA — no Blend chrome.
              </p>
              <ArrowUpRight className="absolute right-7 top-7 size-6 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/tips/templates"
              className="group relative overflow-hidden rounded-[30px] bg-[#0f766e] p-7 text-white transition hover:-translate-y-0.5 hover:shadow-[0_30px_80px_-55px_rgba(15,118,110,0.9)]"
            >
              <LayoutTemplate className="size-8" />
              <h3 className="mt-16 text-3xl font-black tracking-[-0.045em]">
                Browse A1–A10
              </h3>
              <p className="mt-3 text-sm leading-6 text-teal-50">
                Ten fillable systems plus B/C stubs. Prompt panels wrap and
                scroll; they never clip mid-word.
              </p>
              <CheckCircle2 className="absolute right-7 top-7 size-6" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
