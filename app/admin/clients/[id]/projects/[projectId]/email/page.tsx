"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import EmailList from "@/components/email/EmailList"
import { EmailListLoading } from "@/components/email/email-list-loading"

export default function EmailPage() {
    const params = useParams()
    const router = useRouter()
    const clientId = params.id as string
    const projectId = params.projectId as string
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    const handleRefresh = () => {
        console.log("Refreshing email list...")
    }

    const handleSearch = (searchQuery: string) => {
        console.log("Searching:", searchQuery)
    }

    const handleBack = () => {
        router.push(`/admin/clients/${clientId}/projects/${projectId}`)
    }

    if (isLoading) {
        return <EmailListLoading />
    }

    return (
        <EmailList
            onRefresh={handleRefresh}
            onSearch={handleSearch}
            onBack={handleBack}
            projectId={projectId}
            baseUrl={`/admin/clients/${clientId}/projects/${projectId}/email`}
        />
    )
}
