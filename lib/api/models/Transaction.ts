/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Transaction = {
    /**
     * Unique identifier for the transaction
     */
    id?: string;
    /**
     * Transaction amount
     */
    amount?: number;
    /**
     * Transaction type
     */
    type?: Transaction.type;
    /**
     * Transaction status
     */
    status?: Transaction.status;
    /**
     * Transaction description
     */
    description?: string;
    /**
     * Transaction reference
     */
    reference?: string;
    /**
     * Associated wallet ID
     */
    walletId?: string;
    /**
     * Transaction creation date
     */
    createdAt?: string;
    /**
     * Last update date
     */
    updatedAt?: string;
};
export namespace Transaction {
    /**
     * Transaction type
     */
    export enum type {
        CREDIT = 'credit',
        DEBIT = 'debit',
    }
    /**
     * Transaction status
     */
    export enum status {
        PENDING = 'pending',
        COMPLETED = 'completed',
        FAILED = 'failed',
    }
}

