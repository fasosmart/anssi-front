import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * available here as `user`.
   */
  interface User {
    id?: string | null;
    emailVerified?: Date | null;
    accessToken?: string;
    refreshToken?: string;
    first_name?: string;
    last_name?: string;
    slug?: string;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    error?: "RefreshAccessTokenError";
    accessToken?: string;
    refreshToken?: string;
    user: {
      id?: string | null;
      email?: string | null;
      emailVerified?: Date | null;
      name?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      slug?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    error?: "RefreshAccessTokenError";
    accessToken?: string;
    refreshToken?: string;
    user?: {
        id?: string | null;
        email?: string | null;
        emailVerified?: Date | null;
        name?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        slug?: string | null;
    }
  }
}