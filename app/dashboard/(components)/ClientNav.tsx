"use client"

import {
    type Icon,
    IconFolder,
    IconWallet
} from "@tabler/icons-react"

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

export function ClientNav() {
    const pathname = usePathname();

    const items: NavItem[] = [
        {title: "Projects", url: "/dashboard/projects", icon: IconFolder},
        {title: "Wallet", url: "/dashboard/wallet", icon: IconWallet},
    ];

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title} asChild isActive={pathname.includes(item.url)}>
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
