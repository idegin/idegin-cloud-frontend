/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Invitation } from '../models/Invitation';
import type { InvitationWithDetails } from '../models/InvitationWithDetails';
import type { OrganizationUser } from '../models/OrganizationUser';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvitationsService {
    /**
     * Create an invitation
     * Create a new invitation to join an organization
     * @param requestBody
     * @returns any Invitation created successfully
     * @throws ApiError
     */
    public static postInvitations(
        requestBody: {
            /**
             * Email address of the user to invite
             */
            email: string;
            /**
             * ID of the organization to invite user to
             */
            organizationId: string;
            /**
             * Role to assign to the invited user
             */
            role?: 'admin' | 'member';
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Invitation;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invitations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                404: `Not found - Resource not found`,
                409: `Conflict - Resource already exists`,
            },
        });
    }
    /**
     * Accept an invitation
     * Accept an invitation to join an organization
     * @param requestBody
     * @returns any Invitation accepted successfully
     * @throws ApiError
     */
    public static postInvitationsAccept(
        requestBody: {
            /**
             * Invitation token
             */
            token: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: OrganizationUser;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invitations/accept',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                404: `Not found - Resource not found`,
                410: `Gone - Resource no longer available`,
            },
        });
    }
    /**
     * Get invitation by token
     * Get invitation details by token
     * @param token Invitation token
     * @returns any Invitation retrieved successfully
     * @throws ApiError
     */
    public static getInvitationsToken(
        token: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: InvitationWithDetails;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invitations/token/{token}',
            path: {
                'token': token,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                404: `Not found - Resource not found`,
                410: `Gone - Resource no longer available`,
            },
        });
    }
}
