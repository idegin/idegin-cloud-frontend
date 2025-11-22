/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Pagination } from './Pagination';
import type { Webhook } from './Webhook';
export type WebhooksResponse = {
    success?: boolean;
    message?: string;
    data?: {
        webhooks?: Array<Webhook>;
        pagination?: Pagination;
    };
};

