import "next-auth";
import type { OrganizationUser } from "@/lib/api/models/OrganizationUser";

declare module "next-auth" {
  interface User
  {
    role: "super_admin" | "admin" | "client";
    id: string;
    accessToken: string;
    refreshToken: string;
    organizationUsers?: OrganizationUser[];
    isFirstLogin: boolean;
  }

  interface Session
  {
    user: User & {
      role: "super_admin" | "admin" | "client";
      id: string;
      accessToken: string;
      refreshToken: string;
      organizationUsers?: OrganizationUser[];
      isFirstLogin: boolean;
    };
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT
  {
    role: "super_admin" | "admin" | "client";
    id: string;
    accessToken: string;
    refreshToken: string;
    organizationUsers?: OrganizationUser[];
    isFirstLogin: boolean;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
    error?: string;
    email?: string;
    name?: string;
  }
}
