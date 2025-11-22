"use client";

import type React from "react";
import { Next13ProgressBar } from "next13-progressbar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import AuthenticatedProvider from "@/components/authenticated-provider";
import QueryProvider from "./queryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Next13ProgressBar
                height='4px'
                color='#0A2FFF'
                options={{ showSpinner: true }}
                showOnShallow
            />
            <SessionProvider>
                <AuthenticatedProvider>
                    <QueryProvider>
                        {children}
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryProvider>
                </AuthenticatedProvider>
            </SessionProvider>
        </>
    );
}
