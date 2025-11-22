"use client"

import {
    IconCirclePlusFilled,
    IconMail,
    type Icon,
    IconDashboard,
    IconUsers, IconBuilding
} from "@tabler/icons-react"

import {Button} from "@/components/ui/button"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
    title: string
    url: string
    icon?: Icon
}

export function AdminNav() {
    const pathname = usePathname();

    const items: NavItem[] = [
        {title: "Dashboard", url: "/admin", icon: IconDashboard},
        {title: "Clients", url: "/admin/clients", icon: IconBuilding},
        {title: "Admin users", url: "/admin/users", icon: IconUsers},
    ];

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <SidebarMenuButton
                            tooltip="Create Project"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                            asChild
                        >
                            <Link href="/admin/create">
                                <IconCirclePlusFilled/>
                                <span>Create Project</span>
                            </Link>
                        </SidebarMenuButton>
                        <Button
                            size="icon"
                            className="size-8 group-data-[collapsible=icon]:opacity-0"
                            variant="outline"
                        >
                            <IconMail/>
                            <span className="sr-only">Inbox</span>
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title} asChild isActive={pathname === item.url}>
                                <Link href={item.url} className="flex items-center gap-2">
                                    {item.icon && <item.icon/>}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
