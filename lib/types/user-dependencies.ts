export interface UserDependencies {
  user: {
    _id: string
    email: string
    name: string
    role: string
    isEmailVerified: boolean
  }
  invitations: Array<{
    id: string
    email: string
    type: string
    status: string
    token: string
    expiresAt: string
    createdAt: string
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
  }>
  organizationUsers: Array<{
    id: string
    userId: string
    organizationId: string
    status: string
    createdAt: string
    organization: {
      id: string
      name: string
      slug: string
      ownerId: string
    }
  }>
}
