"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, FolderOpen } from "lucide-react"
import Link from "next/link"

interface SuccessStateProps {
    projectName: string
    onCreateAnother: () => void
}

export function SuccessState({ projectName, onCreateAnother }: SuccessStateProps) {
    return (
        <div className="container mx-auto max-w-2xl px-4">
            <Card className="border-border/40 shadow-lg overflow-hidden py-0">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                            <div className="relative h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center ring-8 ring-primary/5">
                                <CheckCircle2 className="h-10 w-10 text-primary" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Project Created Successfully!
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                <span className="font-semibold text-foreground">"{projectName}"</span> has been created and is ready to use.
                            </p>
                        </div>

                        <div className="w-full max-w-md space-y-3 pt-4">
                            <div className="grid grid-cols-1 gap-3">
                                <Card className="p-4 bg-card border-border/50">
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-medium text-sm">Project Configured</p>
                                            <p className="text-xs text-muted-foreground">All settings have been saved</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-4 bg-card border-border/50">
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-medium text-sm">Client Assigned</p>
                                            <p className="text-xs text-muted-foreground">Client has been linked to the project</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-4 bg-card border-border/50">
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-medium text-sm">Fly.io Projects Added</p>
                                            <p className="text-xs text-muted-foreground">Infrastructure configured and ready</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-6 w-full max-w-md">
                            <Button
                                onClick={onCreateAnother}
                                variant="outline"
                                className="flex-1"
                            >
                                Create Another Project
                            </Button>
                            <Button
                                asChild
                                className="flex-1"
                            >
                                <Link href="/admin/projects" className="flex items-center justify-center gap-2">
                                    <FolderOpen className="h-4 w-4" />
                                    View All Projects
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

