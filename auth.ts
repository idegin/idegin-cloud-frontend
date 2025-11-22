import NextAuth, { getServerSession } from "next-auth";
import type { NextAuthOptions, } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthenticationService } from "./lib/api/services/AuthenticationService";
import { OpenAPI } from "./lib/api";
import
{
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

// Set default NEXTAUTH_URL if not provided (required by NextAuth)
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: any)
{
  try {
    console.log("Refreshing access token...");

    // Set the current refresh token for the API call
    OpenAPI.TOKEN = token.refreshToken;

    // Try to refresh the token using your backend service
    const response = await AuthenticationService.postAuthRefreshToken({
      refreshToken: token.refreshToken,
    });

    if (response.data?.accessToken) {
      const refreshedTokens = {
        accessToken: response.data.accessToken,
        refreshToken: token.refreshToken, // Keep the same refresh token
        accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
        refreshTokenExpires: token.refreshTokenExpires,
      };

      console.log("Token refreshed successfully");
      return {
        ...token,
        ...refreshedTokens,
      };
    }

    console.log("Token refresh failed, returning expired token");
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials)
      {
        try {
          const { email, password } = credentials as { email: string; password: string; };
          const authResponse = await AuthenticationService.postAuthLogin({ email, password });

          console.log(authResponse);

          if (authResponse.data?.accessToken) {
            OpenAPI.TOKEN = authResponse.data.accessToken;
            const profileResponse = await AuthenticationService.getAuthProfile();

            if (authResponse.data?.user && authResponse.data?.accessToken) {
              return {
                id: authResponse.data.user._id || "",
                email: authResponse.data.user.email || "",
                name: authResponse.data.user.name || "",
                role: (authResponse.data.user.role as "super_admin" | "client") || "client",
                accessToken: authResponse.data.accessToken || "",
                isFirstLogin: authResponse.data.user.isFirstLogin || false,
                refreshToken: authResponse.data.refreshToken || "",
                organizationUsers: profileResponse.data?.organizationUsers || [],
              };
            }
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session })
    {
      // Initial sign in
      if (user) {
        console.log(user);
        token.role = (user as any).role;
        token.id = (user as any).id;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.organizationUsers = (user as any).organizationUsers;
        token.isFirstLogin = (user as any).isFirstLogin || false;
        token.email = (user as any).email;
        token.name = (user as any).name;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        token.refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
        return token;
      }

      // Handle session update trigger
      if (trigger === "update") {
        if (session.user) {
          return {
            ...token,
            ...session.user,
          };
        }
        // try {
        //   console.log("Session update triggered, fetching latest user data...");

        //   // Set the access token for the API call
        //   OpenAPI.TOKEN = token.accessToken as string;

        //   // Fetch latest user profile data
        //   const profileResponse = await AuthenticationService.getAuthProfile();

        //   if (profileResponse.data) {
        //     // Update token with latest data
        //     token.organizationUsers = profileResponse.data.organizationUsers || token.organizationUsers;
        //     // @ts-ignore
        //     token.isFirstLogin = profileResponse.data.user?.isFirstLogin || token.isFirstLogin || false;
        //     token.email = profileResponse.data.user?.email || token.email || "";
        //     token.name = profileResponse.data.user?.name || token.name || "";
        //     token.role = profileResponse.data.user?.role || token.role || "client";
        //     token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        //     token.refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
        //     console.log("Session updated with latest data");
        //   }

        //   console.log(token);

        //   return token;
        // } catch (error) {
        //   console.error("Error updating session:", error);
        //   // If update fails, try to refresh the token
        //   return await refreshAccessToken(token);
        // }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token);
    },
    async session({ session, token })
    {
      console.log(session);
      console.log(token);
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).refreshToken = token.refreshToken;
        (session.user as any).organizationUsers = token.organizationUsers;
        (session.user as any).isFirstLogin = token.isFirstLogin;
        (session as any).error = token.error;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);


export function serverSession(
  ...args: [
    GetServerSidePropsContext[ "req" ],
    GetServerSidePropsContext[ "res" ]
  ] | [ NextApiRequest, NextApiResponse ] | []
)
{
  return getServerSession(...args, authOptions);
}

