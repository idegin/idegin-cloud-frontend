"use client"

import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ClientSidebar } from "../(components)/ClientSidebar"
import { AppProvider, useApp } from "@/lib/contexts/app-context"
import { AppLoading } from "@/components/shared/app-loading"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { useUserDependencies } from "@/lib/hooks/use-user-dependencies"
import { InvitationPopup } from "@/components/dashboard/invitation-popup"

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { setAppData } = useApp()
    const { data, isLoading, error, refetch } = useUserDependencies()

    useEffect(() => {
        if (data) {
            setAppData(data)
        }
    }, [data, setAppData])

    if (isLoading) {
        return <AppLoading />
    }

    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <SectionPlaceholder
                    variant="error"
                    title="Failed to load user data"
                    description={error instanceof Error ? error.message : "An error occurred"}
                    action={{
                        label: "Retry",
                        onClick: () => refetch(),
                    }}
                />
            </div>
        )
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <ClientSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 container mx-auto max-w-7xl px-4 w-full">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
            <InvitationPopup />
        </SidebarProvider>
    )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <DashboardContent>{children}</DashboardContent>
        </AppProvider>
    )
}
