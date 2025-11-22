/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WalletInfo = {
    id?: string;
    balance?: number;
    outstanding_balance?: number;
    organizationId?: string;
    transactions?: Array<{
        id?: string;
        amount?: number;
        type?: 'credit' | 'debit';
        status?: 'pending' | 'completed' | 'failed';
        description?: string;
        reference?: string;
        createdAt?: string;
    }>;
    totalTransactions?: number;
};

