export default function AdminInvoicesPage() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-muted p-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                    <p className="text-lg text-muted-foreground">Coming Soon</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                        View and manage all invoices across the platform. This feature is currently under development.
                    </p>
                </div>
            </div>
        </div>
    )
}

