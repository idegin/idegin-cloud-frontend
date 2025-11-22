"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import type { CMSCollection, CMSCollectionField } from "@/lib/api/cms";
import { cmsApi } from "@/lib/api/cms";

interface CMSCollectionData {
    collection: CMSCollection | null;
    fields: CMSCollectionField[];
}

interface CMSCollectionContextValue {
    cmsCollectionData: CMSCollectionData;
    setCMSCollectionData: (data: CMSCollectionData) => void;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const CMSCollectionContext = createContext<CMSCollectionContextValue | undefined>(undefined);

interface CMSCollectionProviderProps {
    children: ReactNode;
    projectId: string;
    collectionId: string;
}

export function CMSCollectionProvider({ 
    children, 
    projectId, 
    collectionId 
}: CMSCollectionProviderProps) {
    const [cmsCollectionData, setCMSCollectionData] = useState<CMSCollectionData>({
        collection: null,
        fields: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchCollectionData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch collection details
            const collection = await cmsApi.collections.getById(projectId, collectionId);
            
            // Fetch schema with fields
            const schema = await cmsApi.schema.get(projectId, collectionId);

            setCMSCollectionData({
                collection,
                fields: schema.fields || [],
            });
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch collection data"));
            console.error("Error fetching CMS collection data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (projectId && collectionId) {
            fetchCollectionData();
        }
    }, [projectId, collectionId]);

    return (
        <CMSCollectionContext.Provider
            value={{
                cmsCollectionData,
                setCMSCollectionData,
                isLoading,
                error,
                refetch: fetchCollectionData,
            }}
        >
            {children}
        </CMSCollectionContext.Provider>
    );
}

export function useCMSCollection() {
    const context = useContext(CMSCollectionContext);
    if (context === undefined) {
        throw new Error("useCMSCollection must be used within a CMSCollectionProvider");
    }
    return context;
}
