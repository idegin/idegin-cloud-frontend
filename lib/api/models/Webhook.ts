/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Webhook = {
    /**
     * Webhook ID
     */
    _id?: string;
    /**
     * Event type
     */
    event?: Webhook.event;
    /**
     * Payment provider
     */
    provider?: Webhook.provider;
    /**
     * Transaction reference
     */
    reference?: string;
    /**
     * Processing status
     */
    status?: Webhook.status;
    /**
     * Full webhook payload from provider
     */
    payload?: Record<string, any>;
    /**
     * Error message if processing failed
     */
    error?: string;
    /**
     * When the webhook was processed
     */
    processedAt?: string;
    /**
     * Webhook creation date
     */
    createdAt?: string;
    /**
     * Last update date
     */
    updatedAt?: string;
};
export namespace Webhook {
    /**
     * Event type
     */
    export enum event {
        CHARGE_SUCCESS = 'charge.success',
        CHARGE_FAILED = 'charge.failed',
        TRANSFER_SUCCESS = 'transfer.success',
        TRANSFER_FAILED = 'transfer.failed',
        SUBSCRIPTION_CREATE = 'subscription.create',
        SUBSCRIPTION_DISABLE = 'subscription.disable',
        UNKNOWN = 'unknown',
    }
    /**
     * Payment provider
     */
    export enum provider {
        PAYSTACK = 'paystack',
        STRIPE = 'stripe',
    }
    /**
     * Processing status
     */
    export enum status {
        PENDING = 'pending',
        PROCESSED = 'processed',
        FAILED = 'failed',
    }
}

