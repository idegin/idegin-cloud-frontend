"use client"

import * as React from "react"
import { useApp } from "@/lib/contexts/app-context"
import { useUserDependencies } from "@/lib/hooks/use-user-dependencies"
import { useAcceptInvitation } from "@/lib/hooks/use-invitations"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconBuilding, IconLoader2, IconCheck, IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function InvitationPopup() {
  const { appData } = useApp()
  const { refetch } = useUserDependencies()
  const acceptInvitation = useAcceptInvitation()
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  const pendingInvitations = React.useMemo(() => {
    if (!appData?.invitations) return []
    return appData.invitations.filter((inv) => inv.status === "pending")
  }, [appData?.invitations])

  const hasOrganizations = (appData?.organizationUsers?.length || 0) > 0
  const canClose = hasOrganizations
  const currentInvitation = pendingInvitations[currentIndex]
  const isLastInvitation = currentIndex === pendingInvitations.length - 1

  const handleAccept = async () => {
    if (!currentInvitation) return

    setError(null)

    try {
      await acceptInvitation.mutateAsync(currentInvitation.token)

      if (isLastInvitation) {
        await refetch()
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to accept invitation")
    }
  }

  const handleSkip = () => {
    if (!canClose) return

    if (isLastInvitation) {
      refetch()
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  if (!currentInvitation) {
    return null
  }

  return (
    <Dialog open={!!currentInvitation} onOpenChange={() => canClose && refetch()}>
      <DialogContent
        className="sm:max-w-[480px]"
        onPointerDownOutside={(e) => !canClose && e.preventDefault()}
        onEscapeKeyDown={(e) => !canClose && e.preventDefault()}
      >
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center text-2xl">
            Organization Invitation
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {pendingInvitations.length > 1 && (
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {pendingInvitations.length}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-6">
          <div className="relative">
            <div className="flex items-center justify-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-border">
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(currentInvitation.invitedBy.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-center">
                <div className="h-px w-12 bg-border" />
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-muted">
                <IconBuilding className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-lg">
              <span className="font-semibold">{currentInvitation.invitedBy.name}</span>
              {" "}is inviting you to join
            </p>
            <p className="text-2xl font-bold">{currentInvitation.organization.name}</p>
          </div>

          <div className="w-full rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Invited by</span>
              <span className="font-medium">{currentInvitation.invitedBy.email}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium capitalize">
                {currentInvitation.type === "org_user" ? "Team Member" : "Owner"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Expires</span>
              <span className="font-medium">
                {new Date(currentInvitation.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {error && (
            <div className="w-full rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <div className={cn("flex gap-3", canClose ? "justify-between" : "justify-center")}>
          {canClose && (
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={acceptInvitation.isPending}
              className="flex-1"
            >
              <IconX className="mr-2 h-4 w-4" />
              {isLastInvitation ? "Close" : "Skip"}
            </Button>
          )}
          <Button
            onClick={handleAccept}
            disabled={acceptInvitation.isPending}
            className={cn("flex-1", !canClose && "w-full")}
          >
            {acceptInvitation.isPending ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting...
              </>
            ) : (
              <>
                <IconCheck className="mr-2 h-4 w-4" />
                Accept Invitation
              </>
            )}
          </Button>
        </div>

        {!canClose && (
          <p className="text-center text-sm text-muted-foreground">
            You must accept an invitation to continue
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
