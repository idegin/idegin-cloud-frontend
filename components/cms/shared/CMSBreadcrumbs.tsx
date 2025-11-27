"use client"

import { useRouter } from "next13-progressbar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export interface CMSBreadcrumbItemType {
    label: string
    href?: string
}

interface CMSBreadcrumbsProps {
    items?: CMSBreadcrumbItemType[]
    maxLength?: number
}

function truncateText(text: string, maxLength: number = 20): string {
    if (text.length <= maxLength) return text
    return `${text.slice(0, maxLength)}...`
}

export function CMSBreadcrumbs({ items, maxLength = 20 }: CMSBreadcrumbsProps) {
    const router = useRouter()

    if (!items || items.length === 0) {
        return null
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        router.push(href)
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <BreadcrumbItem className="max-w-[150px] sm:max-w-[200px]">
                            {item.href ? (
                                <BreadcrumbLink 
                                    href={item.href}
                                    onClick={(e) => handleClick(e, item.href!)}
                                    className="truncate block"
                                    title={item.label}
                                >
                                    {truncateText(item.label, maxLength)}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage className="truncate block" title={item.label}>
                                    {truncateText(item.label, maxLength)}
                                </BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator />}
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
