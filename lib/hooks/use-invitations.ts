"use client"

import { useMutation } from "@tanstack/react-query"
import { invitationsApi } from "@/lib/api/invitations"

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (token: string) => invitationsApi.acceptInvitation(token),
  })
}
