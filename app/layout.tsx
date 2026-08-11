import type { Metadata } from "next"
import {
  Caveat,
  Geist_Mono,
  Instrument_Serif,
  Manrope,
} from "next/font/google"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import "./globals.css"

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
  title: {
    default: "Charlo Computer",
    template: "%s · Charlo Computer",
  },
  description:
    "A private local workspace for Charlo projects and agent-generated work.",
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        manrope.variable,
        geistMono.variable,
        instrumentSerif.variable,
        caveat.variable,
      )}
    >
      <body className="min-h-full bg-[#efeae1] font-sans antialiased">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-w-0 overflow-x-hidden">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
