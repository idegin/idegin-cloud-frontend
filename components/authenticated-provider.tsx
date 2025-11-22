"use client";
import { OpenAPI } from "@/lib/api";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const AuthenticatedProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated" && session?.user?.accessToken) {
            // Use a function that will be called on each request to ensure fresh token
            OpenAPI.TOKEN = async () => {
                return session.user.accessToken;
            };
            console.log("Token resolver set");
        } else if (status === "unauthenticated") {
            OpenAPI.TOKEN = undefined;
        }
    }, [status, session]);

    return <>{children}</>;
};

export default AuthenticatedProvider;
