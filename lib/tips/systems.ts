export const TIP_SLOT_KEYS = [
  "cover",
  "content-ba",
  "content-prompt",
  "cta",
] as const

export type TipSlotKey = (typeof TIP_SLOT_KEYS)[number]

export const INSET_POSITIONS = ["br", "bl", "tr", "tl"] as const

export type InsetPosition = (typeof INSET_POSITIONS)[number]

export const TIP_BANDS = ["A", "B", "C"] as const

export type TipBand = (typeof TIP_BANDS)[number]

export type TipSystemStatus = "ready" | "stub"

export type TipSystem = {
  id: string
  band: TipBand
  number: number
  status: TipSystemStatus
  name: string
  fit: string
  summary: string
  ctaKeyword: string
}

export const TIP_SYSTEMS = [
  {
    id: "inset-polaroid-ba",
    band: "A",
    number: 1,
    status: "ready",
    name: "Inset Polaroid BA",
    fit: "Edit Nudge, Shot Swap",
    summary:
      "Full-bleed result with a handwritten title strip. Polaroid-frame original on the BA slide. Charcoal monospace prompt panel.",
    ctaKeyword: "PROMPT",
  },
  {
    id: "split-halo",
    band: "A",
    number: 2,
    status: "ready",
    name: "Split Halo",
    fit: "Look Recipe",
    summary:
      "Circular crop of the result on a dark field with a one-word title. Original as a halo circle. Prompt in a soft rounded card.",
    ctaKeyword: "LOOK",
  },
  {
    id: "magazine-cover",
    band: "A",
    number: 3,
    status: "ready",
    name: "Magazine Cover",
    fit: "Look Recipe, Prompt Kitchen",
    summary:
      "Serif masthead over a hero still. Postage-stamp original. Column layout with justified serif prompt.",
    ctaKeyword: "RECIPE",
  },
  {
    id: "terminal-prompt",
    band: "A",
    number: 4,
    status: "ready",
    name: "Terminal Prompt",
    fit: "Prompt Stash, Prompt Kitchen",
    summary:
      "Green terminal overlay on the result. CRT inset for the original. Full-height scrolling code prompt under a sticky still strip.",
    ctaKeyword: "STACK",
  },
  {
    id: "sticky-note-ba",
    band: "A",
    number: 5,
    status: "ready",
    name: "Sticky Note BA",
    fit: "Edit Nudge",
    summary:
      "Oversized sticky title on the cover. Tilted sticky original. Overlapping sticky stack for a long prompt.",
    ctaKeyword: "TIP",
  },
  {
    id: "glass-card-stack",
    band: "A",
    number: 6,
    status: "ready",
    name: "Glass Card Stack",
    fit: "Prompt Stash",
    summary:
      "Frosted glass card over the still. Glass holds the original inset. Blurred-background glass panel for the prompt.",
    ctaKeyword: "STASH",
  },
  {
    id: "film-strip",
    band: "A",
    number: 7,
    status: "ready",
    name: "Film Strip",
    fit: "Shot Swap, Look Recipe",
    summary:
      "35mm frame with sprocket edge. Original peeks as the next frame. Prompt as scrolling film notes.",
    ctaKeyword: "FRAME",
  },
  {
    id: "bold-stamp",
    band: "A",
    number: 8,
    status: "ready",
    name: "Bold Stamp",
    fit: "Edit Nudge",
    summary:
      "Huge rubber-stamp word over the still. BEFORE stamp on the inset. Stamp header plus scrolling prompt body.",
    ctaKeyword: "NUDGE",
  },
  {
    id: "soft-gradient-ribbon",
    band: "A",
    number: 9,
    status: "ready",
    name: "Soft Gradient Ribbon",
    fit: "Look Recipe, Prompt Kitchen",
    summary:
      "Pastel gradient ribbon across a centered still. Ribbon wraps the original inset and becomes a scrolling sidebar.",
    ctaKeyword: "LOOK",
  },
  {
    id: "grid-hero",
    band: "A",
    number: 10,
    status: "ready",
    name: "Grid Hero",
    fit: "Prompt Stash",
    summary:
      "2×2 results with one “?” tease cell. Hero-bleed BA with original in a grid cell. Ruled-notebook prompt.",
    ctaKeyword: "GRID",
  },
  {
    id: "neon-outline",
    band: "B",
    number: 1,
    status: "stub",
    name: "Neon Outline",
    fit: "Look Recipe",
    summary: "Dark still, neon contour title, neon-box original, neon-border prompt scroll.",
    ctaKeyword: "GLOW",
  },
  {
    id: "newspaper-clip",
    band: "B",
    number: 2,
    status: "stub",
    name: "Newspaper Clip",
    fit: "Prompt Kitchen",
    summary: "Newsprint texture, clipped-photo inset, classifieds-column prompt.",
    ctaKeyword: "CLIP",
  },
  {
    id: "app-sheet",
    band: "B",
    number: 3,
    status: "stub",
    name: "App Sheet",
    fit: "Edit Nudge, Shot Swap",
    summary: "Fake iOS sheet over the still; sheet peels for original and scrolls the prompt.",
    ctaKeyword: "NUDGE",
  },
  {
    id: "zine-xerox",
    band: "B",
    number: 4,
    status: "stub",
    name: "Zine Xerox",
    fit: "Prompt Kitchen",
    summary: "High-contrast photocopy vibe with taped original and typewritten prompt.",
    ctaKeyword: "XEROX",
  },
  {
    id: "moodboard-pin",
    band: "B",
    number: 5,
    status: "stub",
    name: "Moodboard Pin",
    fit: "Look Recipe",
    summary: "Cork background, pinned still, pinned-note prompt scroll.",
    ctaKeyword: "MOOD",
  },
  {
    id: "recipe-card",
    band: "B",
    number: 6,
    status: "stub",
    name: "Recipe Card",
    fit: "Look Recipe, Prompt Kitchen",
    summary: "Index-card chrome; ingredients photo inset; method steps as a long scroll.",
    ctaKeyword: "RECIPE",
  },
  {
    id: "swipe-arrow-rail",
    band: "B",
    number: 7,
    status: "stub",
    name: "Swipe Arrow Rail",
    fit: "Shot Swap",
    summary: "Big arrow from original to result; rail beside the still for prompt text.",
    ctaKeyword: "SWAP",
  },
  {
    id: "soft-shadow-studio",
    band: "B",
    number: 8,
    status: "stub",
    name: "Soft Shadow Studio",
    fit: "Prompt Stash (premium)",
    summary: "Clean white, soft-shadow card inset, mono prompt scroll, quiet CTA.",
    ctaKeyword: "STASH",
  },
  {
    id: "comic-caption",
    band: "B",
    number: 9,
    status: "stub",
    name: "Comic Caption",
    fit: "Edit Nudge",
    summary: "Comic caption box labels BEFORE and grows into a scrolling prompt panel.",
    ctaKeyword: "NUDGE",
  },
  {
    id: "lut-chip-row",
    band: "B",
    number: 10,
    status: "stub",
    name: "LUT Chip Row",
    fit: "Edit Nudge, Look Recipe",
    summary: "LUT chips under the still; SRC chip on the inset; chips as prompt headers.",
    ctaKeyword: "LUT",
  },
  {
    id: "map-pin-transform",
    band: "C",
    number: 1,
    status: "stub",
    name: "Map Pin Transform",
    fit: "Shot Swap travel",
    summary: "Location-pin aesthetic for travel tips. Hold until Marc picks brands.",
    ctaKeyword: "PIN",
  },
  {
    id: "candy-pop",
    band: "C",
    number: 2,
    status: "stub",
    name: "Candy Pop",
    fit: "Prompt Stash fun",
    summary: "Hyper-saturated candy-world energy. Loud; use sparingly.",
    ctaKeyword: "CANDY",
  },
  {
    id: "crayon-doodle",
    band: "C",
    number: 3,
    status: "stub",
    name: "Crayon Doodle",
    fit: "Prompt Kitchen beginner",
    summary: "Marker overlay with a plain prompt panel so long text stays readable.",
    ctaKeyword: "DOODLE",
  },
  {
    id: "geometric-poster",
    band: "C",
    number: 4,
    status: "stub",
    name: "Geometric Poster",
    fit: "Look Recipe poster series",
    summary: "City/landmark geometric cover. Weaker for editing tips.",
    ctaKeyword: "POSTER",
  },
  {
    id: "vanity-mirror",
    band: "C",
    number: 5,
    status: "stub",
    name: "Vanity Mirror",
    fit: "Look Recipe beauty",
    summary: "Mirror-chrome frame. Narrow selfie niche.",
    ctaKeyword: "MIRROR",
  },
  {
    id: "hairstyle-grid-cover",
    band: "C",
    number: 6,
    status: "stub",
    name: "Hairstyle Grid Cover",
    fit: "Look Recipe",
    summary: "Multi-panel cover only; content slides stay BA/prompt. Distinct from Grid Hero.",
    ctaKeyword: "GRID",
  },
  {
    id: "duotone-poster",
    band: "C",
    number: 7,
    status: "stub",
    name: "Duotone Poster",
    fit: "Prompt Stash",
    summary: "Two-ink print look. Test contrast on the BA inset.",
    ctaKeyword: "PRINT",
  },
  {
    id: "blueprint",
    band: "C",
    number: 8,
    status: "stub",
    name: "Blueprint",
    fit: "Prompt Kitchen structure tips",
    summary: "Cyanotype/blueprint lines. Niche tech structure tips.",
    ctaKeyword: "PLAN",
  },
  {
    id: "sticker-bomb",
    band: "C",
    number: 9,
    status: "stub",
    name: "Sticker Bomb",
    fit: "Prompt Stash GenZ",
    summary: "Stickers around the still. Risk of clutter vs long prompt.",
    ctaKeyword: "STICKER",
  },
  {
    id: "lower-third-broadcast",
    band: "C",
    number: 10,
    status: "stub",
    name: "Lower-Third Broadcast",
    fit: "Edit Nudge newsy tips",
    summary: "News lower-third bar. Clear hierarchy; less tip-account warmth.",
    ctaKeyword: "TIP",
  },
] as const satisfies readonly TipSystem[]

export type TipSystemId = (typeof TIP_SYSTEMS)[number]["id"]

export type ASystemId = Extract<(typeof TIP_SYSTEMS)[number], { band: "A" }>["id"]

export const A_SYSTEM_IDS = TIP_SYSTEMS.filter(
  (system): system is Extract<(typeof TIP_SYSTEMS)[number], { band: "A" }> =>
    system.band === "A",
).map((system) => system.id)

export const TIP_SYSTEMS_BY_ID: Record<string, TipSystem> = Object.fromEntries(
  TIP_SYSTEMS.map((system) => [system.id, system]),
)

export function tipTemplateKey(systemId: string, slot: TipSlotKey) {
  return `${systemId}-${slot}`
}

export const TIP_TEMPLATE_KEYS = TIP_SYSTEMS.flatMap((system) =>
  TIP_SLOT_KEYS.map((slot) => tipTemplateKey(system.id, slot)),
) as [string, ...string[]]

export type TipTemplateKey = (typeof TIP_TEMPLATE_KEYS)[number]

const SLOT_SUFFIXES = ["content-prompt", "content-ba", "cover", "cta"] as const

export function parseTipTemplateKey(template: string): {
  systemId: string
  slot: TipSlotKey
} | null {
  for (const slot of SLOT_SUFFIXES) {
    const suffix = `-${slot}`
    if (!template.endsWith(suffix)) continue
    const systemId = template.slice(0, -suffix.length)
    if (!TIP_SYSTEMS_BY_ID[systemId]) return null
    return { systemId, slot }
  }
  return null
}

export function getTipSystem(id: string) {
  return TIP_SYSTEMS_BY_ID[id] ?? null
}

export function isTipSlotKey(value: string): value is TipSlotKey {
  return (TIP_SLOT_KEYS as readonly string[]).includes(value)
}

export function numberedContentSlot(base: "content-ba" | "content-prompt", n: number) {
  if (n <= 1) return base
  return `${base}-${n}` as const
}

export function slotFromSlideId(slideId: string): TipSlotKey | null {
  if (slideId === "cover" || slideId === "cta") return slideId
  if (slideId === "content-ba" || /^content-ba-\d+$/.test(slideId)) return "content-ba"
  if (slideId === "content-prompt" || /^content-prompt-\d+$/.test(slideId)) {
    return "content-prompt"
  }
  return null
}
