"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthenticationService } from "@/lib/api/services/AuthenticationService";
import type { User } from "@/lib/api/models/User";
import { useQuery } from "@tanstack/react-query";
import { OrganizationsService } from "@/lib/api";

interface ClientSelectionStepProps {
    selectedClientId: string;
    onChange: (clientId: string) => void;
}

export function ClientSelectionStep({
    selectedClientId,
    onChange,
}: ClientSelectionStepProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const {
        data: Organizations,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["organizations"],
        queryFn: () =>
            OrganizationsService.getOrganizations(
                1,
                100,
                searchQuery || undefined
            ),
    });

    console.log(Organizations?.data);

    return (
        <div className='space-y-6'>
            <div className='space-y-2'>
                <Label htmlFor='client-search' className='text-sm font-medium'>
                    Search Clients
                </Label>
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                        id='client-search'
                        placeholder='Search by name, email, or company...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='h-11 pl-10'
                    />
                </div>
                <p className='text-xs text-muted-foreground'>
                    Find and select the client who owns this project
                </p>
            </div>

            <div className='space-y-3 max-h-[400px] overflow-y-auto pr-2'>
                {isSearching ? (
                    <>
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i} className='p-4'>
                                <div className='flex items-start gap-4'>
                                    <Skeleton className='h-12 w-12 rounded-full' />
                                    <div className='flex-1 space-y-2'>
                                        <Skeleton className='h-5 w-32' />
                                        <Skeleton className='h-4 w-48' />
                                        <Skeleton className='h-4 w-40' />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </>
                ) : error ? (
                    <div className='text-center py-12'>
                        <Building2 className='h-12 w-12 text-destructive mx-auto mb-4' />
                        <h3 className='font-semibold text-lg mb-2'>
                            Error loading clients
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            {error.message}
                        </p>
                    </div>
                ) : // @ts-ignore
                Organizations?.data && Organizations?.data?.length > 0 ? (
                    // @ts-ignore
                    Organizations?.data?.map((organization) => (
                        <Card
                            key={organization.id}
                            className={cn(
                                "p-4 cursor-pointer transition-all hover:shadow-md",
                                selectedClientId === organization.id
                                    ? "border-primary ring-2 ring-primary ring-offset-2"
                                    : "hover:border-primary/50"
                            )}
                            onClick={() => {
                                console.log(
                                    "client id from client selection step",
                                    organization
                                );
                                onChange(organization.id!);
                            }}
                        >
                            <div className='flex items-start gap-4'>
                                <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
                                    <Building2 className='h-6 w-6 text-primary' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center justify-between gap-2'>
                                        <h3 className='font-semibold text-base'>
                                            {organization.name}
                                        </h3>
                                        {selectedClientId ===
                                            organization.id && (
                                            <div className='h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0'>
                                                <Check className='h-4 w-4 text-primary-foreground' />
                                            </div>
                                        )}
                                    </div>
                                    <p className='text-sm text-muted-foreground truncate'>
                                        {organization.owner?.email}
                                    </p>
                                    {/* {organization.owner?.isEmailVerified && (
                                        <p className='text-xs text-green-600 mt-1'>
                                            ✓ Verified
                                        </p>
                                    )} */}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className='text-center py-12'>
                        <Building2 className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                        <h3 className='font-semibold text-lg mb-2'>
                            No clients found
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            {searchQuery
                                ? "Try adjusting your search terms"
                                : "No clients available"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
