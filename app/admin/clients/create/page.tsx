"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { organizationsApi } from "@/lib/api/organizations"
import { toast } from "sonner"

const organizationFormSchema = z.object({
  name: z.string()
    .min(2, { message: "Organization name must be at least 2 characters" })
    .max(100, { message: "Organization name must not exceed 100 characters" }),
})

type OrganizationFormData = z.infer<typeof organizationFormSchema>

export default function CreateClientPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: OrganizationFormData) => {
      const organization = await organizationsApi.create(data)
      return organization
    },
    onSuccess: (organization) => {
      setSuccessMessage(
        `Organization "${organization.name}" has been created successfully! Redirecting...`
      )
      toast.success("Organization created successfully!")
      queryClient.invalidateQueries({ queryKey: ["organizations"] })
      setTimeout(() => {
        router.push(`/admin/clients/${organization.id}`)
      }, 2000)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create organization")
    },
  })

  const handleSubmit = async (data: OrganizationFormData) => {
    createMutation.mutate(data)
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/clients")}
          className="mb-4"
          disabled={createMutation.isPending}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
        <h1 className="text-3xl font-bold">Create New Client Organization</h1>
        <p className="text-muted-foreground mt-2">
          Add a new organization to the platform. You'll be able to invite an owner after creation.
        </p>
      </div>

      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Details
          </CardTitle>
          <CardDescription>
            Enter the name for the new organization. A unique slug will be generated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {createMutation.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {createMutation.error instanceof Error
                      ? createMutation.error.message
                      : "Failed to create organization. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Acme Corporation"
                          className="pl-10"
                          {...field}
                          disabled={createMutation.isPending || !!successMessage}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the full legal or business name of the organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/clients")}
                  disabled={createMutation.isPending || !!successMessage}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || !!successMessage}
                  className="flex-1"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Organization...
                    </>
                  ) : (
                    <>
                      <Building2 className="mr-2 h-4 w-4" />
                      Create Organization
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
