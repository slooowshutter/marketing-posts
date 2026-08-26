/**
 * Stand-in "Rubber Stamp Travel Field Notes" stills.
 *
 * Marc's real stills are the workflow output; they were not reachable from
 * this machine, so this script draws stand-ins with the SAME geometry (4:3,
 * photo left, rubber stamp + typewriter notes right), the same five places
 * and the same stamp numbers. Every carousel references them by the final
 * filename, so dropping the real stills over these is the whole swap:
 *
 *   cp <real>/067-arc-de-triomphe.jpg public/carousels/stamp-notes/
 *
 * Run with:  npm run carousel:stills
 */

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

import sharp from "sharp"

const STILL_W = 1600
const STILL_H = 1200
const PHOTO_W = 1000
const NOTE_X = PHOTO_W
const NOTE_W = STILL_W - PHOTO_W

const PAPER = "#f2ebdd"
const PAPER_EDGE = "#ddd2bd"
const INK = "#2a231c"
const INK_SOFT = "#6d6153"
const STAMP_INK = "#9d3b2c"

const MONO = "'Courier 10 Pitch','Liberation Mono','DejaVu Sans Mono',monospace"
const SERIF = "'Liberation Serif','DejaVu Serif',serif"

type Still = {
  file: string
  no: string
  place: string
  placeStamp: string
  stampFoot: string
  region: string
  coords: string
  light: string
  date: string
  notes: string[]
  aside: string
  /** Art-space y that becomes the top of the 4:3 "source photo" crop. */
  sourceTop: number
  art: string
}

/* ── drawing helpers ──────────────────────────────────────────────────── */

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function sky(id: string, stops: [number, string][]) {
  const marks = stops
    .map(([offset, color]) => `<stop offset="${offset}%" stop-color="${color}"/>`)
    .join("")
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${marks}</linearGradient>`
}

/** A jagged ridge line filled down to the bottom of the photo panel. */
function ridge(points: [number, number][], fill: string, opacity = 1) {
  const line = points.map(([x, y]) => `${x},${y}`).join(" ")
  return `<polygon points="0,${STILL_H} ${line} ${PHOTO_W},${STILL_H}" fill="${fill}" opacity="${opacity}"/>`
}

let mistId = 0

/** A soft horizontal haze band — a hard-edged rect reads as banding. */
function mist(y: number, h: number, opacity: number, color = "#ffffff") {
  const id = `mist${mistId++}`
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="${color}" stop-opacity="0"/>
  <stop offset="45%" stop-color="${color}" stop-opacity="${opacity}"/>
  <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
</linearGradient>
<rect x="0" y="${y}" width="${PHOTO_W}" height="${h}" fill="url(#${id})"/>`
}

/** Simple conifer silhouette, for the two mountain plates. */
function conifer(x: number, base: number, h: number, fill: string) {
  const w = h * 0.42
  const tiers = [0, 0.3, 0.58]
    .map((t) => {
      const top = base - h + h * t
      const spread = (w / 2) * (0.55 + t * 0.75)
      const bottom = base - h * 0.16 + h * t * 0.55
      return `<polygon points="${x},${top} ${x - spread},${bottom} ${x + spread},${bottom}" fill="${fill}"/>`
    })
    .join("")
  return `${tiers}<rect x="${x - w * 0.06}" y="${base - h * 0.2}" width="${w * 0.12}" height="${h * 0.2}" fill="${fill}"/>`
}

function windows(x: number, y: number, w: number, h: number, seed: number) {
  const cells: string[] = []
  const step = 17
  let n = seed
  for (let wy = y + 14; wy < y + h - 12; wy += step) {
    for (let wx = x + 8; wx < x + w - 10; wx += step) {
      n = (n * 1103515245 + 12345) % 2147483648
      if (n % 100 > 52) continue
      const warm = n % 3 === 0 ? "#ffd79a" : "#f2c583"
      cells.push(
        `<rect x="${wx}" y="${wy}" width="6" height="9" fill="${warm}" opacity="${0.35 + (n % 40) / 100}"/>`,
      )
    }
  }
  return cells.join("")
}

/* ── the five photo plates ────────────────────────────────────────────── */

function arcDeTriomphe() {
  const cx = 505
  const springY = 900
  const archTop = 618
  const r = 78
  return `
${sky("sky1", [
  [0, "#42557f"],
  [34, "#8d7290"],
  [58, "#d08a5f"],
  [80, "#f3c085"],
  [100, "#e7a468"],
])}
<rect x="0" y="0" width="${PHOTO_W}" height="${STILL_H}" fill="url(#sky1)"/>
<circle cx="700" cy="812" r="104" fill="#ffdfae" opacity="0.55"/>
<circle cx="700" cy="812" r="58" fill="#fff0d4" opacity="0.8"/>
${mist(760, 130, 0.16, "#ffd9a8")}
<rect x="0" y="900" width="${PHOTO_W}" height="${STILL_H - 900}" fill="#241d19"/>
<polygon points="330,900 675,900 800,${STILL_H} 205,${STILL_H}" fill="#332a24"/>
<path d="M${cx - 152},${springY} L${cx - 152},430 Q${cx - 152},404 ${cx - 126},404
         L${cx + 126},404 Q${cx + 152},404 ${cx + 152},430 L${cx + 152},${springY} Z
         M${cx - r},${springY} L${cx - r},${archTop} A${r},${r} 0 0 1 ${cx + r},${archTop}
         L${cx + r},${springY} Z"
      fill="#1d1714" fill-rule="evenodd"/>
<rect x="${cx - 152}" y="470" width="304" height="16" fill="#0f0c0a" opacity="0.5"/>
<rect x="${cx - 152}" y="836" width="304" height="10" fill="#0f0c0a" opacity="0.45"/>
<rect x="${cx - 118}" y="500" width="60" height="150" fill="#0f0c0a" opacity="0.35"/>
<rect x="${cx + 58}" y="500" width="60" height="150" fill="#0f0c0a" opacity="0.35"/>
<circle cx="245" cy="852" r="9" fill="#ffe0ad" opacity="0.9"/>
<circle cx="775" cy="852" r="9" fill="#ffe0ad" opacity="0.9"/>
<rect x="242" y="852" width="6" height="56" fill="#1d1714"/>
<rect x="772" y="852" width="6" height="56" fill="#1d1714"/>
<ellipse cx="120" cy="828" rx="118" ry="86" fill="#1b1714" opacity="0.92"/>
<ellipse cx="900" cy="820" rx="126" ry="94" fill="#1b1714" opacity="0.92"/>
${mist(896, 26, 0.2, "#ffcf9c")}`
}

function schwangau() {
  const castleX = 570
  const castleY = 534
  return `
${sky("sky2", [
  [0, "#9fc0d6"],
  [42, "#cfe0e8"],
  [78, "#eef1ec"],
  [100, "#e4e6dd"],
])}
<rect x="0" y="0" width="${PHOTO_W}" height="${STILL_H}" fill="url(#sky2)"/>
${ridge([[0, 690], [120, 596], [240, 648], [372, 520], [470, 604], [600, 548], [730, 636], [860, 566], [1000, 640]], "#a9bccb", 0.85)}
<polygon points="372,520 336,572 408,572" fill="#f4f7f8" opacity="0.9"/>
<polygon points="600,548 570,594 634,594" fill="#f4f7f8" opacity="0.85"/>
${mist(600, 96, 0.5)}
${ridge([[0, 812], [180, 742], [340, 786], [520, 700], [700, 780], [860, 736], [1000, 800]], "#7d95a4", 0.9)}
${mist(742, 82, 0.42)}
${ridge([[0, 1010], [150, 944], [330, 858], [470, 724], [596, 662], [742, 780], [880, 880], [1000, 946]], "#3b5138")}
<g>
  <rect x="${castleX - 60}" y="${castleY + 40}" width="120" height="150" fill="#efe8dc"/>
  <rect x="${castleX - 96}" y="${castleY + 92}" width="46" height="98" fill="#e6ded0"/>
  <rect x="${castleX + 52}" y="${castleY + 74}" width="52" height="116" fill="#e6ded0"/>
  <rect x="${castleX - 16}" y="${castleY - 42}" width="34" height="94" fill="#f2ece1"/>
  <polygon points="${castleX + 1},${castleY - 96} ${castleX - 22},${castleY - 40} ${castleX + 24},${castleY - 40}" fill="#5d4a48"/>
  <polygon points="${castleX - 73},${castleY + 60} ${castleX - 100},${castleY + 96} ${castleX - 46},${castleY + 96}" fill="#5d4a48"/>
  <polygon points="${castleX + 78},${castleY + 44} ${castleX + 48},${castleY + 78} ${castleX + 108},${castleY + 78}" fill="#5d4a48"/>
  <polygon points="${castleX},${castleY + 6} ${castleX - 64},${castleY + 44} ${castleX + 64},${castleY + 44}" fill="#6b5551"/>
  <rect x="${castleX - 42}" y="${castleY + 96}" width="12" height="26" fill="#4d4038"/>
  <rect x="${castleX - 8}" y="${castleY + 96}" width="12" height="26" fill="#4d4038"/>
  <rect x="${castleX + 26}" y="${castleY + 96}" width="12" height="26" fill="#4d4038"/>
</g>
${mist(830, 120, 0.34)}
${conifer(88, 1200, 300, "#22301f")}
${conifer(196, 1200, 232, "#25341f")}
${conifer(892, 1200, 268, "#22301f")}
${conifer(972, 1200, 210, "#25341f")}`
}

function snoqualmie() {
  return `
${sky("sky3", [
  [0, "#b9cbd6"],
  [46, "#dae5ea"],
  [82, "#f1f4f4"],
  [100, "#e8eceb"],
])}
<rect x="0" y="0" width="${PHOTO_W}" height="${STILL_H}" fill="url(#sky3)"/>
${ridge([[0, 604], [150, 486], [286, 560], [420, 424], [548, 528], [690, 452], [840, 546], [1000, 486]], "#aec0cb", 0.8)}
<polygon points="420,424 386,478 458,478" fill="#fbfdfd" opacity="0.95"/>
<polygon points="690,452 662,498 720,498" fill="#fbfdfd" opacity="0.9"/>
${mist(546, 74, 0.55)}
${ridge([[0, 754], [170, 664], [330, 726], [486, 616], [640, 700], [812, 640], [1000, 716]], "#89a1af", 0.92)}
${mist(688, 66, 0.45)}
${ridge([[0, 904], [190, 826], [356, 878], [520, 780], [688, 852], [852, 800], [1000, 866]], "#5f7a89")}
${mist(842, 58, 0.34)}
${ridge([[0, 1046], [200, 986], [420, 1024], [640, 962], [860, 1016], [1000, 984]], "#3d5563")}
${conifer(60, 1200, 264, "#233330")}
${conifer(142, 1200, 320, "#1e2d2b")}
${conifer(228, 1200, 232, "#233330")}
${conifer(318, 1200, 288, "#1e2d2b")}
${conifer(690, 1200, 250, "#233330")}
${conifer(778, 1200, 306, "#1e2d2b")}
${conifer(864, 1200, 238, "#233330")}
${conifer(950, 1200, 296, "#1e2d2b")}
${mist(1090, 110, 0.22)}`
}

function londonEye() {
  const cx = 512
  const cy = 566
  const r = 292
  const spokes = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#3c4349" stroke-width="3" opacity="0.85"/>`
  }).join("")
  const capsules = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2
    const x = cx + Math.cos(a) * (r + 15)
    const y = cy + Math.sin(a) * (r + 15)
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="13" ry="9" fill="#dfe4e6" stroke="#3c4349" stroke-width="2.5"/>`
  }).join("")
  return `
${sky("sky4", [
  [0, "#96a3ae"],
  [40, "#c7c2b8"],
  [72, "#eddcc2"],
  [100, "#f6e6c8"],
])}
<rect x="0" y="0" width="${PHOTO_W}" height="${STILL_H}" fill="url(#sky4)"/>
<circle cx="${cx}" cy="${cy + 60}" r="250" fill="#ffe7bd" opacity="0.35"/>
<circle cx="${cx}" cy="${cy + 90}" r="120" fill="#fff2d6" opacity="0.5"/>
<rect x="0" y="928" width="${PHOTO_W}" height="${STILL_H - 928}" fill="#6d7a82"/>
<rect x="0" y="928" width="${PHOTO_W}" height="10" fill="#4e5a61"/>
<g opacity="0.5">
  <rect x="430" y="960" width="170" height="7" fill="#f1e0c4"/>
  <rect x="452" y="1010" width="126" height="6" fill="#f1e0c4"/>
  <rect x="470" y="1064" width="92" height="5" fill="#f1e0c4"/>
  <rect x="486" y="1122" width="60" height="5" fill="#f1e0c4"/>
</g>
<rect x="0" y="880" width="${PHOTO_W}" height="50" fill="#3f464b" opacity="0.9"/>
<rect x="72" y="812" width="96" height="70" fill="#434a4f"/>
<rect x="196" y="838" width="64" height="44" fill="#3d4449"/>
<rect x="836" y="798" width="86" height="84" fill="#434a4f"/>
<rect x="760" y="842" width="58" height="40" fill="#3d4449"/>
<polygon points="${cx - 6},${cy} ${cx - 96},902 ${cx - 56},902" fill="#3c4349"/>
<polygon points="${cx + 6},${cy} ${cx + 96},902 ${cx + 56},902" fill="#3c4349"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#3c4349" stroke-width="11"/>
<circle cx="${cx}" cy="${cy}" r="${r - 17}" fill="none" stroke="#3c4349" stroke-width="4" opacity="0.75"/>
${spokes}
${capsules}
<circle cx="${cx}" cy="${cy}" r="26" fill="#3c4349"/>
${mist(884, 44, 0.2, "#ffeacb")}`
}

function newYork() {
  const towers: [number, number, number][] = [
    [24, 262, 780], [96, 190, 862], [200, 150, 700], [268, 224, 806],
    [382, 178, 592], [478, 132, 742], [566, 206, 646], [704, 158, 830],
    [800, 122, 726], [880, 190, 786],
  ]
  const blocks = towers
    .map(([x, w, y], i) => {
      const h = STILL_H - y
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${i % 2 ? "#221f26" : "#2b2730"}"/>${windows(x, y, w, h, 7 + i * 31)}`
    })
    .join("")
  return `
${sky("sky5", [
  [0, "#4d6289"],
  [30, "#9d7f8c"],
  [58, "#e0a173"],
  [82, "#f7cf9a"],
  [100, "#f2bd82"],
])}
<rect x="0" y="0" width="${PHOTO_W}" height="${STILL_H}" fill="url(#sky5)"/>
<circle cx="330" cy="742" r="126" fill="#ffdca8" opacity="0.5"/>
<circle cx="330" cy="742" r="62" fill="#fff1d3" opacity="0.75"/>
${mist(660, 150, 0.14, "#ffd7a4")}
${blocks}
<rect x="486" y="500" width="18" height="96" fill="#221f26"/>
<rect x="478" y="452" width="8" height="52" fill="#221f26"/>
<rect x="742" y="700" width="14" height="132" fill="#221f26"/>
${mist(772, 30, 0.16, "#ffd7a4")}
<rect x="0" y="1108" width="${PHOTO_W}" height="92" fill="#161419"/>`
}

/* ── the notes panel ──────────────────────────────────────────────────── */

/**
 * The roundel. Place name arcs through the band between the two rings; the
 * number and the date sit flat in the middle so both stay readable once the
 * still is scaled down into a 1080-wide slide.
 */
/**
 * Set text around a circle one glyph at a time. `sharp` rasterises through
 * librsvg, which ignores <textPath>, and monospace gives a predictable
 * advance width — so the arc is placed by hand.
 */
function arcText(
  text: string,
  radius: number,
  size: number,
  side: "top" | "bottom",
  tracking = 1,
) {
  const advance = size * 0.62 * tracking
  const step = ((advance / radius) * 180) / Math.PI
  const span = step * (text.length - 1)

  return [...text]
    .map((char, i) => {
      if (char === " ") return ""
      const angle = side === "top" ? -span / 2 + i * step : span / 2 - i * step
      const place =
        side === "top"
          ? `rotate(${angle.toFixed(2)}) translate(0 ${-radius})`
          : `rotate(${angle.toFixed(2)}) translate(0 ${radius})`
      return `<text transform="${place}" text-anchor="middle" font-family="${MONO}" font-size="${size}" font-weight="bold" fill="${STAMP_INK}">${esc(char)}</text>`
    })
    .join("")
}

function stamp(still: Still) {
  const cx = NOTE_W / 2
  const cy = 424
  const outer = 168
  const inner = 118
  const arcR = 130
  return `
<g transform="translate(${cx} ${cy}) rotate(-6)" opacity="0.9">
  <circle cx="0" cy="0" r="${outer}" fill="none" stroke="${STAMP_INK}" stroke-width="7"/>
  <circle cx="0" cy="0" r="${inner}" fill="none" stroke="${STAMP_INK}" stroke-width="3"/>
  ${arcText(still.placeStamp, arcR, 29, "top", 1.12)}
  ${arcText(still.stampFoot, arcR - 4, 21, "bottom", 1.25)}
  <line x1="-88" y1="-40" x2="88" y2="-40" stroke="${STAMP_INK}" stroke-width="3"/>
  <text x="0" y="14" text-anchor="middle" font-family="${MONO}" font-size="46" font-weight="bold" fill="${STAMP_INK}" letter-spacing="2">No. ${esc(still.no)}</text>
  <line x1="-95" y1="34" x2="95" y2="34" stroke="${STAMP_INK}" stroke-width="3"/>
  <text x="0" y="64" text-anchor="middle" font-family="${MONO}" font-size="22" fill="${STAMP_INK}" letter-spacing="5">${esc(still.date)}</text>
</g>`
}

function notesPanel(still: Still) {
  const pad = 62
  const inner = NOTE_W - pad * 2
  const rows = [
    ["PLACE", still.place],
    ["REGION", still.region],
    ["COORD", still.coords],
    ["LIGHT", still.light],
  ] as const

  const meta = rows
    .map(([label, value], i) => {
      const y = 700 + i * 46
      return `<text x="${pad}" y="${y}" font-family="${MONO}" font-size="25" fill="${INK_SOFT}" letter-spacing="2">${esc(label)}</text>
<text x="${pad + 168}" y="${y}" font-family="${MONO}" font-size="25" fill="${INK}" letter-spacing="1">${esc(value)}</text>`
    })
    .join("")

  const notes = still.notes
    .map(
      (line, i) =>
        `<text x="${pad}" y="${920 + i * 42}" font-family="${MONO}" font-size="24" fill="${INK}" letter-spacing="0.5">${esc(line)}</text>`,
    )
    .join("")

  return `
<g transform="translate(${NOTE_X} 0)">
  <rect x="0" y="0" width="${NOTE_W}" height="${STILL_H}" fill="${PAPER}"/>
  <rect x="0" y="0" width="7" height="${STILL_H}" fill="${PAPER_EDGE}"/>
  <text x="${pad}" y="106" font-family="${MONO}" font-size="24" fill="${INK_SOFT}" letter-spacing="7">FIELD NOTES</text>
  <line x1="${pad}" y1="140" x2="${pad + inner}" y2="140" stroke="${INK}" stroke-width="2" opacity="0.35"/>
  ${stamp(still)}
  <line x1="${pad}" y1="646" x2="${pad + inner}" y2="646" stroke="${INK}" stroke-width="2" opacity="0.2"/>
  ${meta}
  <line x1="${pad}" y1="872" x2="${pad + inner}" y2="872" stroke="${INK}" stroke-width="2" opacity="0.2"/>
  ${notes}
  <text x="${pad}" y="1094" font-family="${SERIF}" font-style="italic" font-size="31" fill="${INK_SOFT}">${esc(still.aside)}</text>
  <line x1="${pad}" y1="1132" x2="${pad + inner}" y2="1132" stroke="${INK}" stroke-width="2" opacity="0.2"/>
  <text x="${pad}" y="1166" font-family="${MONO}" font-size="21" fill="${INK_SOFT}" letter-spacing="4">SHEET ${esc(still.no)}</text>
</g>`
}

/* ── assembly ─────────────────────────────────────────────────────────── */

/**
 * The same plate without the notes panel: what went INTO the workflow. The
 * art is drawn in a 1000x1200 panel, so it is scaled to 1600 wide and framed
 * to the 750-tall band each scene reads best in.
 */
function sourceSvg(still: Still) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${STILL_W}" height="${STILL_H}" viewBox="0 0 ${STILL_W} ${STILL_H}">
<defs>
  <radialGradient id="vignette" cx="50%" cy="46%" r="72%">
    <stop offset="58%" stop-color="#000000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.26"/>
  </radialGradient>
</defs>
<g transform="scale(1.6) translate(0 ${-still.sourceTop})">${still.art}</g>
<rect x="0" y="0" width="${STILL_W}" height="${STILL_H}" fill="url(#vignette)"/>
</svg>`
}

function stillSvg(still: Still) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${STILL_W}" height="${STILL_H}" viewBox="0 0 ${STILL_W} ${STILL_H}">
<defs>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${Number(still.no)}"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <radialGradient id="vignette" cx="50%" cy="46%" r="72%">
    <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.34"/>
  </radialGradient>
</defs>
<rect width="${STILL_W}" height="${STILL_H}" fill="${PAPER}"/>
<g>${still.art}</g>
<rect x="0" y="0" width="${PHOTO_W}" height="${STILL_H}" fill="url(#vignette)"/>
<rect x="0" y="0" width="${PHOTO_W}" height="${STILL_H}" filter="url(#grain)" opacity="0.11"/>
${notesPanel(still)}
</svg>`
}

const STILLS: Still[] = [
  {
    file: "067-arc-de-triomphe",
    sourceTop: 230,
    no: "067",
    place: "PARIS",
    placeStamp: "ARC DE TRIOMPHE",
    stampFoot: "FRANCE",
    region: "ILE-DE-FRANCE, FR",
    coords: "48.8738N 2.2950E",
    light: "LATE AFTERNOON",
    date: "18 - 04",
    notes: [
      "Twelve avenues meet under one",
      "arch. Stood on the island for",
      "forty minutes waiting for the",
      "traffic to turn into light.",
    ],
    aside: "the sun sets straight down the axis",
    art: arcDeTriomphe(),
  },
  {
    file: "0712-schwangau",
    sourceTop: 260,
    no: "0712",
    place: "SCHWANGAU",
    placeStamp: "SCHWANGAU",
    stampFoot: "DEUTSCHLAND",
    region: "BAVARIA, DE",
    coords: "47.5576N 10.7498E",
    light: "EARLY MORNING",
    date: "07 - 12",
    notes: [
      "Mist sat in the valley until",
      "nine. The castle came out of",
      "it one tower at a time, like",
      "a picture being developed.",
    ],
    aside: "colder than the map suggested",
    art: schwangau(),
  },
  {
    file: "021-snoqualmie-mountain",
    sourceTop: 300,
    no: "021",
    place: "SNOQUALMIE",
    placeStamp: "SNOQUALMIE MTN",
    stampFoot: "WASHINGTON",
    region: "WASHINGTON, US",
    coords: "47.5453N 121.4054W",
    light: "OVERCAST NOON",
    date: "02 - 01",
    notes: [
      "Ridge behind ridge behind",
      "ridge, each one paler than",
      "the last. No horizon line,",
      "just fog deciding where to sit.",
    ],
    aside: "four layers, no colour to speak of",
    art: snoqualmie(),
  },
  {
    file: "073-london-eye",
    sourceTop: 200,
    no: "073",
    place: "LONDON",
    placeStamp: "LONDON EYE",
    stampFoot: "UNITED KINGDOM",
    region: "SOUTH BANK, UK",
    coords: "51.5033N 0.1196W",
    light: "FLAT + LOW SUN",
    date: "07 - 03",
    notes: [
      "Grey all day, then twenty",
      "minutes of sun straight",
      "through the wheel. Shot it",
      "from the far bank, hand held.",
    ],
    aside: "one rotation takes half an hour",
    art: londonEye(),
  },
  {
    file: "037-new-york-city",
    sourceTop: 380,
    no: "037",
    place: "NEW YORK CITY",
    placeStamp: "NEW YORK CITY",
    stampFoot: "NEW YORK",
    region: "NEW YORK, US",
    coords: "40.7128N 74.0060W",
    light: "GOLDEN HOUR",
    date: "03 - 07",
    notes: [
      "The windows come on before",
      "the sky goes. For ten minutes",
      "the buildings and the sunset",
      "are exactly the same colour.",
    ],
    aside: "shot from the water, going north",
    art: newYork(),
  },
]

async function main() {
  const outDir = path.join(process.cwd(), "public", "carousels", "stamp-notes")
  await mkdir(outDir, { recursive: true })

  for (const still of STILLS) {
    await sharp(Buffer.from(stillSvg(still)))
      .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
      .toFile(path.join(outDir, `${still.file}.jpg`))
    await sharp(Buffer.from(sourceSvg(still)))
      .jpeg({ quality: 86, chromaSubsampling: "4:4:4" })
      .toFile(path.join(outDir, `${still.file}-source.jpg`))
    console.log(`✓ ${still.file}.jpg + -source.jpg — ${still.place} · No. ${still.no}`)
  }

  await writeFile(
    path.join(outDir, "README.md"),
    `# Rubber Stamp Travel Field Notes — stills\n\nThese five files are STAND-INS generated by \`npm run carousel:stills\`.\nThey have the real geometry (4:3, photo left, stamp + typewriter notes\nright), the real places and the real stamp numbers, so every carousel in\n\`content/carousels/\` composes correctly — but the photo halves are drawn,\nnot photographed.\n\nTo swap in the real workflow output, overwrite these filenames and reload\nthe review page. Nothing else changes.\n\n${STILLS.map((s) => `- \`${s.file}.jpg\` — ${s.place}, No. ${s.no} (workflow result)\n- \`${s.file}-source.jpg\` — the same scene with no notes panel (workflow input)`).join("\n")}\n`,
  )
  console.log(`\n${STILLS.length} stills written to public/carousels/stamp-notes/`)
}

void main()
