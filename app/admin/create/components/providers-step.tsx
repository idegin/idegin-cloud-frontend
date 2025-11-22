"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Plane, Globe, Boxes, Zap } from "lucide-react"

export type Provider = "fly" | "mortar-studio"

interface ProviderProject {
    id: string
    provider: Provider
    projectId: string
    description: string
}

interface ProvidersStepProps {
    projects: ProviderProject[]
    onChange: (projects: ProviderProject[]) => void
}

const PROVIDERS = [
    { value: "fly" as Provider, label: "Fly.io", icon: Plane },
    { value: "mortar-studio" as Provider, label: "Mortar Studio", icon: Boxes },
]

const formSchema = z.object({
    provider: z.enum(["fly", "mortar-studio"], {
        required_error: "Please select a provider",
    }),
    projectId: z.string()
        .min(1, "Project ID is required")
        .min(3, "Project ID must be at least 3 characters")
        .max(100, "Project ID must be less than 100 characters")
        .regex(/^[a-zA-Z0-9-_]+$/, "Project ID can only contain letters, numbers, hyphens, and underscores"),
    description: z.string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
})

export function ProvidersStep({ projects, onChange }: ProvidersStepProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            provider: "fly",
            projectId: "",
            description: "",
        },
    })

    const handleAddProject = (values: z.infer<typeof formSchema>) => {
        const project: ProviderProject = {
            id: Date.now().toString(),
            provider: values.provider,
            projectId: values.projectId,
            description: values.description || "",
        }
        onChange([...projects, project])
        form.reset()
        setIsDialogOpen(false)
    }

    const handleRemoveProject = (id: string) => {
        onChange(projects.filter(p => p.id !== id))
    }

    const getProviderIcon = (provider: Provider) => {
        const providerData = PROVIDERS.find(p => p.value === provider)
        return providerData?.icon || Globe
    }

    const getProviderLabel = (provider: Provider) => {
        const providerData = PROVIDERS.find(p => p.value === provider)
        return providerData?.label || provider
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Provider Projects</h3>
                    <p className="text-sm text-muted-foreground">
                        Add hosting provider projects associated with this project
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Provider
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Provider Project</DialogTitle>
                            <DialogDescription>
                                Select a provider and enter the project ID
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleAddProject)} className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="provider"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Provider</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11">
                                                        <SelectValue placeholder="Select a provider" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PROVIDERS.map((provider) => {
                                                        const Icon = provider.icon
                                                        return (
                                                            <SelectItem key={provider.value} value={provider.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <Icon className="h-4 w-4" />
                                                                    <span>{provider.label}</span>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="projectId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project ID</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., my-app-production"
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Only letters, numbers, hyphens, and underscores allowed
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="e.g., Production environment for main application"
                                                    className="min-h-[100px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => {
                                            form.reset()
                                            setIsDialogOpen(false)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Add Project
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {projects.length > 0 ? (
                <div className="space-y-3">
                    {projects.map((project) => {
                        const Icon = getProviderIcon(project.provider)
                        return (
                            <Card key={project.id} className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-base font-mono">{project.projectId}</h4>
                                            <span className="text-xs bg-muted px-2 py-0.5 rounded-md">
                                                {getProviderLabel(project.provider)}
                                            </span>
                                        </div>
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
                        )
                    })}
                </div>
            ) : (
                <Card className="p-12 border-dashed">
                    <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                            <Globe className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No provider projects added</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Add at least one provider project to continue
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
