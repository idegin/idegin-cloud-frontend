import { AcceptInviteForm } from "@/components/auth/accept-invite-form";
import { redirect } from "next/navigation";

interface AcceptInvitePageProps {
    searchParams: { token?: string };
}
export default async function AcceptInvitePage({
    searchParams,
}: AcceptInvitePageProps) {
    const { token } = await searchParams;
    console.log(token);
    if (!token) {
        console.log("No token found");
        redirect("/auth/login");
    }

    console.log(token);

    return (
        <div className='min-h-screen flex items-center justify-center bg-muted/30 p-4'>
            <div className='w-full max-w-md space-y-6'>
                <AcceptInviteForm token={token} />
            </div>
        </div>
    );
}
