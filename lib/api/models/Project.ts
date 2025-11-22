/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Provider } from './Provider';
export type Project = {
    /**
     * Project ID
     */
    id?: string;
    /**
     * Name of the project
     */
    projectName?: string;
    /**
     * Project description
     */
    description?: string;
    /**
     * Monthly billing amount in Naira
     */
    monthly_billing?: number;
    /**
     * Organization ID
     */
    organizationId?: string;
    /**
     * List of providers for this project
     */
    providers?: Array<Provider>;
    /**
     * Current project status
     */
    status?: Project.status;
    /**
     * Whether monthly billing is active
     */
    is_payment_active?: boolean;
    /**
     * Next billing date
     */
    next_billing_date?: string;
    organization?: {
        id?: string;
        name?: string;
        slug?: string;
    };
    /**
     * Project creation date
     */
    createdAt?: string;
    /**
     * Last update date
     */
    updatedAt?: string;
};
export namespace Project {
    /**
     * Current project status
     */
    export enum status {
        ACTIVE = 'active',
        IN_DEV = 'in_dev',
        SUSPENDED = 'suspended',
    }
}

