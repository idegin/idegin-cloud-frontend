"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Plane } from "lucide-react"

interface FlyProject {
    id: string
    name: string
    description: string
}

interface FlyProjectsStepProps {
    projects: FlyProject[]
    onChange: (projects: FlyProject[]) => void
}

export function FlyProjectsStep({ projects, onChange }: FlyProjectsStepProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newProject, setNewProject] = useState({ name: "", description: "" })

    const handleAddProject = () => {
        if (newProject.name.trim()) {
            const project: FlyProject = {
                id: Date.now().toString(),
                name: newProject.name,
                description: newProject.description,
            }
            onChange([...projects, project])
            setNewProject({ name: "", description: "" })
            setIsDialogOpen(false)
        }
    }

    const handleRemoveProject = (id: string) => {
        onChange(projects.filter(p => p.id !== id))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Fly.io Projects</h3>
                    <p className="text-sm text-muted-foreground">
                        Add Fly.io project IDs associated with this project
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Fly Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Fly.io Project</DialogTitle>
                            <DialogDescription>
                                Enter the Fly.io project ID and optional description
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="fly-name" className="text-sm font-medium">
                                    Project ID
                                </Label>
                                <Input
                                    id="fly-name"
                                    placeholder="e.g., my-app-production"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fly-description" className="text-sm font-medium">
                                    Description (Optional)
                                </Label>
                                <Textarea
                                    id="fly-description"
                                    placeholder="e.g., Production environment for main application"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="min-h-[100px] resize-none"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddProject} disabled={!newProject.name.trim()}>
                                Add Project
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {projects.length > 0 ? (
                <div className="space-y-3">
                    {projects.map((project) => (
                        <Card key={project.id} className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Plane className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-base">{project.name}</h4>
                                    {project.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {project.description}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => handleRemoveProject(project.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-12 border-dashed">
                    <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                            <Plane className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No Fly.io projects added</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Add at least one Fly.io project to continue
                        </p>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Project
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    )
}

