/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Invitation = {
    /**
     * Unique identifier for the invitation
     */
    id?: string;
    /**
     * Email address of the invited user
     */
    email?: string;
    /**
     * Unique invitation token
     */
    token?: string;
    /**
     * ID of the organization
     */
    organizationId?: string;
    /**
     * Role assigned to the invited user
     */
    role?: Invitation.role;
    /**
     * Status of the invitation
     */
    status?: Invitation.status;
    /**
     * Expiration date of the invitation
     */
    expiresAt?: string;
    /**
     * Invitation creation date
     */
    createdAt?: string;
    /**
     * Last update date
     */
    updatedAt?: string;
};
export namespace Invitation {
    /**
     * Role assigned to the invited user
     */
    export enum role {
        ADMIN = 'admin',
        MEMBER = 'member',
    }
    /**
     * Status of the invitation
     */
    export enum status {
        PENDING = 'pending',
        ACCEPTED = 'accepted',
        EXPIRED = 'expired',
        CANCELLED = 'cancelled',
    }
}

