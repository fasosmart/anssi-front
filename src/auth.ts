import NextAuth from "next-auth"
import type { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
            return null;
        }

        try {
            // 1. Get tokens from the API
            const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/jwt/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            if (!tokenResponse.ok) {
                // You can inspect tokenResponse.status and the body for more details
                console.error("Failed to fetch token:", await tokenResponse.text());
                return null;
            }

            const tokens = await tokenResponse.json();
            const { access, refresh } = tokens;
            
            // 2. Use access token to get user details
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                },
            });

            if (!userResponse.ok) {
                console.error("Failed to fetch user:", await userResponse.text());
                return null;
            }

            const user: User = await userResponse.json();

            // 3. Return a user object with tokens for the JWT callback
            return { 
                ...user, 
                accessToken: access, 
                refreshToken: refresh 
            };

        } catch (error) {
            console.error("Authorize error:", error);
            return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // The 'user' object is only available during the initial sign-in.
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.user = {
            id: user.slug ?? null,
            emailVerified: null,
            first_name: user.first_name,
            last_name: user.last_name,
            slug: user.slug,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        }
      }

      // This trigger is fired when the session is updated from the client side.
      if (trigger === "update" && session?.user) {
        token.user = { ...token.user, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      // Pass the user data and tokens to the session object
      if (token.user && session.user) {
        session.user.first_name = token.user.first_name ?? undefined;
        session.user.last_name  = token.user.last_name ?? undefined;
        session.user.slug       = token.user.slug ?? undefined;
        session.user.name       = token.user.name ?? undefined;
      }
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      
      return session;
    }
  },
  pages: {
    signIn: '/login',
    // error: '/auth/error', // You can add a custom error page
  },
  session: {
    strategy: "jwt",
  },
})