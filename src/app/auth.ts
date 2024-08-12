import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    //this callback is called when the user signin&up with email and password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async ({ email, password }) => {
        if (typeof email !== "string" || typeof password !== "string") {
          throw new CredentialsSignin("Invalid input");
        }

        const user = { email, password };
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  //this callback is called when the user signin&up with 3rd party providers
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google" && user.email) {
        try {
          const { email, name, image, id } = user;
          //connect DB
          //check if uesr exits
          //if not create user
          return true;
        } catch (error) {
          throw new AuthError("Failed to create user");
        }
      }
      return false;
    },
  },
});
