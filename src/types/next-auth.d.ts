import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * available here as `user`.
   */
  interface User {
    accessToken?: string;
    refreshToken?: string;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id?: string | null;
      email?: string | null;
      name?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    user?: {
        id?: string | null;
        email?: string | null;
        name?: string | null;
    }
  }
}