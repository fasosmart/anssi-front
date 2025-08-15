import NextAuth from "next-auth"
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
        // For now, let's just return a mock user
        // In the future, you will add your database logic here
        if (credentials.email && credentials.password) {
          return { id: "1", name: "Admin User", email: credentials.email as string };
        }
        return null;
      }
    })
  ]
})