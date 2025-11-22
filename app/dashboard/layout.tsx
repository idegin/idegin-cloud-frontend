import { serverSession } from "@/auth";

import { redirect } from "next/navigation";
import React from "react";

interface layoutProps {
    children: React.ReactNode;
}
const layout = async ({ children }: layoutProps) => {
    const session = await serverSession();

    if (session?.user?.isFirstLogin) {
        redirect("/auth/reset-new-password");
    }
    return <>{children}</>;
};

export default layout;
