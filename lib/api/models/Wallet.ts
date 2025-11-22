/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Wallet = {
    /**
     * Unique identifier for the wallet
     */
    id?: string;
    /**
     * Current wallet balance
     */
    balance?: number;
    /**
     * Outstanding balance to be paid
     */
    outstanding_balance?: number;
    /**
     * ID of the associated organization
     */
    organizationId?: string;
    /**
     * Wallet creation date
     */
    createdAt?: string;
    /**
     * Last update date
     */
    updatedAt?: string;
};

