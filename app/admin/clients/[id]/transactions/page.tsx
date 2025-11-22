"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ArrowLeft,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    TrendingUp,
    TrendingDown,
    DollarSign,
    CheckCircle2,
    XCircle,
    Clock
} from "lucide-react"
import TransactionsLoading from "./loading"

// Mock data
const mockTransactions = [
    {
        id: "1",
        type: "credit",
        amount: 50000,
        description: "Wallet funding via Paystack",
        reference: "TXN-2024-001",
        status: "completed",
        paystackReference: "PSK-2024-XYZ123",
        createdAt: "2024-10-20T14:30:00Z",
    },
    {
        id: "2",
        type: "debit",
        amount: 2500,
        description: "Monthly hosting fee - E-Commerce Platform",
        reference: "TXN-2024-002",
        status: "completed",
        createdAt: "2024-10-19T09:15:00Z",
    },
    {
        id: "3",
        type: "credit",
        amount: 25000,
        description: "Account top-up",
        reference: "TXN-2024-003",
        status: "completed",
        paystackReference: "PSK-2024-ABC456",
        createdAt: "2024-10-18T16:45:00Z",
    },
    {
        id: "4",
        type: "debit",
        amount: 1500,
        description: "Monthly hosting fee - Blog CMS",
        reference: "TXN-2024-004",
        status: "completed",
        createdAt: "2024-10-18T10:20:00Z",
    },
    {
        id: "5",
        type: "debit",
        amount: 3500,
        description: "Monthly hosting fee - Analytics Dashboard",
        reference: "TXN-2024-005",
        status: "completed",
        createdAt: "2024-10-17T11:30:00Z",
    },
    {
        id: "6",
        type: "credit",
        amount: 75000,
        description: "Initial wallet funding",
        reference: "TXN-2024-006",
        status: "completed",
        paystackReference: "PSK-2024-DEF789",
        createdAt: "2024-10-15T13:00:00Z",
    },
    {
        id: "7",
        type: "debit",
        amount: 2000,
        description: "Monthly hosting fee - Mobile API Backend",
        reference: "TXN-2024-007",
        status: "failed",
        createdAt: "2024-10-14T08:45:00Z",
    },
    {
        id: "8",
        type: "credit",
        amount: 30000,
        description: "Wallet funding via Paystack",
        reference: "TXN-2024-008",
        status: "pending",
        paystackReference: "PSK-2024-GHI012",
        createdAt: "2024-10-21T10:15:00Z",
    },
    {
        id: "9",
        type: "debit",
        amount: 1800,
        description: "Monthly hosting fee - Customer Portal",
        reference: "TXN-2024-009",
        status: "completed",
        createdAt: "2024-10-13T15:20:00Z",
    },
    {
        id: "10",
        type: "debit",
        amount: 2200,
        description: "Monthly hosting fee - Inventory System",
        reference: "TXN-2024-010",
        status: "completed",
        createdAt: "2024-10-12T12:10:00Z",
    },
]

const mockOrganization = {
    id: "org-1",
    name: "Test Organization",
    slug: "test-organization",
}

const mockWallet = {
    balance: 123450,
    outstanding_balance: 2000,
}

export default function OrganizationTransactionsPage() {
    const params = useParams()
    const router = useRouter()
    const organizationId = params.id as string

    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const filteredTransactions = useMemo(() => {
        return mockTransactions.filter(transaction => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.reference.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesType = typeFilter === "all" || transaction.type === typeFilter
            const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

            return matchesSearch && matchesType && matchesStatus
        })
    }, [searchQuery, typeFilter, statusFilter])

    const stats = {
        totalCredits: mockTransactions
            .filter(t => t.type === "credit" && t.status === "completed")
            .reduce((sum, t) => sum + t.amount, 0),
        totalDebits: mockTransactions
            .filter(t => t.type === "debit" && t.status === "completed")
            .reduce((sum, t) => sum + t.amount, 0),
        pending: mockTransactions.filter(t => t.status === "pending").length,
        failed: mockTransactions.filter(t => t.status === "failed").length,
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return {
                    icon: CheckCircle2,
                    label: "Completed",
                    className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                }
            case "pending":
                return {
                    icon: Clock,
                    label: "Pending",
                    className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                }
            case "failed":
                return {
                    icon: XCircle,
                    label: "Failed",
                    className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                }
            default:
                return {
                    icon: Activity,
                    label: status,
                    className: "bg-muted"
                }
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatDateTime = (date: string) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (isLoading) {
        return <TransactionsLoading />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/admin/clients/${organizationId}`)}
                        className="mb-2 -ml-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Organization
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {mockOrganization.name} - Transactions
                    </h1>
                    <p className="text-muted-foreground">
                        View all wallet transactions and payment history
                    </p>
                </div>
                <Button onClick={() => router.push(`/admin/clients/${organizationId}`)}>
                    View Wallet
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(mockWallet.balance)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Available funds
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCredits)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Money received
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalDebits)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Money spent
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending/Failed</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending + stats.failed}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.pending} pending, {stats.failed} failed
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Transactions</CardTitle>
                            <CardDescription>
                                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="credit">Credits</SelectItem>
                                <SelectItem value="debit">Debits</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredTransactions.length > 0 ? (
                        <div className="space-y-3">
                            {filteredTransactions.map((transaction) => {
                                const statusConfig = getStatusBadge(transaction.status)
                                const StatusIcon = statusConfig.icon
                                
                                return (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={`p-2 rounded-full flex-shrink-0 ${
                                                transaction.type === 'credit' 
                                                    ? 'bg-green-500/10' 
                                                    : 'bg-red-500/10'
                                            }`}>
                                                {transaction.type === 'credit' ? (
                                                    <ArrowDownRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                ) : (
                                                    <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-1">
                                                    {transaction.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs text-muted-foreground">
                                                        {transaction.reference}
                                                    </p>
                                                    {transaction.paystackReference && (
                                                        <>
                                                            <span className="text-xs text-muted-foreground">•</span>
                                                            <p className="text-xs text-muted-foreground">
                                                                {transaction.paystackReference}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {formatDateTime(transaction.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <p className={`text-sm font-semibold whitespace-nowrap ${
                                                transaction.type === 'credit' 
                                                    ? 'text-green-600 dark:text-green-400' 
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                            </p>
                                            <Badge 
                                                variant="outline" 
                                                className={`text-xs mt-2 ${statusConfig.className}`}
                                            >
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusConfig.label}
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 border border-dashed rounded-lg">
                            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                            <p className="text-sm text-muted-foreground">
                                {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                                    ? "Try adjusting your search filters"
                                    : "No transactions have been recorded yet"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
