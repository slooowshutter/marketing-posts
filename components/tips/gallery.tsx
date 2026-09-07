"use client"

import type { ReactNode } from "react"

import {
  TIP_SLOT_KEYS,
  TIP_SYSTEMS,
  tipTemplateKey,
  type TipSystem,
} from "@/lib/tips/systems"
import { cn } from "@/lib/utils"

import { EMPTY_TIP_CONTENT, SLIDE_H, SLIDE_W } from "./canvas"
import { TipSlideRenderer } from "./templates"

export function ScaledSlide({
  scale,
  children,
}: {
  scale: number
  children: ReactNode
}) {
  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-[0_10px_32px_rgba(8,12,20,0.18)]"
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
        {children}
      </div>
    </div>
  )
}

function SystemRow({ system, scale }: { system: TipSystem; scale: number }) {
  return (
    <article className="border-b border-slate-200/80 py-10 last:border-b-0">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-slate-500">
            {system.band}
            {String(system.number).padStart(2, "0")} ·{" "}
            {system.status === "ready" ? "READY" : "STUB"} · {system.id}
          </p>
          <h3 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-950">
            {system.name}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {system.summary} Fit: {system.fit}.
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.12em]",
            system.status === "ready"
              ? "bg-teal-100 text-teal-900"
              : "bg-slate-200 text-slate-600",
          )}
        >
          {system.status === "ready" ? "A-BAND FILLABLE" : "SCAFFOLD"}
        </span>
      </div>
      <div className="flex snap-x gap-4 overflow-x-auto pb-2">
        {TIP_SLOT_KEYS.map((slot) => (
          <div key={slot} className="shrink-0 snap-start">
            <ScaledSlide scale={scale}>
              <TipSlideRenderer
                template={tipTemplateKey(system.id, slot)}
                content={EMPTY_TIP_CONTENT}
              />
            </ScaledSlide>
            <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-slate-500">
              {slot}
            </p>
          </div>
        ))}
      </div>
    </article>
  )
}

export function TipGallery({ scale = 0.22 }: { scale?: number }) {
  const bands = ["A", "B", "C"] as const

  return (
    <div>
      {bands.map((band) => {
        const systems = TIP_SYSTEMS.filter((system) => system.band === band)
        return (
          <section key={band} className="mt-14 first:mt-0">
            <h2 className="text-lg font-bold tracking-tight text-slate-950">
              Band {band}{" "}
              <span className="font-mono text-sm font-semibold text-slate-500">
                {band === "A"
                  ? "· ship first"
                  : band === "B"
                    ? "· ship second"
                    : "· maybe / niche"}
              </span>
            </h2>
            <div className="mt-2">
              {systems.map((system) => (
                <SystemRow key={system.id} system={system} scale={scale} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
