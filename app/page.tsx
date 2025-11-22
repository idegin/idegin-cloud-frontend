import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function HomePage() {
    const session = await getServerSession(authOptions);
    console.log("Server session:", session);

    if (session?.user) {
        if (session.user.role === "super_admin") {
            redirect("/admin");
        } else {
            redirect("/dashboard/projects");
        }
    }

    redirect("/auth/login");
}
