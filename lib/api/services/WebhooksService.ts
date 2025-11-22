/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WebhookResponse } from '../models/WebhookResponse';
import type { WebhooksResponse } from '../models/WebhooksResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhooksService {
    /**
     * Handle Paystack webhook events
     * Endpoint for receiving Paystack webhook events (called by Paystack servers)
     * @param requestBody
     * @returns any Webhook received successfully
     * @throws ApiError
     */
    public static postWebhooksPaystack(
        requestBody: {
            /**
             * Event type
             */
            event?: string;
            /**
             * Event data from Paystack
             */
            data?: Record<string, any>;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/paystack',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input data`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get all webhooks
     * Get all webhook events (Super Admin only)
     * @param provider Filter by provider
     * @param event Filter by event type
     * @param status Filter by status
     * @param page Page number for pagination
     * @param limit Number of items per page
     * @returns WebhooksResponse Webhooks retrieved successfully
     * @throws ApiError
     */
    public static getWebhooks(
        provider?: 'paystack' | 'stripe',
        event?: string,
        status?: 'pending' | 'processed' | 'failed',
        page: number = 1,
        limit: number = 20,
    ): CancelablePromise<WebhooksResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webhooks',
            query: {
                'provider': provider,
                'event': event,
                'status': status,
                'page': page,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get webhook by reference
     * Get a specific webhook by its reference (Super Admin only)
     * @param reference Webhook reference
     * @returns WebhookResponse Webhook retrieved successfully
     * @throws ApiError
     */
    public static getWebhooksReference(
        reference: string,
    ): CancelablePromise<WebhookResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webhooks/reference/{reference}',
            path: {
                'reference': reference,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Access denied`,
                404: `Not found - Resource not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Retry failed webhook
     * Retry processing a failed webhook (Super Admin only)
     * @param id Webhook ID
     * @returns WebhookResponse Webhook retried successfully
     * @throws ApiError
     */
    public static postWebhooksRetry(
        id: string,
    ): CancelablePromise<WebhookResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/{id}/retry',
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
