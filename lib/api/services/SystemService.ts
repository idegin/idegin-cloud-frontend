/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemService {
    /**
     * Get platform overview
     * Get comprehensive platform statistics and metrics for admins
     * @param year Year to fetch data for (defaults to current year)
     * @returns any Platform overview retrieved successfully
     * @throws ApiError
     */
    public static getApiV1SystemOverview(
        year?: number,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            metrics?: {
                totalOrganizations?: number;
                totalProjects?: number;
                totalRevenue?: number;
                activeSubscriptions?: number;
                organizationsGrowth?: number;
                projectsGrowth?: number;
                revenueGrowth?: number;
                subscriptionsGrowth?: number;
            };
            revenueData?: Array<{
                month?: string;
                revenue?: number;
                transactions?: number;
            }>;
            year?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/system/overview',
            query: {
                'year': year,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden - Requires admin or super admin role`,
                500: `Server error`,
            },
        });
    }
}
