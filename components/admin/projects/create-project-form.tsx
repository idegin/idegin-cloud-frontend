"use client";

import type React from "react";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectsService } from "@/lib/api/services/ProjectsService";
import { AuthenticationService } from "@/lib/api/services/AuthenticationService";
import { useEnsureToken } from "@/lib/api/ensureAuthenticated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateProjectForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [error, setError] = useState("");

    // Ensure token is set for API calls
    const { hasToken } = useEnsureToken();

    const [formData, setFormData] = useState({
        clientId: "",
        name: "",
        description: "",
        priority: "medium" as "low" | "medium" | "high" | "critical",
        startDate: new Date().toISOString().split("T")[0],
        budget: "",
        technologies: "",
        repositoryUrl: "",
    });

    const { data: clients } = useQuery({
        queryKey: ["clients"],
        queryFn: () => {
            if (!hasToken) {
                throw new Error("No authentication token available");
            }
            return AuthenticationService.getAuthClients(1, 100);
        },
        enabled: hasToken, // Only run query when token is available
    });

    console.log(clients?.data?.clients);

    const createMutation = useMutation({
        mutationFn: (data: any) => {
            if (!hasToken) {
                throw new Error("No authentication token available");
            }
            return ProjectsService.postProjects(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            router.push("/admin/projects");
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || "Failed to create project");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        createMutation.mutate({
            clientId: formData.clientId,
            name: formData.name,
            description: formData.description || undefined,
            priority: formData.priority,
            startDate: formData.startDate,
            budget: formData.budget ? Number(formData.budget) : undefined,
            technologies: formData.technologies
                ? formData.technologies.split(",").map((t) => t.trim())
                : undefined,
            repositoryUrl: formData.repositoryUrl || undefined,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>
                    Add a new project for a client
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    {error && (
                        <Alert variant='destructive'>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className='space-y-2'>
                        <Label htmlFor='clientId'>Client *</Label>
                        <Select
                            value={formData.clientId}
                            onValueChange={(value) =>
                                setFormData({ ...formData, clientId: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select a client' />
                            </SelectTrigger>
                            <SelectContent>
                                {clients?.data?.clients?.map((client) => (
                                    <SelectItem
                                        key={client.id}
                                        value={client.id || ""}
                                    >
                                        {client.name} ({client.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='name'>Project Name *</Label>
                        <Input
                            id='name'
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea
                            id='description'
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            rows={3}
                        />
                    </div>

                    <div className='grid gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label htmlFor='priority'>Priority *</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value: any) =>
                                    setFormData({
                                        ...formData,
                                        priority: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='low'>Low</SelectItem>
                                    <SelectItem value='medium'>
                                        Medium
                                    </SelectItem>
                                    <SelectItem value='high'>High</SelectItem>
                                    <SelectItem value='critical'>
                                        Critical
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='startDate'>Start Date *</Label>
                            <Input
                                id='startDate'
                                type='date'
                                value={formData.startDate}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        startDate: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='budget'>Budget ($)</Label>
                        <Input
                            id='budget'
                            type='number'
                            value={formData.budget}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    budget: e.target.value,
                                })
                            }
                            placeholder='5000'
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='technologies'>
                            Technologies (comma-separated)
                        </Label>
                        <Input
                            id='technologies'
                            value={formData.technologies}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    technologies: e.target.value,
                                })
                            }
                            placeholder='React, Node.js, MongoDB'
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='repositoryUrl'>Repository URL</Label>
                        <Input
                            id='repositoryUrl'
                            type='url'
                            value={formData.repositoryUrl}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    repositoryUrl: e.target.value,
                                })
                            }
                            placeholder='https://github.com/username/repo'
                        />
                    </div>

                    <div className='flex gap-3'>
                        <Button
                            type='submit'
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Creating...
                                </>
                            ) : (
                                "Create Project"
                            )}
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
