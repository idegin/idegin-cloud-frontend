"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import type { UserDependencies } from "@/lib/types/user-dependencies";

interface AppContextValue {
    appData: UserDependencies | null;
    setAppData: (data: UserDependencies | null) => void;
    currentOrgUser: string | null;
    currentOrgId: string | null;
    setCurrentOrgUser: (orgUserId: string | null) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [appData, setAppData] = useState<UserDependencies | null>(null);
    const [currentOrgUser, setCurrentOrgUser] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("currentOrgUserId");
        }
        return null;
    });
    const [currentOrgId, setCurrentOrgId] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("currentOrgId");
        }
        return null;
    });

    useEffect(() => {
        if (
            appData?.organizationUsers &&
            appData.organizationUsers.length > 0
        ) {
            const storedOrgUserId = localStorage.getItem("currentOrgUserId");
            const isValidOrgUser = appData.organizationUsers.some(
                (orgUser) => orgUser.id === storedOrgUserId
            );

            if (!storedOrgUserId || !isValidOrgUser) {
                const firstOrgUser = appData.organizationUsers[0];
                setCurrentOrgUser(firstOrgUser.id);
                setCurrentOrgId(firstOrgUser.organization?.id);
                localStorage.setItem("currentOrgUserId", firstOrgUser.id);
                localStorage.setItem(
                    "currentOrgId",
                    firstOrgUser.organization?.id
                );
            } else if (storedOrgUserId !== currentOrgUser) {
                setCurrentOrgUser(storedOrgUserId);
            }
        }
    }, [appData]);

    useEffect(() => {
        if (currentOrgUser) {
            localStorage.setItem("currentOrgUserId", currentOrgUser);
        }
    }, [currentOrgUser]);

    return (
        <AppContext.Provider
            value={{
                appData,
                setAppData,
                currentOrgUser,
                currentOrgId,
                setCurrentOrgUser,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}
