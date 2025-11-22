"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CurrencyInput } from "@/components/ui/currency-input"
import apiClient from "@/lib/api-client"

interface OrgWalletDetailsProps {
    wallet: {
        id: string
        balance: number
        outstanding_balance: number
        createdAt: string
        updatedAt: string
    } | null
    organization: {
        id: string
        name: string
        slug: string
    }
}

export default function OrgWalletDetails({ wallet, organization }: OrgWalletDetailsProps) {
    const [showCreditDialog, setShowCreditDialog] = useState(false)
    const [amount, setAmount] = useState<string | undefined>("")
    const [reason, setReason] = useState<string>("")
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(value)
    }

    const creditMutation = useMutation({
        mutationFn: async (data: { organizationId: string; amount: number; reason: string }) => {
            const response = await apiClient.post("/wallet/admin/credit", data)
            return response.data
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Wallet credited successfully. Email notification sent to organization owner.",
            })
            queryClient.invalidateQueries({ queryKey: ["organization", organization.id] })
            setShowCreditDialog(false)
            setAmount("")
            setReason("")
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to credit wallet",
                variant: "destructive",
            })
        },
    })

    const handleCredit = () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast({
                title: "Error",
                description: "Please enter a valid amount",
                variant: "destructive",
            })
            return
        }

        creditMutation.mutate({
            organizationId: organization.id,
            amount: parseFloat(amount),
            reason: reason || "Admin credit",
        })
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle>Wallet Details</CardTitle>
                        <CardDescription>Financial overview and transactions</CardDescription>
                    </div>
                    <Button onClick={() => setShowCreditDialog(true)}>
                        Credit Wallet
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Current Balance</p>
                        <p className="text-2xl font-bold">{formatCurrency(wallet?.balance || 0)}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                        <p className="text-xl font-semibold text-destructive">{formatCurrency(wallet?.outstanding_balance || 0)}</p>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Credit Wallet</DialogTitle>
                        <DialogDescription>
                            Add funds to {organization.name}'s wallet. Organization owner will be notified via email.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <CurrencyInput
                                id="amount"
                                name="amount"
                                placeholder="0.00"
                                value={amount}
                                decimalsLimit={2}
                                prefix="₦ "
                                onValueChange={(value) => setAmount(value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reason (Optional)</Label>
                            <input
                                id="reason"
                                type="text"
                                placeholder="e.g., Monthly allocation, Special credit"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowCreditDialog(false)
                                setAmount("")
                                setReason("")
                            }}
                            disabled={creditMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCredit} 
                            disabled={!amount || parseFloat(amount) <= 0 || creditMutation.isPending}
                        >
                            {creditMutation.isPending ? "Processing..." : "Credit Wallet"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}