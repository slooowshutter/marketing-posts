"use client"

import type { CSSProperties, ReactNode } from "react"

import type { ASystemId, TipSlotKey } from "@/lib/tips/systems"
import { cn } from "@/lib/utils"

import {
  HAND,
  IMAGE,
  InsetAnchor,
  MONO,
  SERIF,
  Scrim,
  TIP,
  TIP_SAFE,
  TipCanvas,
  TipMark,
  TipSlot,
  Hand,
} from "./canvas"
import { PromptLabel, PromptPanel } from "./prompt-panel"

function renderSlot(
  slot: TipSlotKey,
  views: Record<TipSlotKey, () => ReactNode>,
) {
  switch (slot) {
    case "cover":
      return views.cover()
    case "content-ba":
      return views["content-ba"]()
    case "content-prompt":
      return views["content-prompt"]()
    case "cta":
      return views.cta()
    default: {
      const _never: never = slot
      return _never
    }
  }
}

function PolaroidFrame({
  caption = "before",
  className,
  children,
}: {
  caption?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative bg-[#f6f7f4] p-[18px] pb-[78px] shadow-[0_18px_40px_rgba(0,0,0,0.38)]",
        className,
      )}
      style={{ transform: "rotate(-6deg)" }}
    >
      <div className="relative h-full w-full overflow-hidden bg-[#1a2330]">
        {children}
      </div>
      <span
        className="absolute bottom-[18px] left-0 right-0 text-center text-[32px] text-[#2a2a28]"
        style={HAND}
      >
        {caption}
      </span>
    </div>
  )
}

function PolaroidCover() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <Scrim />
      <div
        className="absolute left-0 right-0 top-0 flex items-center justify-center"
        style={{
          height: 210,
          background: "rgba(18, 21, 28, 0.88)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
        }}
      >
        <Hand className="px-[64px] text-center text-[72px] text-[#f4f1ea]">
          Warm it up.
        </Hand>
      </div>
      <TipMark className="absolute left-[72px] bottom-[72px]" />
    </TipCanvas>
  )
}

function PolaroidBa() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <InsetAnchor>
        <PolaroidFrame className="h-[420px] w-[330px]">
          <TipSlot label={IMAGE.original} className="absolute inset-0" />
        </PolaroidFrame>
      </InsetAnchor>
    </TipCanvas>
  )
}

function PolaroidPrompt() {
  return (
    <TipCanvas bg={TIP.charcoal} color="#e8edf3">
      <div className="flex h-full">
        <TipSlot label={IMAGE.still} className="h-full w-[500px] shrink-0" />
        <div
          className="flex min-w-0 flex-1 flex-col px-[48px] py-[64px]"
          style={{ background: "#161a22" }}
        >
          <PromptLabel className="text-[#7d8b9c]" />
          <PromptPanel
            tone="mono"
            className="mt-[28px] flex-1"
            minFontPx={26}
            maxFontPx={32}
          />
        </div>
      </div>
    </TipCanvas>
  )
}

function PolaroidCta() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 bg-[#12151c]/92 px-[72px] py-[88px] text-[#eef3f8]">
        <p className="font-mono text-[22px] tracking-[0.18em] text-[#9aa8b8]" style={MONO}>
          SAVE THIS LOOK
        </p>
        <h2 className="mt-[18px] text-[72px] font-black leading-[0.95] tracking-[-0.04em]">
          Comment <span className="text-[#7dd3c7]">PROMPT</span>
        </h2>
        <p className="mt-[22px] text-[28px] text-[#c5d0dc]">and we send the stack.</p>
      </div>
    </TipCanvas>
  )
}

function HaloCover() {
  return (
    <TipCanvas bg="#07080c" color={TIP.halo}>
      <div
        className="absolute left-1/2 top-[130px] overflow-hidden rounded-full"
        style={{
          width: 640,
          height: 640,
          transform: "translateX(-50%)",
          boxShadow: "0 0 0 14px rgba(248,250,252,0.16), 0 0 80px rgba(125,211,199,0.28)",
        }}
      >
        <TipSlot label={IMAGE.result} className="absolute inset-0" />
      </div>
      <h1 className="absolute bottom-[120px] left-0 right-0 text-center text-[140px] font-black tracking-[-0.06em]">
        GLOW
      </h1>
    </TipCanvas>
  )
}

function HaloBa() {
  return (
    <TipCanvas bg="#07080c">
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <InsetAnchor
        className="overflow-hidden rounded-full"
        style={{
          width: 280,
          height: 280,
          boxShadow: "0 0 0 10px #f8fafc, 0 0 40px rgba(0,0,0,0.4)",
        }}
      >
        <TipSlot label={IMAGE.original} className="absolute inset-0" />
      </InsetAnchor>
    </TipCanvas>
  )
}

function HaloPrompt() {
  return (
    <TipCanvas bg="#07080c" color="#f8fafc">
      <TipSlot label={IMAGE.still} className="absolute inset-x-0 top-0 h-[55%]" />
      <div
        className="absolute inset-x-[48px] bottom-[56px] top-[52%] flex flex-col overflow-hidden rounded-[36px] px-[44px] py-[36px]"
        style={{ background: "rgba(248,250,252,0.96)", color: "#0b1220" }}
      >
        <PromptLabel className="text-[#5b6b7c]" />
        <PromptPanel className="mt-[18px] flex-1" minFontPx={26} maxFontPx={34} />
      </div>
    </TipCanvas>
  )
}

function HaloCta() {
  return (
    <TipCanvas bg="#07080c" color={TIP.halo}>
      <TipSlot label={IMAGE.result} className="absolute inset-0 opacity-50" />
      <div className="absolute inset-0 flex flex-col items-center justify-end px-[72px] pb-[110px] text-center">
        <span className="rounded-full border border-white/40 px-[36px] py-[16px] font-mono text-[22px] tracking-[0.18em]">
          FOLLOW FOR LOOKS
        </span>
        <h2 className="mt-[28px] text-[68px] font-black tracking-[-0.04em]">
          Comment LOOK
        </h2>
      </div>
    </TipCanvas>
  )
}

function MagazineCover() {
  return (
    <TipCanvas bg="#f5f4f1" color="#111111">
      <div className="flex items-end justify-between px-[64px] pt-[54px]">
        <h1 className="text-[92px] leading-none tracking-[-0.05em]" style={SERIF}>
          LOOKBOOK
        </h1>
        <span className="mb-[18px] font-mono text-[18px] tracking-[0.2em]" style={MONO}>
          VOL. 07
        </span>
      </div>
      <div className="mx-[64px] mt-[18px] h-[4px] bg-[#111]" />
      <TipSlot
        label={IMAGE.result}
        className="absolute inset-x-[64px] bottom-[64px] top-[210px]"
      />
      <p
        className="absolute bottom-[88px] left-[88px] text-[64px] text-white"
        style={{ ...SERIF, textShadow: "0 8px 24px rgba(0,0,0,0.45)" }}
      >
        Sunday light
      </p>
    </TipCanvas>
  )
}

function MagazineBa() {
  return (
    <TipCanvas bg="#111">
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <InsetAnchor>
        <div
          className="relative h-[300px] w-[240px] bg-white p-[14px]"
          style={{
            boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
            backgroundImage:
              "radial-gradient(circle at 0 8px, transparent 8px, #fff 8.5px), radial-gradient(circle at 100% 8px, transparent 8px, #fff 8.5px)",
            backgroundSize: "100% 16px",
          }}
        >
          <TipSlot label={IMAGE.original} className="absolute inset-[14px] bottom-[42px]" />
          <span
            className="absolute bottom-[10px] left-0 right-0 text-center font-mono text-[14px] tracking-[0.18em] text-[#111]"
            style={MONO}
          >
            POSTAGE
          </span>
        </div>
      </InsetAnchor>
    </TipCanvas>
  )
}

function MagazinePrompt() {
  return (
    <TipCanvas bg="#f5f4f1" color="#111">
      <div className="flex h-full">
        <TipSlot label={IMAGE.still} className="h-full w-[42%] shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col px-[48px] py-[64px]">
          <PromptLabel className="text-[#6b7280]" />
          <PromptPanel
            tone="serif"
            className="mt-[22px] flex-1 text-justify"
            minFontPx={28}
            maxFontPx={36}
            style={{ lineHeight: 1.42 }}
          />
        </div>
      </div>
    </TipCanvas>
  )
}

function MagazineCta() {
  return (
    <TipCanvas bg="#111" color="#f5f4f1">
      <TipSlot label={IMAGE.result} className="absolute inset-0 opacity-40" />
      <div className="absolute inset-0 flex flex-col justify-end px-[72px] pb-[110px]">
        <p className="font-mono text-[20px] tracking-[0.2em]" style={MONO}>
          SAVE THIS PAGE
        </p>
        <h2 className="mt-[16px] text-[64px] leading-[1.02]" style={SERIF}>
          Save + comment RECIPE
        </h2>
      </div>
    </TipCanvas>
  )
}

function TerminalCover() {
  return (
    <TipCanvas bg="#0d1117" color={TIP.phosphor}>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <div className="tip-scanlines pointer-events-none absolute inset-0" />
      <div
        className="absolute inset-x-[64px] top-[72px] border border-[#3dff8a]/50 bg-[#0d1117]/88 px-[36px] py-[28px]"
        style={MONO}
      >
        <p className="text-[20px] tracking-[0.08em] text-[#3dff8a]/70">
          user@stash:~
        </p>
        <h1 className="mt-[10px] text-[52px] font-semibold leading-[1.1]">
          $ stack --look
        </h1>
      </div>
    </TipCanvas>
  )
}

function TerminalBa() {
  return (
    <TipCanvas bg="#0d1117">
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <div className="tip-scanlines pointer-events-none absolute inset-0" />
      <InsetAnchor>
        <div
          className="relative h-[340px] w-[280px] overflow-hidden border-[6px] border-[#3dff8a] bg-black"
          style={{ boxShadow: "0 0 28px rgba(61,255,138,0.35)" }}
        >
          <TipSlot label={IMAGE.original} className="absolute inset-0" />
          <div className="tip-scanlines pointer-events-none absolute inset-0" />
          <span
            className="absolute bottom-[10px] left-0 right-0 text-center font-mono text-[16px] text-[#3dff8a]"
            style={MONO}
          >
            SRC
          </span>
        </div>
      </InsetAnchor>
    </TipCanvas>
  )
}

function TerminalPrompt() {
  return (
    <TipCanvas bg="#0d1117" color={TIP.phosphor}>
      <TipSlot label={IMAGE.still} className="h-[240px] w-full shrink-0" />
      <div className="flex min-h-0 flex-1 flex-col px-[56px] py-[40px]" style={MONO}>
        <p className="text-[20px] text-[#3dff8a]/70">~/prompt.md</p>
        <PromptPanel
          tone="mono"
          className="mt-[18px] flex-1 text-[#d1fadf]"
          minFontPx={24}
          maxFontPx={30}
        />
      </div>
    </TipCanvas>
  )
}

function TerminalCta() {
  return (
    <TipCanvas bg="#0d1117" color={TIP.phosphor}>
      <TipSlot label={IMAGE.result} className="absolute inset-0 opacity-35" />
      <div className="absolute inset-0 flex flex-col justify-end px-[72px] pb-[110px]" style={MONO}>
        <p className="text-[22px] text-[#3dff8a]/70">echo $next</p>
        <h2 className="mt-[12px] text-[56px] font-semibold">Comment STACK</h2>
      </div>
    </TipCanvas>
  )
}

function StickyCover() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <div
        className="absolute left-[64px] top-[72px] h-[340px] w-[420px] px-[36px] py-[40px] shadow-[8px_16px_0_rgba(0,0,0,0.18)]"
        style={{
          background: TIP.sticky,
          color: TIP.stickyInk,
          transform: "rotate(-4deg)",
        }}
      >
        <Hand className="text-[64px]">one tap warmer</Hand>
      </div>
    </TipCanvas>
  )
}

function StickyBa() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <InsetAnchor>
        <div
          className="relative h-[380px] w-[300px] p-[18px] pt-[22px] shadow-[10px_18px_0_rgba(0,0,0,0.16)]"
          style={{ background: TIP.sticky, transform: "rotate(7deg)" }}
        >
          <TipSlot label={IMAGE.original} className="relative h-[280px] w-full" />
          <span className="mt-[10px] block text-center text-[28px]" style={HAND}>
            original
          </span>
        </div>
      </InsetAnchor>
    </TipCanvas>
  )
}

function StickyPrompt() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.still} className="absolute inset-0" />
      <div
        className="absolute bottom-[56px] left-[56px] right-[56px] flex h-[620px] flex-col px-[40px] py-[36px]"
        style={{
          background: TIP.sticky,
          color: TIP.stickyInk,
          boxShadow: "14px 18px 0 rgba(0,0,0,0.12)",
          transform: "rotate(-1.5deg)",
        }}
      >
        <div
          className="absolute -right-[18px] -top-[18px] h-[90px] w-[90px]"
          style={{ background: "#fff3a0", transform: "rotate(8deg)" }}
        />
        <PromptLabel className="text-[#6b5420]" />
        <PromptPanel
          className="mt-[16px] flex-1"
          minFontPx={26}
          maxFontPx={32}
          style={{ color: TIP.stickyInk }}
        />
      </div>
    </TipCanvas>
  )
}

function StickyCta() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <div
        className="absolute inset-x-[80px] bottom-[90px] px-[48px] py-[48px]"
        style={{
          background: "#f7f2e2",
          color: "#1f1a12",
          clipPath:
            "polygon(0 8%, 4% 0, 96% 0, 100% 10%, 100% 100%, 0 100%)",
        }}
      >
        <h2 className="text-[56px] font-black tracking-[-0.04em]">Comment TIP</h2>
        <p className="mt-[12px] text-[28px]">torn from the pad.</p>
      </div>
    </TipCanvas>
  )
}

const GLASS: CSSProperties = {
  background: "rgba(246, 250, 255, 0.22)",
  border: "1px solid rgba(255,255,255,0.45)",
  backdropFilter: "blur(22px)",
  boxShadow: "0 18px 50px rgba(8,12,20,0.28)",
}

function GlassCover() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <div
        className="absolute left-[72px] right-[72px] top-[90px] rounded-[32px] px-[48px] py-[44px] text-white"
        style={GLASS}
      >
        <TipMark tone="dark" />
        <h1 className="mt-[22px] text-[72px] font-black leading-[0.95] tracking-[-0.045em]">
          keep the grain
        </h1>
      </div>
    </TipCanvas>
  )
}

function GlassBa() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <InsetAnchor>
        <div className="relative h-[360px] w-[280px] overflow-hidden rounded-[28px] p-[16px]" style={GLASS}>
          <TipSlot label={IMAGE.original} className="relative h-full w-full rounded-[18px]" />
        </div>
      </InsetAnchor>
    </TipCanvas>
  )
}

function GlassPrompt() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.still} className="absolute inset-0" />
      <div
        className="absolute inset-[56px] flex flex-col rounded-[36px] px-[44px] py-[40px] text-white"
        style={GLASS}
      >
        <PromptLabel className="text-white/70" />
        <PromptPanel className="mt-[18px] flex-1 text-white" minFontPx={26} maxFontPx={34} />
      </div>
    </TipCanvas>
  )
}

function GlassCta() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <div
        className="absolute bottom-[90px] left-[72px] right-[72px] rounded-full px-[40px] py-[28px] text-center text-[40px] font-black text-white"
        style={GLASS}
      >
        Comment STASH
      </div>
    </TipCanvas>
  )
}

function Sprockets({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={cn(
        "absolute top-0 flex h-full flex-col justify-between py-[28px]",
        side === "left" ? "left-[10px]" : "right-[10px]",
      )}
    >
      {Array.from({ length: 14 }, (_, index) => (
        <span
          key={index}
          className="block h-[28px] w-[28px] rounded-[4px] bg-[#d9d9d9]"
        />
      ))}
    </div>
  )
}

function FilmCover() {
  return (
    <TipCanvas bg={TIP.film} color="#f3f3f3">
      <div className="absolute inset-x-[56px] inset-y-[64px] overflow-hidden bg-black">
        <Sprockets side="left" />
        <Sprockets side="right" />
        <TipSlot
          label={IMAGE.result}
          className="absolute inset-y-[24px] left-[56px] right-[56px]"
        />
        <span
          className="absolute bottom-[36px] left-[72px] font-mono text-[22px] tracking-[0.24em]"
          style={MONO}
        >
          FRAME 01
        </span>
      </div>
    </TipCanvas>
  )
}

function FilmBa() {
  return (
    <TipCanvas bg={TIP.film}>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <InsetAnchor>
        <div className="relative h-[300px] w-[240px] overflow-hidden border-[10px] border-black bg-black">
          <Sprockets side="left" />
          <TipSlot
            label={IMAGE.original}
            className="absolute inset-y-[12px] left-[42px] right-[12px]"
          />
        </div>
      </InsetAnchor>
    </TipCanvas>
  )
}

function FilmPrompt() {
  return (
    <TipCanvas bg={TIP.film} color="#f3f3f3">
      <div className="flex h-full">
        <div className="relative w-[46%] shrink-0">
          <Sprockets side="left" />
          <TipSlot
            label={IMAGE.still}
            className="absolute inset-y-[24px] left-[52px] right-[18px]"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col px-[44px] py-[64px]">
          <PromptLabel className="text-[#a1a1aa]">FILM NOTES</PromptLabel>
          <PromptPanel className="mt-[18px] flex-1" minFontPx={26} maxFontPx={32} />
        </div>
      </div>
    </TipCanvas>
  )
}

function FilmCta() {
  return (
    <TipCanvas bg={TIP.film} color="#f3f3f3">
      <TipSlot label={IMAGE.result} className="absolute inset-0 opacity-45" />
      <div className="absolute inset-0 flex flex-col justify-end px-[72px] pb-[110px]">
        <p className="font-mono text-[20px] tracking-[0.22em]" style={MONO}>
          NEXT FRAME
        </p>
        <h2 className="mt-[12px] text-[64px] font-black tracking-[-0.04em]">
          Comment FRAME
        </h2>
      </div>
    </TipCanvas>
  )
}

function StampMark({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center border-[10px] border-[#e11d48] px-[28px] py-[10px] font-black uppercase tracking-[0.18em] text-[#e11d48]",
        className,
      )}
      style={{ transform: "rotate(-12deg)", mixBlendMode: "multiply" }}
    >
      {children}
    </span>
  )
}

function StampCover() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <Scrim />
      <StampMark className="absolute left-[90px] top-[420px] text-[92px] leading-none">
        NUDGE
      </StampMark>
    </TipCanvas>
  )
}

function StampBa() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <InsetAnchor>
        <div className="relative h-[340px] w-[270px]">
          <TipSlot label={IMAGE.original} className="absolute inset-0" />
          <StampMark className="absolute left-[18px] top-[110px] text-[28px]">
            BEFORE
          </StampMark>
        </div>
      </InsetAnchor>
    </TipCanvas>
  )
}

function StampPrompt() {
  return (
    <TipCanvas bg="#f7f4ef" color="#1c1917">
      <div className="px-[64px] pt-[72px]">
        <StampMark className="text-[42px]">PROMPT</StampMark>
      </div>
      <div className="mx-[64px] mt-[36px] mb-[64px] flex min-h-0 flex-1 flex-col border-[6px] border-[#e11d48] bg-white px-[40px] py-[32px]">
        <TipSlot label={IMAGE.still} className="mb-[24px] h-[280px] w-full shrink-0" />
        <PromptPanel className="flex-1" minFontPx={26} maxFontPx={32} />
      </div>
    </TipCanvas>
  )
}

function StampCta() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <div className="absolute inset-0 flex items-end justify-center pb-[120px]">
        <StampMark className="text-[48px]">Comment NUDGE</StampMark>
      </div>
    </TipCanvas>
  )
}

const RIBBON: CSSProperties = {
  background: "linear-gradient(90deg, #c4b5fd 0%, #6ee7b7 100%)",
  color: "#0b1220",
}

function RibbonCover() {
  return (
    <TipCanvas bg="#111827">
      <TipSlot
        label={IMAGE.result}
        className="absolute left-[90px] right-[90px] top-[210px] bottom-[210px] rounded-[28px]"
      />
      <div
        className="absolute left-0 right-0 top-[72px] flex items-center justify-center py-[28px] text-[40px] font-black tracking-[-0.03em]"
        style={RIBBON}
      >
        soft light recipe
      </div>
    </TipCanvas>
  )
}

function RibbonBa() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <InsetAnchor>
        <div className="relative h-[360px] w-[280px] p-[14px]" style={RIBBON}>
          <TipSlot label={IMAGE.original} className="relative h-full w-full" />
        </div>
      </InsetAnchor>
    </TipCanvas>
  )
}

function RibbonPrompt() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.still} className="absolute inset-0" />
      <div
        className="absolute bottom-[56px] top-[56px] right-[56px] flex w-[460px] flex-col px-[36px] py-[36px]"
        style={RIBBON}
      >
        <PromptLabel />
        <PromptPanel className="mt-[16px] flex-1" minFontPx={26} maxFontPx={32} />
      </div>
    </TipCanvas>
  )
}

function RibbonCta() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <div
        className="absolute bottom-[110px] left-[72px] rounded-full px-[40px] py-[20px] text-[32px] font-black"
        style={RIBBON}
      >
        Comment LOOK
      </div>
    </TipCanvas>
  )
}

function GridCover() {
  const cells = [
    { label: IMAGE.gridA, tease: false },
    { label: IMAGE.gridB, tease: false },
    { label: IMAGE.gridC, tease: false },
    { label: "tease", tease: true },
  ] as const

  return (
    <TipCanvas bg="#0b1220" color="#eef3f8">
      <div
        className="absolute grid gap-[18px]"
        style={{
          left: TIP_SAFE,
          right: TIP_SAFE,
          top: 180,
          bottom: TIP_SAFE,
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
        }}
      >
        {cells.map((cell) =>
          cell.tease ? (
            <div
              key="tease"
              className="flex items-center justify-center rounded-[20px] border border-dashed border-white/30 bg-white/5 text-[120px] font-black"
            >
              ?
            </div>
          ) : (
            <TipSlot
              key={cell.label}
              label={cell.label}
              className="rounded-[20px]"
            />
          ),
        )}
      </div>
      <p
        className="absolute left-[72px] top-[64px] font-mono text-[20px] tracking-[0.22em] text-white/70"
        style={MONO}
      >
        4 LOOKS · 1 MISSING
      </p>
    </TipCanvas>
  )
}

function GridBa() {
  return (
    <TipCanvas>
      <TipSlot label={IMAGE.result} className="absolute inset-0" />
      <InsetAnchor>
        <div className="relative h-[260px] w-[260px] overflow-hidden rounded-[18px] border-[6px] border-white">
          <TipSlot label={IMAGE.original} className="absolute inset-0" />
        </div>
      </InsetAnchor>
    </TipCanvas>
  )
}

function GridPrompt() {
  return (
    <TipCanvas bg="#e8eef6" color="#0b1220">
      <div className="flex h-full">
        <TipSlot label={IMAGE.still} className="h-full w-[46%] shrink-0" />
        <div
          className="relative flex min-w-0 flex-1 flex-col px-[40px] py-[56px]"
          style={{
            background: TIP.notebook,
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 47px, #93c5fd 47px, #93c5fd 48px)",
          }}
        >
          <PromptLabel className="text-[#3b82f6]" />
          <PromptPanel className="mt-[18px] flex-1" minFontPx={26} maxFontPx={32} />
        </div>
      </div>
    </TipCanvas>
  )
}

function GridCta() {
  return (
    <TipCanvas bg="#0b1220" color="#eef3f8">
      <TipSlot label={IMAGE.result} className="absolute inset-0 opacity-40" />
      <div className="absolute inset-0 flex flex-col justify-end px-[72px] pb-[110px]">
        <h2 className="text-[68px] font-black tracking-[-0.045em]">Comment GRID</h2>
        <p className="mt-[14px] text-[28px] text-white/70">get the missing cell.</p>
      </div>
    </TipCanvas>
  )
}

export const A_BAND_RENDERERS: Record<
  ASystemId,
  Record<TipSlotKey, () => ReactNode>
> = {
  "inset-polaroid-ba": {
    cover: PolaroidCover,
    "content-ba": PolaroidBa,
    "content-prompt": PolaroidPrompt,
    cta: PolaroidCta,
  },
  "split-halo": {
    cover: HaloCover,
    "content-ba": HaloBa,
    "content-prompt": HaloPrompt,
    cta: HaloCta,
  },
  "magazine-cover": {
    cover: MagazineCover,
    "content-ba": MagazineBa,
    "content-prompt": MagazinePrompt,
    cta: MagazineCta,
  },
  "terminal-prompt": {
    cover: TerminalCover,
    "content-ba": TerminalBa,
    "content-prompt": TerminalPrompt,
    cta: TerminalCta,
  },
  "sticky-note-ba": {
    cover: StickyCover,
    "content-ba": StickyBa,
    "content-prompt": StickyPrompt,
    cta: StickyCta,
  },
  "glass-card-stack": {
    cover: GlassCover,
    "content-ba": GlassBa,
    "content-prompt": GlassPrompt,
    cta: GlassCta,
  },
  "film-strip": {
    cover: FilmCover,
    "content-ba": FilmBa,
    "content-prompt": FilmPrompt,
    cta: FilmCta,
  },
  "bold-stamp": {
    cover: StampCover,
    "content-ba": StampBa,
    "content-prompt": StampPrompt,
    cta: StampCta,
  },
  "soft-gradient-ribbon": {
    cover: RibbonCover,
    "content-ba": RibbonBa,
    "content-prompt": RibbonPrompt,
    cta: RibbonCta,
  },
  "grid-hero": {
    cover: GridCover,
    "content-ba": GridBa,
    "content-prompt": GridPrompt,
    cta: GridCta,
  },
}

export function renderABand(systemId: ASystemId, slot: TipSlotKey) {
  return renderSlot(slot, A_BAND_RENDERERS[systemId])
}
