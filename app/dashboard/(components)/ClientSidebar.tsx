"use client"

import * as React from "react"
import { useApp } from "@/lib/contexts/app-context"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ClientNav } from "./ClientNav"

export function ClientSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { appData } = useApp()

  const user = React.useMemo(() => {
    if (!appData?.user) {
      return {
        name: "Loading...",
        email: "",
        avatar: "",
      }
    }
    const initials = appData.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    return {
      name: appData.user.name,
      email: appData.user.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`,
    }
  }, [appData?.user])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <ClientNav />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
