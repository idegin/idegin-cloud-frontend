"use client"

import * as React from "react"
import { ChevronsUpDown, Building2 } from "lucide-react"
import { useApp } from "@/lib/contexts/app-context"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { appData, currentOrgUser, setCurrentOrgUser } = useApp()

  const activeOrgUser = React.useMemo(() => {
    if (!appData?.organizationUsers || !currentOrgUser) return null
    return appData.organizationUsers.find((orgUser) => orgUser.id === currentOrgUser)
  }, [appData?.organizationUsers, currentOrgUser])

  const activeOrganization = activeOrgUser?.organization

  if (!activeOrganization || !appData?.organizationUsers) {
    return null
  }

  const handleOrgChange = (orgUserId: string) => {
    setCurrentOrgUser(orgUserId)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeOrganization.name}</span>
                <span className="truncate text-xs text-muted-foreground">Organization</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {appData.organizationUsers.map((orgUser) => (
              <DropdownMenuItem
                key={orgUser.id}
                onClick={() => handleOrgChange(orgUser.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Building2 className="size-3.5 shrink-0" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{orgUser.organization.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{orgUser.status}</span>
                </div>
                {orgUser.id === currentOrgUser && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
