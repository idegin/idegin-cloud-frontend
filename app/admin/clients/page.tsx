"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { OrganizationLoading } from "@/app/admin/clients/components/organization-loading"
import { OrganizationCard } from "@/app/admin/clients/components/organization-card"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { useOrganizations } from "@/lib/hooks/use-organizations"
import { 
    Plus, 
    Building2,
    Search,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminOrganizationsPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    const { data, isLoading, error, refetch } = useOrganizations({
        page: currentPage,
        limit: 100,
    })

    const filteredOrganizations = useMemo(() => {
        if (!data?.data) return []
        
        if (!searchQuery.trim()) return data.data

        const query = searchQuery.toLowerCase()
        return data.data.filter(org => 
            org.name.toLowerCase().includes(query) ||
            org.slug.toLowerCase().includes(query) ||
            org.owner?.name.toLowerCase().includes(query) ||
            org.owner?.email.toLowerCase().includes(query)
        )
    }, [data?.data, searchQuery])

    const paginatedOrganizations = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return filteredOrganizations.slice(startIndex, endIndex)
    }, [filteredOrganizations, currentPage, itemsPerPage])

    const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage)

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        setCurrentPage(1)
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Client Organizations</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage client organizations and their projects
                        </p>
                    </div>
                    <Button size="lg" disabled>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Organization
                    </Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search organizations..." 
                        className="pl-10 h-11"
                        disabled
                    />
                </div>
                <OrganizationLoading />
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Client Organizations</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage client organizations and their projects
                        </p>
                    </div>
                </div>
                <SectionPlaceholder
                    variant="error"
                    icon={Building2}
                    title="Failed to load organizations"
                    description="There was an error loading the organizations. Please try again."
                    action={{
                        label: "Retry",
                        onClick: () => refetch(),
                    }}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Client Organizations</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage client organizations and their projects across the platform
                    </p>
                </div>
                <Button onClick={() => router.push("/admin/clients/create")} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Organization
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by name, slug, owner name or email..." 
                    className="pl-10 h-11"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </div>

            {paginatedOrganizations.length > 0 ? (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedOrganizations.map((organization) => (
                            <OrganizationCard key={organization.id} organization={organization} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t pt-6">
                            <p className="text-sm text-muted-foreground">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrganizations.length)} of {filteredOrganizations.length} organizations
                            </p>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className="w-9"
                                                >
                                                    {page}
                                                </Button>
                                            )
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <span key={page} className="px-1">...</span>
                                        }
                                        return null
                                    })}
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <SectionPlaceholder
                    variant={searchQuery ? "info" : "default"}
                    icon={Building2}
                    title={searchQuery ? "No organizations found" : "No organizations yet"}
                    description={
                        searchQuery 
                            ? `No organizations match "${searchQuery}". Try a different search term.`
                            : "Create your first organization to start managing client projects on iDegin Cloud"
                    }
                    action={
                        searchQuery 
                            ? {
                                label: "Clear Search",
                                onClick: () => handleSearchChange(""),
                                variant: "outline",
                            }
                            : {
                                label: "Create First Organization",
                                onClick: () => router.push("/admin/clients/create"),
                            }
                    }
                />
            )}
        </div>
    )
}
