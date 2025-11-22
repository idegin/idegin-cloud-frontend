import { ResetNewPasswordForm } from "@/components/auth/reset-new-password-form";
import { redirect } from "next/navigation";
import { serverSession } from "@/auth";

interface ResetNewPasswordPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ResetNewPasswordPage({
    searchParams,
}: ResetNewPasswordPageProps) {
    const session = await serverSession();

    // Redirect if user is not authenticated
    if (!session) {
        redirect("/auth/login");
    }

    // Redirect if user is not a first-time login user
    if (!session.user?.isFirstLogin) {
        redirect("/dashboard/projects");
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-muted/30 p-4'>
            <div className='w-full max-w-md space-y-6'>
                <div className='text-center space-y-2'>
                    <h1 className='text-4xl font-bold tracking-tight'>
                        iDegin Cloud
                    </h1>
                    <p className='text-muted-foreground'>
                        Professional hosting management platform
                    </p>
                </div>
                <ResetNewPasswordForm />
            </div>
        </div>
    );
}
