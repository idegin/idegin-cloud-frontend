/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Pagination } from '../models/Pagination';
import type { Transaction } from '../models/Transaction';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WalletService {
    /**
     * Create wallet
     * Create a wallet for the authenticated organization (if not exists)
     * @param xOrgUserId Organization user ID for wallet operations
     * @returns void
     * @throws ApiError
     */
    public static postWallet(
        xOrgUserId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/wallet',
            headers: {
                'x-org-user-id': xOrgUserId,
            },
        });
    }
    /**
     * Get wallet details
     * Get wallet details for the authenticated organization
     * @param xOrgUserId Organization user ID for wallet operations
     * @returns void
     * @throws ApiError
     */
    public static getWallet(
        xOrgUserId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/wallet',
            headers: {
                'x-org-user-id': xOrgUserId,
            },
        });
    }
    /**
     * Get wallet balance
     * Get wallet balance for the authenticated organization
     * @param xOrgUserId Organization user ID for wallet operations
     * @returns any Balance retrieved successfully
     * @throws ApiError
     */
    public static getWalletBalance(
        xOrgUserId: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            balance?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/wallet/balance',
            headers: {
                'x-org-user-id': xOrgUserId,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
                404: `Not found - Resource not found`,
            },
        });
    }
    /**
     * Initialize wallet funding
     * Initialize wallet funding with Paystack payment for the organization
     * @param xOrgUserId Organization user ID for wallet operations
     * @param requestBody
     * @returns any Funding initialized successfully
     * @throws ApiError
     */
    public static postWalletFund(
        xOrgUserId: string,
        requestBody: {
            /**
             * Amount in kobo (Nigerian currency)
             */
            amount: number;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            authorization_url?: string;
            access_code?: string;
            reference?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/wallet/fund',
            headers: {
                'x-org-user-id': xOrgUserId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
            },
        });
    }
    /**
     * Verify wallet funding
     * Verify wallet funding payment for the organization
     * @param xOrgUserId Organization user ID for wallet operations
     * @param reference Payment reference from Paystack
     * @returns any Payment verified successfully
     * @throws ApiError
     */
    public static getWalletVerify(
        xOrgUserId: string,
        reference: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            balance?: number;
            organizationId?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/wallet/verify',
            headers: {
                'x-org-user-id': xOrgUserId,
            },
            query: {
                'reference': reference,
            },
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                404: `Not found - Resource not found`,
            },
        });
    }
    /**
     * Get wallet transactions
     * Get wallet transactions with pagination for the organization
     * @param xOrgUserId Organization user ID for wallet operations
     * @param page Page number for pagination
     * @param limit Number of items per page
     * @returns any Transactions retrieved successfully
     * @throws ApiError
     */
    public static getWalletTransactions(
        xOrgUserId: string,
        page: number = 1,
        limit: number = 20,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            transactions?: Array<Transaction>;
            pagination?: Pagination;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/wallet/transactions',
            headers: {
                'x-org-user-id': xOrgUserId,
            },
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
            },
        });
    }
    /**
     * Get outstanding payments
     * Get outstanding payments for the authenticated organization
     * @param xOrgUserId Organization user ID for wallet operations
     * @returns any Outstanding payments retrieved successfully
     * @throws ApiError
     */
    public static getWalletOutstanding(
        xOrgUserId: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            total_outstanding?: number;
            transactions?: Array<Transaction>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/wallet/outstanding',
            headers: {
                'x-org-user-id': xOrgUserId,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
            },
        });
    }
    /**
     * Pay outstanding balance
     * Pay outstanding balance from organization wallet
     * @param xOrgUserId Organization user ID for wallet operations
     * @param requestBody
     * @returns any Outstanding balance payment processed successfully
     * @throws ApiError
     */
    public static postWalletPayOutstanding(
        xOrgUserId: string,
        requestBody?: {
            /**
             * Amount to pay (optional - defaults to full outstanding balance)
             */
            amount?: number;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            balance?: number;
            outstanding_balance?: number;
            organizationId?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/wallet/pay-outstanding',
            headers: {
                'x-org-user-id': xOrgUserId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
            },
        });
    }
}
