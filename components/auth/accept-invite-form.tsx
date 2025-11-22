"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { InvitationsService } from "@/lib/api/services/InvitationsService";
import type { InvitationWithDetails } from "@/lib/api/models/InvitationWithDetails";
import Image from "next/image";
import Link from "next/link";

interface AcceptInviteFormProps {
    token: string;
}

export function AcceptInviteForm({ token }: AcceptInviteFormProps) {
    const router = useRouter();
    const [invitation, setInvitation] = useState<InvitationWithDetails | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                const response = await InvitationsService.getInvitationsToken(
                    token
                );
                if (response.success && response.data) {
                    setInvitation(response.data);
                } else {
                    setError("Invalid or expired invitation");
                }
            } catch (err: any) {
                console.error("Error fetching invitation:", err);
                setError(
                    "Failed to load invitation details. Please check the link and try again."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvitation();
    }, [token]);

    const handleAcceptInvitation = async () => {
        setIsAccepting(true);
        setError("");

        try {
            const response = await InvitationsService.postInvitationsAccept({
                token: token,
            });

            if (response.success) {
                setSuccess(true);
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    router.push("/dashboard/projects");
                }, 2000);
            } else {
                setError("Failed to accept invitation. Please try again.");
            }
        } catch (err: any) {
            console.error("Error accepting invitation:", err);
            setError("Failed to accept invitation. Please try again.");
        } finally {
            setIsAccepting(false);
        }
    };

    if (isLoading) {
        return (
            <div className='w-full max-w-md space-y-8'>
                <div className='flex flex-col items-center space-y-4'>
                    <div className='relative w-[200px] h-[60px]'>
                        <Image
                            src='/logo-text-dark.png'
                            alt='Logo'
                            fill
                            className='object-contain'
                            priority
                        />
                    </div>
                    <div className='text-center space-y-2'>
                        <h1 className='text-3xl font-bold tracking-tight'>
                            Loading invitation...
                        </h1>
                        <p className='text-muted-foreground'>
                            Please wait while we load your invitation details
                        </p>
                    </div>
                </div>

                <Card className='border-border/40 shadow-lg'>
                    <CardContent className='flex items-center justify-center py-12'>
                        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error && !invitation) {
        return (
            <div className='w-full max-w-md space-y-8'>
                <div className='flex flex-col items-center space-y-4'>
                    <div className='relative w-[200px] h-[60px]'>
                        <Image
                            src='/logo-text-dark.png'
                            alt='Logo'
                            fill
                            className='object-contain'
                            priority
                        />
                    </div>
                    <div className='text-center space-y-2'>
                        <h1 className='text-3xl font-bold tracking-tight'>
                            Invalid Invitation
                        </h1>
                        <p className='text-muted-foreground'>
                            This invitation link is invalid or has expired
                        </p>
                    </div>
                </div>

                <Card className='border-border/40 shadow-lg'>
                    <CardContent className='py-6'>
                        <Alert
                            variant='destructive'
                            className='border-destructive/50'
                        >
                            <XCircle className='h-4 w-4' />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter className='flex flex-col gap-4'>
                        <Button
                            asChild
                            variant='outline'
                            className='w-full h-11 text-base'
                        >
                            <Link href='/auth/login'>Go to Login</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className='w-full max-w-md space-y-8'>
                <div className='flex flex-col items-center space-y-4'>
                    <div className='relative w-[200px] h-[60px]'>
                        <Image
                            src='/logo-text-dark.png'
                            alt='Logo'
                            fill
                            className='object-contain'
                            priority
                        />
                    </div>
                    <div className='text-center space-y-2'>
                        <h1 className='text-3xl font-bold tracking-tight'>
                            Welcome aboard!
                        </h1>
                        <p className='text-muted-foreground'>
                            You have successfully joined the organization
                        </p>
                    </div>
                </div>

                <Card className='border-border/40 shadow-lg'>
                    <CardContent className='py-6'>
                        <Alert className='border-green-200 bg-green-50'>
                            <CheckCircle className='h-4 w-4 text-green-600' />
                            <AlertDescription className='text-green-800'>
                                You have successfully accepted the invitation
                                and joined{" "}
                                <strong>
                                    {invitation?.organization?.name}
                                </strong>
                                . Redirecting you to the dashboard...
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className='w-full max-w-md space-y-8'>
            <div className='flex flex-col items-center space-y-4'>
                <div className='relative w-[200px] h-[60px]'>
                    <Image
                        src='/logo-text-dark.png'
                        alt='Logo'
                        fill
                        className='object-contain'
                        priority
                    />
                </div>
                <div className='text-center space-y-2'>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Accept Invitation
                    </h1>
                    <p className='text-muted-foreground'>
                        You've been invited to join an organization
                    </p>
                </div>
            </div>

            <Card className='border-border/40 shadow-lg'>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-xl text-center'>
                        Organization Invitation
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {error && (
                        <Alert
                            variant='destructive'
                            className='border-destructive/50'
                        >
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className='space-y-4'>
                        <div className='text-center space-y-2'>
                            <h3 className='text-lg font-semibold'>
                                {invitation?.organization?.name}
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                                You've been invited by{" "}
                                <strong>{invitation?.inviter?.name}</strong>
                            </p>
                        </div>

                        <div className='bg-muted/50 rounded-lg p-4 space-y-2'>
                            <div className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>
                                    Organization:
                                </span>
                                <span className='font-medium'>
                                    {invitation?.organization?.name}
                                </span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>
                                    Role:
                                </span>
                                <span className='font-medium capitalize'>
                                    {invitation?.role || "Member"}
                                </span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>
                                    Invited by:
                                </span>
                                <span className='font-medium'>
                                    {invitation?.inviter?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='flex flex-col gap-4'>
                    <Button
                        onClick={handleAcceptInvitation}
                        className='w-full h-11 text-base'
                        disabled={isAccepting}
                    >
                        {isAccepting ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Accepting invitation...
                            </>
                        ) : (
                            <>
                                <UserPlus className='mr-2 h-4 w-4' />
                                Accept Invitation
                            </>
                        )}
                    </Button>
                    <div className='text-sm text-center text-muted-foreground'>
                        By accepting this invitation, you agree to join this
                        organization.
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
