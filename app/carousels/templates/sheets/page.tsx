import type { Metadata } from "next"
import { Caveat, Geist, Instrument_Serif } from "next/font/google"

import { TemplateSheets } from "@/components/carousels/template-sheets"

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-ig-serif",
})

const caveat = Caveat({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ig-hand",
})

export const metadata: Metadata = {
  title: "Blend · IG template sheets",
  description: "Exportable contact sheets of the IG slide templates.",
  robots: { index: false, follow: false },
}

export default function SheetsPage() {
  return (
    <div
      className={`${geist.variable} ${instrumentSerif.variable} ${caveat.variable}`}
    >
      <TemplateSheets />
    </div>
  )
}
