import apiClient from "../api-client"
import type { ApiResponse } from "../types"

export interface Invitation {
    id: string
    email: string
    type: string
    status: string
    token: string
    expiresAt: string
    createdAt: string
    updatedAt: string
    acceptedAt: string | null
    invitedBy: {
        id: string
        name: string
        email: string
    }
    organization: {
        id: string
        name: string
        slug: string
    }
}

export interface AcceptInvitationResponse {
    invitation: Invitation
    organizationUser: {
        id: string
        userId: string
        organizationId: string
        status: string
        createdAt: string
    }
}

export const invitationsApi = {
    acceptInvitation: async (token: string) => {
        const response = await apiClient.post<ApiResponse<AcceptInvitationResponse>>(
            "/invitations/accept",
            { token }
        )
        return response.data.data
    },

    getByToken: async (token: string) => {
        const response = await apiClient.get<ApiResponse<Invitation>>(
            `/invitations/token/${token}`
        )
        return response.data.data
    },
}
