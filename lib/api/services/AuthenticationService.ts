/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationUser } from '../models/OrganizationUser';
import type { Pagination } from '../models/Pagination';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Register a new user
     * Create a new user account with email, name, and password
     * @param requestBody
     * @returns any User registered successfully
     * @throws ApiError
     */
    public static postAuthRegister(
        requestBody: {
            email: string;
            name: string;
            password: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            user?: {
                id?: string;
                email?: string;
                name?: string;
                role?: string;
                isFirstLogin?: boolean;
            };
            accessToken?: string;
            refreshToken?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
                409: `Conflict - Resource already exists`,
            },
        });
    }
    /**
     * Login user
     * Authenticate user with email and password
     * @param requestBody
     * @returns any Login successful
     * @throws ApiError
     */
    public static postAuthLogin(
        requestBody: {
            email: string;
            password: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            user?: {
                _id?: string;
                email?: string;
                name?: string;
                role?: string;
                isFirstLogin?: boolean;
            };
            accessToken?: string;
            refreshToken?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Refresh access token
     * Get a new access token using refresh token
     * @param requestBody
     * @returns any Token refreshed successfully
     * @throws ApiError
     */
    public static postAuthRefreshToken(
        requestBody: {
            refreshToken: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            accessToken?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh-token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Logout user
     * Logout the authenticated user
     * @returns any Logout successful
     * @throws ApiError
     */
    public static postAuthLogout(): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Get user profile
     * Get the authenticated user's profile information
     * @returns any Profile retrieved successfully
     * @throws ApiError
     */
    public static getAuthProfile(): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            user?: User;
            organizationUsers?: Array<OrganizationUser>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/profile',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Update user profile
     * Update the authenticated user's profile information
     * @param requestBody
     * @returns any Profile updated successfully
     * @throws ApiError
     */
    public static putAuthProfile(
        requestBody: {
            name?: string;
            email?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: User;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/auth/profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                409: `Conflict - Resource already exists`,
            },
        });
    }
    /**
     * Change password
     * Change the authenticated user's password
     * @param requestBody
     * @returns any Password changed successfully
     * @throws ApiError
     */
    public static putAuthChangePassword(
        requestBody: {
            currentPassword: string;
            newPassword: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/auth/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Request password reset
     * Request a password reset email
     * @param requestBody
     * @returns any Password reset email sent
     * @throws ApiError
     */
    public static postAuthRequestPasswordReset(
        requestBody: {
            email: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            resetToken?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/request-password-reset',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Reset password
     * Reset password using reset token
     * @param requestBody
     * @returns any Password reset successfully
     * @throws ApiError
     */
    public static postAuthResetPassword(
        requestBody: {
            token: string;
            newPassword: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
            },
        });
    }
    /**
     * Verify email
     * Verify user email using verification token
     * @param requestBody
     * @returns any Email verified successfully
     * @throws ApiError
     */
    public static postAuthVerifyEmail(
        requestBody: {
            token: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/verify-email',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
            },
        });
    }
    /**
     * Delete account
     * Delete the authenticated user's account
     * @returns any Account deleted successfully
     * @throws ApiError
     */
    public static deleteAuthAccount(): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/auth/account',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Get user dependencies
     * Get the authenticated user's dependencies and related data
     * @returns any Dependencies retrieved successfully
     * @throws ApiError
     */
    public static getAuthDependencies(): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            user?: User;
            organizationUsers?: Array<OrganizationUser>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/dependencies',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Get all clients
     * Get a paginated list of all users with client role (Super Admin only)
     * @param page Page number for pagination
     * @param limit Number of items per page
     * @param search Search term for name or email
     * @returns any Clients retrieved successfully
     * @throws ApiError
     */
    public static getAuthClients(
        page: number = 1,
        limit: number = 10,
        search?: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            clients?: Array<User>;
            pagination?: Pagination;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/clients',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
            },
        });
    }
}
