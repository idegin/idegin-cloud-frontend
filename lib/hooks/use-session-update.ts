"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

/**
 * Hook to update the session with latest data from the backend
 * This triggers the JWT callback with the "update" trigger
 */
export function useSessionUpdate()
{
    const { data: session, update } = useSession();

    const refreshSession = useCallback(async () =>
    {
        try {
            console.log("Refreshing session...");
            await update();
            console.log("Session refreshed successfully");
        } catch (error) {
            console.error("Error refreshing session:", error);
            throw error;
        }
    }, [ update ]);

    const hasSessionError = session?.error === "RefreshAccessTokenError";

    return {
        refreshSession,
        hasSessionError,
        session,
    };
}
