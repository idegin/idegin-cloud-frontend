"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, User, UserPlus, AlertCircle, Info } from "lucide-react"

const inviteFormSchema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(100, { message: "Name must not exceed 100 characters" }),
    email: z.string()
        .email({ message: "Please enter a valid email address" })
        .min(1, { message: "Email is required" }),
    type: z.enum(["org_owner", "org_user"], {
        required_error: "Please select an invitation type",
    }),
})

export type InviteFormData = z.infer<typeof inviteFormSchema>

interface InviteUserFormProps {
    organizationName?: string
    defaultType?: "org_owner" | "org_user"
    onSubmit: (data: InviteFormData) => void | Promise<void>
    isSubmitting?: boolean
    error?: string | null
    canInviteOwner?: boolean
}

export function InviteUserForm({
    organizationName,
    defaultType = "org_user",
    onSubmit,
    isSubmitting = false,
    error = null,
    canInviteOwner = false,
}: InviteUserFormProps) {
    const [localError, setLocalError] = useState<string | null>(null)

    const form = useForm<InviteFormData>({
        resolver: zodResolver(inviteFormSchema),
        defaultValues: {
            name: "",
            email: "",
            type: defaultType,
        },
    })

    const handleSubmit = async (data: InviteFormData) => {
        try {
            setLocalError(null)
            await onSubmit(data)
        } catch (err) {
            setLocalError(err instanceof Error ? err.message : "Failed to send invitation")
        }
    }

    const watchedType = form.watch("type")

    const displayError = error || localError

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Invite User{organizationName ? ` to ${organizationName}` : ""}
                </CardTitle>
                <CardDescription>
                    {canInviteOwner 
                        ? "Invite a new organization owner or team member. An invitation email will be sent with access instructions."
                        : "Invite a new team member to collaborate on projects. An invitation email will be sent with access instructions."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {displayError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{displayError}</AlertDescription>
                            </Alert>
                        )}

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="John Doe"
                                                className="pl-10"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        The full name of the person you're inviting
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="email"
                                                placeholder="john.doe@example.com"
                                                className="pl-10"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Invitation will be sent to this email address
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isSubmitting || !canInviteOwner}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {canInviteOwner && (
                                                <SelectItem value="org_owner">
                                                    <div className="flex flex-col items-start">
                                                        <span className="font-medium">Organization Owner</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Full administrative control and billing responsibility
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            )}
                                            <SelectItem value="org_user">
                                                <div className="flex flex-col items-start">
                                                    <span className="font-medium">Organization User</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Team member with project collaboration access
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        {canInviteOwner 
                                            ? "Select the role for the invited user"
                                            : "You can only invite team members. Super admins can invite organization owners."}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {watchedType === "org_owner" && (
                            <Alert variant={'destructive'}>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Important:</strong> Inviting someone as an organization owner will transfer full control and billing responsibility to them. The current owner will become a regular team member.
                                </AlertDescription>
                            </Alert>
                        )}

                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Note:</strong> If the user doesn't have an account, one will be created automatically and they'll receive a temporary password via email. They'll be asked to change it upon first login.
                            </AlertDescription>
                        </Alert>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Invitation...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send Invitation
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
