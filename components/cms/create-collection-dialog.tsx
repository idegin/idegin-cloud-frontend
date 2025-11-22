"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useCreateCollection } from "@/lib/hooks/use-cms"

const MAX_NAME_LENGTH = 100
const MAX_DESCRIPTION_LENGTH = 500
const MIN_NAME_LENGTH = 2

const createCollectionSchema = z.object({
    name: z
        .string()
        .min(MIN_NAME_LENGTH, {
            message: `Collection name must be at least ${MIN_NAME_LENGTH} characters`,
        })
        .max(MAX_NAME_LENGTH, {
            message: `Collection name must not exceed ${MAX_NAME_LENGTH} characters`,
        })
        .regex(/^[a-zA-Z0-9\s-_]+$/, {
            message: "Collection name can only contain letters, numbers, spaces, hyphens, and underscores",
        }),
    description: z
        .string()
        .max(MAX_DESCRIPTION_LENGTH, {
            message: `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
        })
        .optional()
        .or(z.literal("")),
})

type CreateCollectionFormValues = z.infer<typeof createCollectionSchema>

interface CreateCollectionDialogProps {
    projectId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateCollectionDialog({
    projectId,
    open,
    onOpenChange,
}: CreateCollectionDialogProps) {
    const createCollectionMutation = useCreateCollection(projectId)

    const form = useForm<CreateCollectionFormValues>({
        resolver: zodResolver(createCollectionSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    const nameValue = form.watch("name")
    const descriptionValue = form.watch("description") || ""

    const onSubmit = async (data: CreateCollectionFormValues) => {
        try {
            await createCollectionMutation.mutateAsync({
                name: data.name,
                description: data.description || undefined,
            })
            form.reset()
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to create collection:", error)
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && !createCollectionMutation.isPending) {
            form.reset()
        }
        onOpenChange(newOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                    <DialogDescription>
                        Add a new collection to manage your content. Collections help organize
                        different types of content in your project.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Collection Name <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Blog Posts, Products, Users"
                                            {...field}
                                            disabled={createCollectionMutation.isPending}
                                        />
                                    </FormControl>
                                    <div className="flex items-center justify-between">
                                        <FormDescription>
                                            A descriptive name for your collection
                                        </FormDescription>
                                        <span
                                            className={`text-xs ${
                                                nameValue.length > MAX_NAME_LENGTH
                                                    ? "text-destructive"
                                                    : nameValue.length > MAX_NAME_LENGTH * 0.9
                                                    ? "text-warning"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {nameValue.length}/{MAX_NAME_LENGTH}
                                        </span>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe what this collection will be used for..."
                                            className="resize-none min-h-[100px]"
                                            {...field}
                                            disabled={createCollectionMutation.isPending}
                                        />
                                    </FormControl>
                                    <div className="flex items-center justify-between">
                                        <FormDescription>
                                            Optional description to help identify this collection
                                        </FormDescription>
                                        <span
                                            className={`text-xs ${
                                                descriptionValue.length > MAX_DESCRIPTION_LENGTH
                                                    ? "text-destructive"
                                                    : descriptionValue.length > MAX_DESCRIPTION_LENGTH * 0.9
                                                    ? "text-warning"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {descriptionValue.length}/{MAX_DESCRIPTION_LENGTH}
                                        </span>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={createCollectionMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createCollectionMutation.isPending}
                            >
                                {createCollectionMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Collection
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
