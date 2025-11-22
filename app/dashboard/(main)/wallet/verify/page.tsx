"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Wallet } from "lucide-react";
import { WalletService } from "@/lib/api/services/WalletService";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useApp } from "@/lib/contexts/app-context";

function VerifyPaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference");
    const { data: session, status } = useSession();
    const { currentOrgUser } = useApp();
    const [verificationStatus, setVerificationStatus] = useState<
        "verifying" | "success" | "error"
    >("verifying");
    const [message, setMessage] = useState("");
    const [balance, setBalance] = useState<number | null>(null);
    const [organizationId, setOrganizationId] = useState<string | null>(null);

    const isAuthenticated = status === "authenticated";

    const verifyMutation = useMutation({
        mutationFn: ({ ref, orgUserId }: { ref: string; orgUserId: string }) =>
            WalletService.getWalletVerify(orgUserId, ref),
        onSuccess: (response) => {
            setVerificationStatus("success");
            setMessage(
                response.message ||
                    "Payment verified successfully! Your wallet has been credited."
            );
            if (response.data?.balance) {
                setBalance(response.data.balance);
            }
            if (response.data?.organizationId) {
                setOrganizationId(response.data.organizationId);
            }
        },
        onError: (error: any) => {
            setVerificationStatus("error");
            setMessage(
                error?.message ||
                    "Payment verification failed. Please contact support if your account was debited."
            );
        },
    });

    useEffect(() => {
        if (!reference) {
            setVerificationStatus("error");
            setMessage("No payment reference found");
            return;
        }

        if (!isAuthenticated || !currentOrgUser) {
            setVerificationStatus("error");
            setMessage("Authentication required to verify payment");
            return;
        }

        // Verify the payment
        verifyMutation.mutate({ ref: reference, orgUserId: currentOrgUser });
    }, [reference, isAuthenticated, currentOrgUser]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const handleBackToWallet = () => {
        router.push("/dashboard/wallet");
    };

    return (
        <div className='space-y-12'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Payment Verification
                    </h1>
                    <p className='text-muted-foreground mt-1'>
                        Verifying your wallet funding transaction
                    </p>
                </div>
            </div>

            <div className='flex items-center justify-center min-h-[60vh]'>
                <Card className='w-full max-w-md border-border/40 shadow-lg'>
                    <CardHeader className='text-center pb-6'>
                        <div className='flex justify-center mb-6'>
                            {verificationStatus === "verifying" && (
                                <div className='relative'>
                                    <Wallet className='h-20 w-20 text-primary/20' />
                                    <Loader2 className='h-8 w-8 text-primary animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
                                </div>
                            )}
                            {verificationStatus === "success" && (
                                <div className='relative'>
                                    <div className='h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center'>
                                        <CheckCircle2 className='h-12 w-12 text-green-500' />
                                    </div>
                                </div>
                            )}
                            {verificationStatus === "error" && (
                                <div className='relative'>
                                    <div className='h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center'>
                                        <XCircle className='h-12 w-12 text-destructive' />
                                    </div>
                                </div>
                            )}
                        </div>
                        <CardTitle className='text-2xl font-bold'>
                            {verificationStatus === "verifying" &&
                                "Verifying Payment..."}
                            {verificationStatus === "success" &&
                                "Payment Successful!"}
                            {verificationStatus === "error" && "Payment Failed"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='text-center'>
                            <p className='text-muted-foreground leading-relaxed'>
                                {message}
                            </p>
                        </div>

                        {verificationStatus === "success" &&
                            balance !== null && (
                                <div className='bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center'>
                                    <div className='flex items-center justify-center mb-3'>
                                        <Wallet className='h-5 w-5 text-green-600 mr-2' />
                                        <p className='text-sm font-medium text-green-700 dark:text-green-300'>
                                            New Wallet Balance
                                        </p>
                                    </div>
                                    <p className='text-3xl font-bold text-green-600 dark:text-green-400'>
                                        {formatCurrency(balance)}
                                    </p>
                                    {organizationId && (
                                        <p className='text-xs text-green-600/70 mt-2'>
                                            Organization ID: {organizationId}
                                        </p>
                                    )}
                                </div>
                            )}

                        {reference && (
                            <div className='bg-muted/50 rounded-lg p-4'>
                                <p className='text-xs text-muted-foreground mb-1'>
                                    Transaction Reference
                                </p>
                                <p className='font-mono text-sm font-medium break-all'>
                                    {reference}
                                </p>
                            </div>
                        )}

                        <div className='pt-4'>
                            <Button
                                className='w-full h-11 text-base'
                                onClick={handleBackToWallet}
                                disabled={verificationStatus === "verifying"}
                            >
                                {verificationStatus === "verifying" ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Please wait...
                                    </>
                                ) : (
                                    "Back to Wallet"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function VerifyPaymentPage() {
    return (
        <Suspense
            fallback={
                <div className='space-y-12'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <div className='h-9 w-64 bg-muted animate-pulse rounded mb-2' />
                            <div className='h-4 w-96 bg-muted animate-pulse rounded' />
                        </div>
                    </div>
                    <div className='flex items-center justify-center min-h-[60vh]'>
                        <Card className='w-full max-w-md border-border/40 shadow-lg'>
                            <CardContent className='flex items-center justify-center py-12'>
                                <Loader2 className='h-8 w-8 text-primary animate-spin' />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            }
        >
            <VerifyPaymentContent />
        </Suspense>
    );
}
