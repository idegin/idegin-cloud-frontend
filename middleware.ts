import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req)
  {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const isLoggedIn = !!token;
    const userRole = token?.role;



    console.log(token);

    // Public routes
    const isAuthPage = pathname.startsWith("/auth");
    const isInvitationPage = pathname.startsWith("/invitations");

    // Redirect logged-in users away from auth pages
    if (isLoggedIn && isAuthPage) {
      // Allow access to reset-new-password page for first-time login users
      if (pathname === "/auth/reset-new-password") {
        return NextResponse.next();
      }

      const redirectUrl = userRole === "super_admin" ? "/admin" : "/dashboard/projects";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    if (pathname.startsWith("/admin") && userRole !== "super_admin" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/projects", req.url));
    }

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard") && !isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Redirect first-time login users to reset password page
    if (isLoggedIn && token?.isFirstLogin && pathname !== "/auth/reset-new-password") {
      return NextResponse.redirect(new URL("/auth/reset-new-password", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) =>
      {
        const { pathname } = req.nextUrl;
        const isAuthPage = pathname.startsWith("/auth");
        const isInvitationPage = pathname.startsWith("/invitations");
        const walletVerifyPage = pathname.startsWith("/wallet/verify");

        // Allow access to auth pages and invitation pages without token
        if (isAuthPage || isInvitationPage || walletVerifyPage) return true;

        // Require token for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [ "/((?!api|_next/static|_next/image|favicon.ico).*)", "/dashboard/:path*", "/admin/:path*" ],

};
