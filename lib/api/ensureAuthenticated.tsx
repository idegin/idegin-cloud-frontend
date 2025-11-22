"use client";

import { OpenAPI } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to ensure user is authenticated before making API calls
 * Redirects to login if not authenticated
 */
export function useEnsureAuthenticated() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    return {
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        session,
    };
}

/**
 * Higher-order component to protect routes that require authentication
 */
export function withAuth<T extends object>(
    Component: React.ComponentType<T>
): React.ComponentType<T> {
    return function AuthenticatedComponent(props: T) {
        const { isAuthenticated, isLoading } = useEnsureAuthenticated();

        if (isLoading) {
            return (
                <div className='flex items-center justify-center min-h-screen'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            return null; // Will redirect to login
        }

        return <Component {...props} />;
    };
}

/**
 * Utility function to check if user has required role
 */
export function useRequireRole(requiredRole: "super_admin" | "client") {
    const { session, isAuthenticated } = useEnsureAuthenticated();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && session?.user?.role !== requiredRole) {
            // Redirect based on user role
            if (session?.user?.role === "super_admin") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        }
    }, [isAuthenticated, session, requiredRole, router]);

    return {
        hasRole: session?.user?.role === requiredRole,
        isAuthenticated,
        session,
    };
}

/**
 * Hook to ensure admin access
 */
export function useRequireAdmin() {
    return useRequireRole("super_admin");
}

/**
 * Hook to ensure client access
 */
export function useRequireClient() {
    return useRequireRole("client");
}

export function useEnsureToken() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated" && session?.user?.accessToken) {
            OpenAPI.TOKEN = session.user.accessToken;
            console.log("Token ensured:", OpenAPI.TOKEN);
        } else if (status === "unauthenticated") {
            OpenAPI.TOKEN = undefined;
        }
    }, [status, session]);

    return {
        hasToken: !!OpenAPI.TOKEN,
        token: OpenAPI.TOKEN,
    };
}
