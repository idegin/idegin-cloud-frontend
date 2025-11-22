/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProjectStatsResponse = {
    success?: boolean;
    message?: string;
    data?: {
        /**
         * Total number of projects
         */
        totalProjects?: number;
        /**
         * Number of active projects
         */
        activeProjects?: number;
        /**
         * Number of projects in development
         */
        inDevProjects?: number;
        /**
         * Number of suspended projects
         */
        suspendedProjects?: number;
        /**
         * Number of projects with active billing
         */
        projectsWithActivePayment?: number;
        /**
         * Total monthly billing amount across all projects
         */
        totalMonthlyBilling?: number;
    };
};

