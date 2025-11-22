"use client"
import { useApp } from '@/lib/contexts/app-context'
import { ProjectProvider } from '@/lib/contexts/project-context'
import { useParams } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
}

export default function layout({ children }: Props) {
    const { appData, currentOrgUser, setCurrentOrgUser } = useApp()
    const { id } = useParams();


    const activeOrgUser = React.useMemo(() => {
        if (!appData?.organizationUsers || !currentOrgUser) return null
        return appData.organizationUsers.find((orgUser) => orgUser.id === currentOrgUser)
    }, [appData?.organizationUsers, currentOrgUser])

    const activeOrganization = activeOrgUser?.organization

    if (!activeOrganization || !appData?.organizationUsers) {
        return null
    }


    return (
        <>
            <ProjectProvider projectId={`${id}`} clientId={activeOrganization.id}>{children}</ProjectProvider>
        </>
    )
}