import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthenticationService } from "./lib/api/services/AuthenticationService";

const authOptions: NextAuthOptions = {
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

          if (authResponse.data?.user && authResponse.data?.accessToken) {
            return {
              id: authResponse.data.user._id || "",
              email: authResponse.data.user.email || "",
              name: authResponse.data.user.name || "",
              role: "client" as const, // Default role since API doesn't return role
            };
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
    async jwt({ token, user })
    {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token })
    {
      if (session.user) {
        session.user.role = token.role as "super_admin" | "client";
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export default authOptions;
