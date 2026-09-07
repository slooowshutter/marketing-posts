"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronRight,
  GalleryHorizontal,
  Home,
  MonitorDot,
  Sticker,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const carouselActive = pathname.startsWith("/carousels")
  const tipsActive = pathname.startsWith("/tips")

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/" />}
              tooltip="Charlo Computer"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary font-semibold text-sidebar-primary-foreground">
                C
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Charlo Computer</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Private workspace
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/" />}
                  isActive={pathname === "/"}
                  tooltip="Overview"
                >
                  <Home />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                key={carouselActive ? "carousel-active" : "carousel-idle"}
                defaultOpen={carouselActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuButton
                        isActive={carouselActive}
                        tooltip="BlendAI Carousels"
                      />
                    }
                  >
                    <GalleryHorizontal />
                    <span className="truncate">BlendAI Carousels</span>
                    <ChevronRight className="ml-auto transition-transform [[data-open]_&]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={<Link href="/carousels" />}
                          isActive={
                            pathname === "/carousels" ||
                            pathname.startsWith("/carousels/posts/")
                          }
                        >
                          <span>Posts</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={<Link href="/carousels/templates" />}
                          isActive={pathname === "/carousels/templates"}
                        >
                          <span>Templates</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <Collapsible
                key={tipsActive ? "tips-active" : "tips-idle"}
                defaultOpen={tipsActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuButton
                        isActive={tipsActive}
                        tooltip="Tip templates"
                      />
                    }
                  >
                    <Sticker />
                    <span className="truncate">Tip templates</span>
                    <ChevronRight className="ml-auto transition-transform [[data-open]_&]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={<Link href="/tips" />}
                          isActive={
                            pathname === "/tips" ||
                            pathname.startsWith("/tips/posts/")
                          }
                        >
                          <span>Posts</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={<Link href="/tips/templates" />}
                          isActive={pathname === "/tips/templates"}
                        >
                          <span>Gallery</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Local studio">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <MonitorDot className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Local studio</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Files are the database
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
