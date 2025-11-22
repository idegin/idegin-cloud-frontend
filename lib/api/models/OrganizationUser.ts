/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrganizationUser = {
    id?: string;
    userId?: string;
    organizationId?: string;
    status?: OrganizationUser.status;
    createdAt?: string;
    updatedAt?: string;
};
export namespace OrganizationUser {
    export enum status {
        PENDING = 'pending',
        ACTIVE = 'active',
        SUSPENDED = 'suspended',
    }
}

