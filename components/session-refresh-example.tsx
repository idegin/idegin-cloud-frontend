"use client";

import { useSessionUpdate } from "@/lib/hooks/use-session-update";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SessionRefreshExample() {
    const { refreshSession, hasSessionError, session } = useSessionUpdate();

    const handleRefreshSession = async () => {
        try {
            await refreshSession();
        } catch (error) {
            console.error("Failed to refresh session:", error);
        }
    };

    return (
        <div className='space-y-4'>
            {hasSessionError && (
                <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>
                        Your session has expired. Please refresh to continue.
                    </AlertDescription>
                </Alert>
            )}

            <Button onClick={handleRefreshSession} variant='outline'>
                <RefreshCw className='mr-2 h-4 w-4' />
                Refresh Session
            </Button>

            {session && (
                <div className='text-sm text-muted-foreground'>
                    <p>
                        First Login: {session.user?.isFirstLogin ? "Yes" : "No"}
                    </p>
                    <p>Role: {session.user?.role}</p>
                    <p>
                        Organizations:{" "}
                        {session.user?.organizationUsers?.length || 0}
                    </p>
                </div>
            )}
        </div>
    );
}
