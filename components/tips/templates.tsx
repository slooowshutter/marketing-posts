"use client"

import type { ReactNode } from "react"

import type { TipSlideContent } from "@/lib/tips/schema"
import {
  type ASystemId,
  type TipSlotKey,
  type TipSystem,
  TIP_SLOT_KEYS,
  TIP_SYSTEMS,
  getTipSystem,
  parseTipTemplateKey,
  tipTemplateKey,
} from "@/lib/tips/systems"

import {
  EMPTY_TIP_CONTENT,
  TipContentContext,
} from "./canvas"
import { renderABand } from "./systems-a"
import { StubSlide } from "./systems-stubs"

export { SLIDE_H, SLIDE_W } from "./canvas"

export type TipSlideTemplate = {
  key: string
  systemId: string
  slot: TipSlotKey
  name: string
  note: string
  status: TipSystem["status"]
  band: TipSystem["band"]
}

function slotName(slot: TipSlotKey) {
  switch (slot) {
    case "cover":
      return "Cover"
    case "content-ba":
      return "Content · before/after"
    case "content-prompt":
      return "Content · image + prompt"
    case "cta":
      return "CTA"
    default: {
      const _never: never = slot
      return _never
    }
  }
}

export const TIP_SLIDE_TEMPLATES: TipSlideTemplate[] = TIP_SYSTEMS.flatMap(
  (system) =>
    TIP_SLOT_KEYS.map((slot) => ({
      key: tipTemplateKey(system.id, slot),
      systemId: system.id,
      slot,
      name: `${system.name} · ${slotName(slot)}`,
      note: system.summary,
      status: system.status,
      band: system.band,
    })),
)

const TEMPLATES_BY_KEY = new Map(
  TIP_SLIDE_TEMPLATES.map((template) => [template.key, template]),
)

export function getTipSlideTemplate(key: string) {
  return TEMPLATES_BY_KEY.get(key)
}

function renderSystemSlot(system: TipSystem, slot: TipSlotKey): ReactNode {
  if (system.status === "ready") {
    return renderABand(system.id as ASystemId, slot)
  }
  return <StubSlide system={system} slot={slot} />
}

export function TipSlideRenderer({
  template,
  content = EMPTY_TIP_CONTENT,
}: {
  template: string
  content?: TipSlideContent
}) {
  const parsed = parseTipTemplateKey(template)
  if (!parsed) return null
  const system = getTipSystem(parsed.systemId)
  if (!system) return null

  return (
    <TipContentContext.Provider value={content}>
      <div
        data-tip-system={system.id}
        data-tip-slot={parsed.slot}
        data-tip-status={system.status}
      >
        {renderSystemSlot(system, parsed.slot)}
      </div>
    </TipContentContext.Provider>
  )
}
