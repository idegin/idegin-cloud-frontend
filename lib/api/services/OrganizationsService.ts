/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationStatistics } from '../models/OrganizationStatistics';
import type { OrganizationWithRelations } from '../models/OrganizationWithRelations';
import type { Pagination } from '../models/Pagination';
import type { WalletInfo } from '../models/WalletInfo';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrganizationsService {
    /**
     * Create a new organization
     * Create a new organization (Super Admin only)
     * @param requestBody
     * @returns any Organization created successfully
     * @throws ApiError
     */
    public static postOrganizations(
        requestBody: {
            /**
             * Name of the organization
             */
            name: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: OrganizationWithRelations;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/organizations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
                409: `Conflict - Resource already exists`,
            },
        });
    }
    /**
     * Get all organizations
     * Get a paginated list of all organizations (Super Admin only)
     * @param page Page number for pagination
     * @param limit Number of items per page
     * @param search Search term for organization name, slug, or owner details
     * @param status Filter by organization status
     * @returns any Organizations retrieved successfully
     * @throws ApiError
     */
    public static getOrganizations(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: 'active' | 'inactive',
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            organizations?: Array<OrganizationWithRelations>;
            pagination?: Pagination;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'status': status,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
            },
        });
    }
    /**
     * Get organization details
     * Get detailed information about a specific organization (Super Admin only)
     * @param id Organization ID
     * @returns any Organization details retrieved successfully
     * @throws ApiError
     */
    public static getOrganizationsDetails(
        id: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            organization?: OrganizationWithRelations;
            wallet?: WalletInfo;
            statistics?: OrganizationStatistics;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations/{id}/details',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
                404: `Not found - Resource not found`,
            },
        });
    }
    /**
     * Update organization
     * Update organization details (Super Admin only)
     * @param id Organization ID
     * @param requestBody
     * @returns any Organization updated successfully
     * @throws ApiError
     */
    public static putOrganizations(
        id: string,
        requestBody: {
            /**
             * New name for the organization
             */
            name?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: OrganizationWithRelations;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/organizations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
                404: `Not found - Resource not found`,
                409: `Conflict - Resource already exists`,
            },
        });
    }
}
