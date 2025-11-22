/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Provider = {
    /**
     * Provider type
     */
    type?: Provider.type;
    /**
     * Application name on the provider platform
     */
    appName?: string;
};
export namespace Provider {
    /**
     * Provider type
     */
    export enum type {
        FLY_IO = 'fly.io',
        MORTAR_STUDIO = 'mortar_studio',
    }
}

