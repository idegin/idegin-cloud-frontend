/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from './Organization';
import type { OrganizationUser } from './OrganizationUser';
import type { Project } from './Project';
import type { User } from './User';
export type OrganizationWithRelations = (Organization & {
    owner?: User;
    organizationUsers?: Array<OrganizationUser>;
    projects?: Array<Project>;
    _count?: {
        projects?: number;
        organizationUsers?: number;
    };
});

