import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: { token?: string };
}) {
    console.log(searchParams);
    const { token } = await searchParams;
    console.log(token);
    if (!token) {
        redirect("/auth/forgot-password");
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
                <ResetPasswordForm token={token} />
            </div>
        </div>
    );
}
