import type { Metadata } from "next"
import { Caveat, Geist, Instrument_Serif } from "next/font/google"

import { IgPostLab } from "@/components/carousels/ig-post-lab"

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
  title: "Blend · IG Post Lab",
  description: "Instagram slide templates in the Newport palette.",
  robots: { index: false, follow: false },
}

export default function TemplatesPage() {
  return (
    <IgPostLab
      fontClassName={`${geist.variable} ${instrumentSerif.variable} ${caveat.variable}`}
    />
  )
}
