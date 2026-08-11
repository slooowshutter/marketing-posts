import type { ReactNode } from "react"

import { SidebarTrigger } from "@/components/ui/sidebar"

export function PageHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow?: string
  title: string
  actions?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b border-stone-200/70 bg-[#f8f5ef]/88 px-4 backdrop-blur-xl md:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger />
        <div className="min-w-0">
          {eyebrow && (
            <p className="truncate font-mono text-[9px] font-bold tracking-[0.18em] text-stone-400">
              {eyebrow}
            </p>
          )}
          <h1 className="truncate text-sm font-bold tracking-[-0.01em] text-stone-900">
            {title}
          </h1>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
