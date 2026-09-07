"use client"

import type { TipSlotKey, TipSystem } from "@/lib/tips/systems"

import { IMAGE, InsetAnchor, MONO, TipCanvas, TipSlot } from "./canvas"
import { PromptLabel, PromptPanel } from "./prompt-panel"

function BandWatermark({ system }: { system: TipSystem }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-[56px] pt-[48px]">
      <span
        className="rounded-full bg-white/15 px-[18px] py-[8px] font-mono text-[16px] font-semibold tracking-[0.18em] text-white"
        style={MONO}
      >
        BAND {system.band} · SCAFFOLD
      </span>
      <span
        className="max-w-[420px] text-right font-mono text-[16px] tracking-[0.12em] text-white/70"
        style={MONO}
      >
        {system.name}
      </span>
    </div>
  )
}

function StubCover({ system }: { system: TipSystem }) {
  return (
    <TipCanvas bg="#151821" color="#e8eef6">
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[#151821]/45" />
      <BandWatermark system={system} />
      <div className="absolute inset-x-[72px] bottom-[90px]">
        <h1 className="text-[72px] font-black leading-[0.95] tracking-[-0.045em]">
          {system.name}
        </h1>
        <p className="mt-[16px] max-w-[720px] text-[28px] leading-snug text-white/75">
          {system.summary}
        </p>
      </div>
    </TipCanvas>
  )
}

function StubBa({ system }: { system: TipSystem }) {
  return (
    <TipCanvas bg="#151821">
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <BandWatermark system={system} />
      <InsetAnchor>
        <div className="relative h-[300px] w-[240px] overflow-hidden rounded-[18px] border-[4px] border-white/80">
          <TipSlot label={IMAGE.original} className="absolute inset-0" />
        </div>
      </InsetAnchor>
    </TipCanvas>
  )
}

function StubPrompt({ system }: { system: TipSystem }) {
  return (
    <TipCanvas bg="#151821" color="#e8eef6">
      <BandWatermark system={system} />
      <div className="flex h-full pt-[120px]">
        <TipSlot label={IMAGE.still} className="h-full w-[46%] shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col px-[40px] pb-[56px] pt-[12px]">
          <PromptLabel className="text-white/55" />
          <PromptPanel className="mt-[16px] flex-1" minFontPx={26} maxFontPx={32} />
        </div>
      </div>
    </TipCanvas>
  )
}

function StubCta({ system }: { system: TipSystem }) {
  return (
    <TipCanvas bg="#151821" color="#e8eef6">
      <TipSlot label={IMAGE.result} className="absolute inset-0 opacity-40" />
      <BandWatermark system={system} />
      <div className="absolute inset-x-[72px] bottom-[100px]">
        <h2 className="text-[60px] font-black tracking-[-0.04em]">
          Comment {system.ctaKeyword}
        </h2>
        <p className="mt-[14px] text-[26px] text-white/70">
          Slot is registered. Visual system ships in a later band.
        </p>
      </div>
    </TipCanvas>
  )
}

export function StubSlide({
  system,
  slot,
}: {
  system: TipSystem
  slot: TipSlotKey
}) {
  switch (slot) {
    case "cover":
      return <StubCover system={system} />
    case "content-ba":
      return <StubBa system={system} />
    case "content-prompt":
      return <StubPrompt system={system} />
    case "cta":
      return <StubCta system={system} />
    default: {
      const _never: never = slot
      return _never
    }
  }
}
