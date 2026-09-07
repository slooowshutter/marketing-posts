import type { Metadata } from "next"
import Link from "next/link"

import { TipGallery } from "@/components/tips/gallery"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Tip template gallery",
  description: "30 tip-channel Charlot systems: cover, BA, long prompt, CTA.",
  robots: { index: false, follow: false },
}

export default function TipTemplatesPage() {
  return (
    <main className="min-h-svh bg-[#e8eef4] text-slate-950">
      <PageHeader
        eyebrow="PROJECT / TIP CHANNELS"
        title="Template gallery"
        actions={
          <Link
            href="/tips"
            className="inline-flex h-9 items-center rounded-full bg-slate-950 px-4 text-xs font-bold text-white"
          >
            All tip posts
          </Link>
        }
      />
      <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-8 md:py-14">
        <header className="max-w-3xl">
          <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-teal-800">
            30 SYSTEMS · COVER / BA / PROMPT / CTA
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] md:text-6xl">
            Tip template gallery
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            A-band is ready for Marketer fill. B and C are registered stubs with
            the same slots. Do not use Blend cream/brown studio skins on these
            brands. Prompt panels wrap and scroll — they never clip mid-word.
          </p>
        </header>
        <TipGallery />
      </div>
    </main>
  )
}
