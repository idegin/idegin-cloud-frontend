"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface CMSBreadcrumbsProps {
    items: BreadcrumbItem[]
    maxLength?: number
}

function truncateText(text: string, maxLength: number = 20): string {
    if (text.length <= maxLength) return text
    return `${text.slice(0, maxLength)}...`
}

export function CMSBreadcrumbs({ items, maxLength = 20 }: CMSBreadcrumbsProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <BreadcrumbItem>
                            {item.href ? (
                                <BreadcrumbLink href={item.href}>
                                    {truncateText(item.label, maxLength)}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{truncateText(item.label, maxLength)}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator />}
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
