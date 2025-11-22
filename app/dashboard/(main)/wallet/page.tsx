"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
    Wallet,
    AlertCircle,
    TrendingUp,
    FileText,
    Calendar,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Plus,
} from "lucide-react";
import { WalletLoading } from "./wallet-loading";
import { WalletService } from "@/lib/api/services/WalletService";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useApp } from "@/lib/contexts/app-context";

export default function ClientWalletPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [fundAmount, setFundAmount] = useState<string | undefined>("");
    const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
    const itemsPerPage = 10;
    const queryClient = useQueryClient();
    const { data: session, status } = useSession();
    const { appData, currentOrgUser } = useApp();

    const isAuthenticated = status === "authenticated";
    const isAuthLoading = status === "loading";

    // Fetch wallet data
    const { data: walletData, isLoading: isLoadingWallet } = useQuery({
        queryKey: ["wallet", currentOrgUser],
        queryFn: async () => {
            if (!currentOrgUser) {
                throw new Error("No organization selected");
            }
            const response = await WalletService.getWallet(currentOrgUser);
            return response.data;
        },
        enabled: isAuthenticated && !!currentOrgUser,
    });

    console.log('WALLET DATA::', { data: walletData, isLoading: isLoadingWallet })

    // Fetch transactions with pagination
    const { data: transactionsData, isLoading: isLoadingTransactions } =
        useQuery({
            queryKey: ["wallet-transactions", currentOrgUser, currentPage],
            queryFn: async () => {
                if (!currentOrgUser) {
                    throw new Error("No organization selected");
                }
                const response = await WalletService.getWalletTransactions(
                    currentOrgUser,
                    currentPage,
                    itemsPerPage
                );
                return response.data;
            },
            enabled: isAuthenticated && !!currentOrgUser,
        });

    // Pay outstanding balance mutation
    const payOutstandingMutation = useMutation({
        mutationFn: () => {
            if (!currentOrgUser) {
                throw new Error("No organization selected");
            }
            return WalletService.postWalletPayOutstanding(currentOrgUser, {});
        },
        onSuccess: (response) => {
            toast.success(
                response.message || "Outstanding balance paid successfully"
            );
            // Invalidate queries to refetch data
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({
                queryKey: ["wallet-transactions"],
            });
        },
        onError: (error: any) => {
            console.error("Error paying outstanding balance:", error);
            toast.error(error?.message || "Failed to pay outstanding balance");
        },
    });

    // Fund wallet mutation
    const fundWalletMutation = useMutation({
        mutationFn: (amount: number) => {
            if (!currentOrgUser) {
                throw new Error("No organization selected");
            }
            return WalletService.postWalletFund(currentOrgUser, { amount });
        },
        onSuccess: (response) => {
            if (response.data?.authorization_url) {
                // Redirect to Paystack payment page
                window.location.href = response.data.authorization_url;
            } else {
                toast.error("Payment initialization failed");
            }
        },
        onError: (error: any) => {
            console.error("Error funding wallet:", error);
            toast.error(error?.message || "Failed to initialize payment");
        },
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handlePayOutstanding = () => {
        if (
            !walletData ||
            !walletData.outstanding_balance ||
            walletData.outstanding_balance <= 0
        )
            return;

        if (
            walletData.balance &&
            walletData.balance < walletData.outstanding_balance
        ) {
            toast.error("Insufficient balance. Please fund your wallet first.");
            return;
        }

        payOutstandingMutation.mutate();
    };

    const handleFundWallet = () => {
        const amount = parseFloat(fundAmount);

        if (isNaN(amount) || amount < 100) {
            toast.error("Please enter a valid amount (minimum ₦100)");
            return;
        }

        fundWalletMutation.mutate(amount);
    };

    const transactions = transactionsData?.transactions || [];
    const totalTransactions = transactionsData?.pagination?.total || 0;
    const totalPages = Math.ceil(totalTransactions / itemsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const isLoading = isAuthLoading || isLoadingWallet || isLoadingTransactions;

    if (isLoading) {
        return <WalletLoading />;
    }

    if (!walletData) {
        return null;
    }

    return (
        <div className='space-y-12'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Wallet
                    </h1>
                    <p className='text-muted-foreground mt-1'>
                        Manage your organization's wallet balance and view
                        transaction history
                    </p>
                </div>
                <Dialog
                    open={isFundDialogOpen}
                    onOpenChange={setIsFundDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className='h-4 w-4 mr-2' />
                            Fund Wallet
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Fund Your Wallet</DialogTitle>
                            <DialogDescription>
                                Enter the amount you want to add to your wallet.
                                You'll be redirected to Paystack to complete the
                                payment.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='space-y-4 py-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='amount'>
                                    Amount (Minimum ₦100)
                                </Label>
                                <CurrencyInput
                                    id='amount'
                                    name='amount'
                                    placeholder='Enter amount'
                                    prefix='₦'
                                    decimalsLimit={2}
                                    value={fundAmount}
                                    onValueChange={(value) => setFundAmount(value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant='outline'
                                onClick={() => setIsFundDialogOpen(false)}
                                disabled={fundWalletMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleFundWallet}
                                disabled={fundWalletMutation.isPending}
                            >
                                {fundWalletMutation.isPending ? (
                                    <>
                                        <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                                        Processing...
                                    </>
                                ) : (
                                    "Continue to Payment"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Current Balance
                        </CardTitle>
                        <Wallet className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-3xl font-bold'>
                            {formatCurrency(walletData.balance || 0)}
                        </div>
                        <p className='text-xs text-muted-foreground mt-1'>
                            Available funds for project deployments
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className={
                        (walletData.outstanding_balance || 0) > 0
                            ? "border-destructive/50"
                            : ""
                    }
                >
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Outstanding Balance
                        </CardTitle>
                        {(walletData.outstanding_balance || 0) > 0 ? (
                            <AlertCircle className='h-4 w-4 text-destructive' />
                        ) : (
                            <TrendingUp className='h-4 w-4 text-muted-foreground' />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`text-3xl font-bold ${
                                (walletData.outstanding_balance || 0) > 0
                                    ? "text-destructive"
                                    : ""
                            }`}
                        >
                            {formatCurrency(
                                walletData.outstanding_balance || 0
                            )}
                        </div>
                        <p className='text-xs text-muted-foreground mt-1 mb-3'>
                            {(walletData.outstanding_balance || 0) > 0
                                ? "Outstanding balance requiring payment"
                                : "All payments are up to date"}
                        </p>
                        {(walletData.outstanding_balance || 0) > 0 && (
                            <Button
                                className='w-full'
                                variant='destructive'
                                onClick={handlePayOutstanding}
                                disabled={
                                    payOutstandingMutation.isPending ||
                                    (walletData.balance || 0) <
                                        (walletData.outstanding_balance || 0)
                                }
                            >
                                {payOutstandingMutation.isPending ? (
                                    <>
                                        <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                                        Processing...
                                    </>
                                ) : (
                                    "Pay Now"
                                )}
                            </Button>
                        )}
                        {(walletData.outstanding_balance || 0) > 0 &&
                            (walletData.balance || 0) <
                                (walletData.outstanding_balance || 0) && (
                                <p className='text-xs text-destructive mt-2'>
                                    Insufficient balance. Please fund your
                                    wallet first.
                                </p>
                            )}
                    </CardContent>
                </Card>
            </div>

            <Card className='border-none p-0 px-0'>
                <CardHeader className='p-0'>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                        View and manage all your wallet transactions
                    </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                    {transactions.length === 0 ? (
                        <div className='text-center py-12'>
                            <FileText className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                            <h3 className='font-semibold text-lg mb-2'>
                                No transactions yet
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                                Your transaction history will appear here
                            </p>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <div className='rounded-md border'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className='text-right'>
                                                Amount
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map(
                                            (transaction, index) => {
                                                const isCredit =
                                                    transaction.type ===
                                                    "credit";
                                                const isCompleted =
                                                    transaction.status ===
                                                    "completed";

                                                return (
                                                    <TableRow
                                                        key={
                                                            transaction.reference ||
                                                            index
                                                        }
                                                    >
                                                        <TableCell className='font-medium hover:underline cursor-pointer hover:text-primary'>
                                                            {transaction.reference ||
                                                                "N/A"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className='text-sm'>
                                                                {
                                                                    transaction.description
                                                                }
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    isCredit
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                                className={
                                                                    isCredit
                                                                        ? "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 border-green-500/20"
                                                                        : "bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20 border-red-500/20"
                                                                }
                                                            >
                                                                {
                                                                    transaction.type
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className='flex items-center gap-2'>
                                                                <Badge
                                                                    variant={
                                                                        isCompleted
                                                                            ? "default"
                                                                            : transaction.status ===
                                                                              "failed"
                                                                            ? "destructive"
                                                                            : "secondary"
                                                                    }
                                                                    className={
                                                                        isCompleted
                                                                            ? "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 border-green-500/20"
                                                                            : ""
                                                                    }
                                                                >
                                                                    {
                                                                        transaction.status
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className='flex items-center gap-2 text-sm'>
                                                                <Calendar className='h-3 w-3 text-muted-foreground' />
                                                                {transaction.createdAt
                                                                    ? formatDate(
                                                                          transaction.createdAt
                                                                      )
                                                                    : "N/A"}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell
                                                            className={`text-right font-semibold ${
                                                                isCredit
                                                                    ? "text-green-600 dark:text-green-400"
                                                                    : "text-red-600 dark:text-red-400"
                                                            }`}
                                                        >
                                                            {isCredit
                                                                ? "+"
                                                                : "-"}
                                                            {formatCurrency(
                                                                transaction.amount ||
                                                                    0
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className='flex items-center justify-between'>
                                    <p className='text-sm text-muted-foreground'>
                                        Showing page {currentPage} of{" "}
                                        {totalPages} ({totalTransactions} total
                                        transactions)
                                    </p>
                                    <div className='flex items-center gap-2'>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={goToPreviousPage}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className='h-4 w-4 mr-1' />
                                            Previous
                                        </Button>
                                        <div className='flex items-center gap-1'>
                                            <span className='text-sm text-muted-foreground px-2'>
                                                Page {currentPage} of{" "}
                                                {totalPages}
                                            </span>
                                        </div>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={goToNextPage}
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Next
                                            <ChevronRight className='h-4 w-4 ml-1' />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
