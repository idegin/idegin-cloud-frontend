/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectListResponse } from '../models/ProjectListResponse';
import type { ProjectResponse } from '../models/ProjectResponse';
import type { ProjectStatsResponse } from '../models/ProjectStatsResponse';
import type { ProjectStatusesResponse } from '../models/ProjectStatusesResponse';
import type { ProviderTypesResponse } from '../models/ProviderTypesResponse';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectsService {
    /**
     * Create a new project
     * Create a new project for an organization (Super Admin only)
     * @param requestBody
     * @returns ProjectResponse Project created successfully
     * @throws ApiError
     */
    public static postProjects(
        requestBody: {
            /**
             * Name of the project
             */
            projectName: string;
            /**
             * Project description
             */
            description: string;
            /**
             * Organization ID
             */
            organizationId: string;
            /**
             * Monthly billing amount in Naira
             */
            monthly_billing: number;
            /**
             * Maximum storage allocation in GB
             */
            maxStorageGB?: number;
            /**
             * Maximum number of API requests allowed
             */
            maxRequests?: number;
            providers: Array<{
                /**
                 * Provider type
                 */
                type: 'fly.io' | 'mortar_studio';
                /**
                 * Application name on the provider platform
                 */
                appName?: string;
            }>;
            /**
             * Project status
             */
            status?: 'active' | 'in_dev' | 'suspended';
            /**
             * Whether monthly billing is active for this project
             */
            is_payment_active?: boolean;
            /**
             * Enable CMS functionality for this project
             */
            enableCms?: boolean;
            /**
             * Enable Email Marketing functionality for this project
             */
            enableEmailMarketing?: boolean;
            /**
             * Enable CRM functionality for this project
             */
            enableCrm?: boolean;
        },
    ): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
                404: `Not found - Resource not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get all projects
     * Get all projects (Super Admin sees all, Client sees their organization's projects)
     * @param status Filter by project status
     * @param isPaymentActive Filter by payment status
     * @param client Filter by client ID (Super Admin only)
     * @param provider Filter by provider type
     * @param page Page number for pagination
     * @param limit Number of items per page
     * @returns ProjectListResponse Projects retrieved successfully
     * @throws ApiError
     */
    public static getProjects(
        status?: 'active' | 'in_dev' | 'suspended',
        isPaymentActive?: boolean,
        client?: string,
        provider?: 'fly.io' | 'mortar_studio',
        page: number = 1,
        limit: number = 10,
    ): CancelablePromise<ProjectListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects',
            query: {
                'status': status,
                'is_payment_active': isPaymentActive,
                'client': client,
                'provider': provider,
                'page': page,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get project statistics
     * Get project statistics (Super Admin sees all, Client sees their organization's projects)
     * @returns ProjectStatsResponse Project statistics retrieved successfully
     * @throws ApiError
     */
    public static getProjectsStats(): CancelablePromise<ProjectStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/stats',
            errors: {
                401: `Unauthorized - Authentication required`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get available provider types
     * Get list of available provider types
     * @returns ProviderTypesResponse Provider types retrieved successfully
     * @throws ApiError
     */
    public static getProjectsProviders(): CancelablePromise<ProviderTypesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/providers',
            errors: {
                401: `Unauthorized - Authentication required`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get available project statuses
     * Get list of available project statuses
     * @returns ProjectStatusesResponse Project statuses retrieved successfully
     * @throws ApiError
     */
    public static getProjectsStatuses(): CancelablePromise<ProjectStatusesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/statuses',
            errors: {
                401: `Unauthorized - Authentication required`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get projects by payment status
     * Get projects filtered by payment active status
     * @param isActive Payment active status
     * @returns ProjectListResponse Projects retrieved successfully
     * @throws ApiError
     */
    public static getProjectsPaymentStatus(
        isActive: boolean,
    ): CancelablePromise<ProjectListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/payment-status',
            query: {
                'is_active': isActive,
            },
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Search projects
     * Search projects by name or description
     * @param q Search query
     * @returns ProjectListResponse Search results retrieved successfully
     * @throws ApiError
     */
    public static getProjectsSearch(
        q: string,
    ): CancelablePromise<ProjectListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/search',
            query: {
                'q': q,
            },
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get projects by status
     * Get projects filtered by specific status
     * @param status Project status
     * @returns ProjectListResponse Projects retrieved successfully
     * @throws ApiError
     */
    public static getProjectsStatus(
        status: 'active' | 'in_dev' | 'suspended',
    ): CancelablePromise<ProjectListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/status/{status}',
            path: {
                'status': status,
            },
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get a single project by ID
     * Get a single project by ID (Client can only view their organization's projects)
     * @param id Project ID
     * @returns ProjectResponse Project retrieved successfully
     * @throws ApiError
     */
    public static getProjects1(
        id: string,
    ): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
                404: `Not found - Resource not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update a project
     * Update a project (Super Admin only)
     * @param id Project ID
     * @param requestBody
     * @returns ProjectResponse Project updated successfully
     * @throws ApiError
     */
    public static putProjects(
        id: string,
        requestBody: {
            projectName?: string;
            description?: string;
            /**
             * Monthly billing amount in Naira
             */
            monthly_billing?: number;
            providers?: Array<{
                type: 'fly.io' | 'mortar_studio';
                /**
                 * Application name on the provider platform
                 */
                appName?: string;
            }>;
            status?: 'active' | 'in_dev' | 'suspended';
            /**
             * Activate/deactivate monthly billing
             */
            is_payment_active?: boolean;
            /**
             * Maximum number of API requests allowed
             */
            maxRequests?: number;
            /**
             * Enable CMS integration
             */
            enableCms?: boolean;
            /**
             * Enable Email Marketing integration
             */
            enableEmailMarketing?: boolean;
            /**
             * Enable CRM integration
             */
            enableCrm?: boolean;
        },
    ): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/projects/{id}',
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
                500: `Internal server error`,
            },
        });
    }
    /**
     * Delete a project
     * Delete a project (Super Admin only)
     * @param id Project ID
     * @returns SuccessResponse Project deleted successfully
     * @throws ApiError
     */
    public static deleteProjects(
        id: string,
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/projects/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
                404: `Not found - Resource not found`,
                500: `Internal server error`,
            },
        });
    }
}
