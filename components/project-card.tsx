"use client";

import { useRouter } from "next13-progressbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreVertical,
    Activity,
    Server,
    ArrowUpRight,
    Clock,
} from "lucide-react";
import { Project as ProjectType } from "@/lib/api/models/Project";

interface ProjectCardProps {
    project: ProjectType & {
        client: {
            name: string;
            email: string;
            avatar?: string;
        };
    };
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case "running":
            return {
                color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
                icon: Activity,
                label: "Running",
                borderColor: "rgb(34 197 94)",
            };
        case "stopped":
            return {
                color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
                icon: Server,
                label: "Stopped",
                borderColor: "rgb(156 163 175)",
            };
        case "deploying":
            return {
                color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
                icon: ArrowUpRight,
                label: "Deploying",
                borderColor: "rgb(59 130 246)",
            };
        case "error":
            return {
                color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
                icon: Activity,
                label: "Error",
                borderColor: "rgb(239 68 68)",
            };
        default:
            return {
                color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
                icon: Server,
                label: status,
                borderColor: "rgb(156 163 175)",
            };
    }
};

export function ProjectCard({ project }: ProjectCardProps) {
    const router = useRouter();
    const statusConfig = getStatusConfig(project.status || "");
    const StatusIcon = statusConfig.icon;

    const handleCardClick = () => {
        router.push(`/admin/projects/${project._id}`);
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Card
            className='overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-l-4 relative py-0'
            style={{ borderLeftColor: statusConfig.borderColor }}
            onClick={handleCardClick}
        >
            <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

            <div className='relative p-6 space-y-5'>
                <div className='flex items-start justify-between'>
                    <div className='space-y-3 flex-1 min-w-0'>
                        <h3 className='font-semibold text-xl leading-tight group-hover:text-primary transition-colors'>
                            {project?.projectName}
                        </h3>
                        <Badge
                            variant='outline'
                            className={`${statusConfig.color} text-xs font-medium`}
                        >
                            <StatusIcon className='h-3 w-3 mr-1.5' />
                            {statusConfig.label}
                        </Badge>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={handleMenuClick}>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='h-9 w-9 -mt-1 hover:bg-muted'
                            >
                                <MoreVertical className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align='end'
                            className='w-48'
                            onClick={handleMenuClick}
                        >
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>
                                Manage Resources
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Logs</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='text-destructive'>
                                Terminate
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <p className='text-sm text-muted-foreground line-clamp-3 leading-relaxed'>
                    {project.description}
                </p>

                <div className='flex items-center justify-between pt-5 border-t'>
                    <div className='flex items-center gap-3'>
                        <Avatar className='h-10 w-10 ring-2 ring-background shadow-sm'>
                            <AvatarImage src={project.client.avatar} />
                            <AvatarFallback className='text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/10'>
                                {project.client.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <span className='text-sm font-semibold'>
                                {project.client.name}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                                {project.client.email}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
