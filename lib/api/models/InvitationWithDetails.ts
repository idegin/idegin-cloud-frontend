/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Invitation } from './Invitation';
import type { Organization } from './Organization';
import type { User } from './User';
export type InvitationWithDetails = (Invitation & {
    organization?: Organization;
    inviter?: User;
});

