export default function AdminUsersPage() {
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
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Admin Users</h1>
                    <p className="text-lg text-muted-foreground">Coming Soon</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Manage admin users and their permissions. This feature is currently under development.
                    </p>
                </div>
            </div>
        </div>
    )
}
