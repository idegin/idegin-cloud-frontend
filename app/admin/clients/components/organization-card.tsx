"use client"

import { useRouter } from "next13-progressbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
    MoreVertical,
    Building2,
    Users,
    FolderKanban
} from "lucide-react"
import type { Organization } from "@/lib/api/organizations"

interface OrganizationCardProps {
    organization: Organization
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
    const router = useRouter()

    const handleCardClick = () => {
        router.push(`/admin/clients/${organization.id}`)
    }

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
    }
    
    return (
        <Card 
            className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-l-4 border-l-primary relative py-0"
            onClick={handleCardClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-6 space-y-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1 min-w-0">
                        <h3 className="font-semibold text-xl leading-tight group-hover:text-primary transition-colors">
                            {organization.name}
                        </h3>
                        <Badge 
                            variant="outline" 
                            className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs font-medium"
                        >
                            <Building2 className="h-3 w-3 mr-1.5" />
                            Active
                        </Badge>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={handleMenuClick}>
                            <Button variant="ghost" size="icon" className="h-9 w-9 -mt-1 hover:bg-muted">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48" onClick={handleMenuClick}>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Manage Users</DropdownMenuItem>
                            <DropdownMenuItem>View Projects</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit Organization</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center justify-between pt-5 border-t">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                            <AvatarImage src={undefined} />
                            <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                                {organization.owner ? getInitials(organization.owner.name) : getInitials(organization.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                                {organization.owner?.name || 'Unknown Owner'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {organization.owner?.email || 'No email'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4" />
                        <span>{organization._count?.projects || 0} Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{organization._count?.organizationUsers || 0} Users</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}
