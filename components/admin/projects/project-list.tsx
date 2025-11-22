"use client"

import { useQuery } from "@tanstack/react-query"
import { projectsApi } from "@/lib/api/projects"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import Link from "next/link"
import type { Project } from "@/lib/types"

const statusColors = {
  active: "bg-green-500/10 text-green-700 dark:text-green-400",
  inactive: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  completed: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  archived: "bg-red-500/10 text-red-700 dark:text-red-400",
}

const priorityColors = {
  low: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  medium: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  high: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  critical: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export function ProjectList() {
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsApi.getAll({ limit: 50 }),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (!data?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No projects found</p>
        <Link href="/admin/projects/new">
          <Button className="mt-4">Create First Project</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((project: Project) => (
            <TableRow key={project._id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell className="text-muted-foreground">{project.clientId}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[project.status]}>
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={priorityColors[project.priority]}>
                  {project.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(project.startDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {project.budget ? `$${project.budget.toLocaleString()}` : "-"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
