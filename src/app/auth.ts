import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/db/prisma";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    //this callback gets called when the user signin with email password
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async ({ email, password }) => {
        const prisma = await connectToDB();
        if (prisma === undefined)
          throw new AuthError("Failed to connect to DB", {
            cause: "Failed to connect to DB",
          });
        // throw {
        //   name: "AuthError",
        //   message: "Failed to connect to DB",
        //   cause: "Failed to connect to DB",
        // };

        if (typeof email !== "string" || typeof password !== "string") {
          throw new AuthError("Invalid input", { cause: "Invalid input" });
        }

        const user = await prisma.user.findFirst({
          where: { email: email },
          select: {
            email: true,
            id: true,
            name: true,
            password: true,
            isVerified: true,
          },
        });
        //if user.isVerified ===  false redirect to verify
        if (!user)
          throw new AuthError("User don't exists", {
            cause: "User don't exists",
          });

        //signin with Google don't require password
        if (!user.password)
          throw new AuthError("Invalid Email or Password", {
            cause: "Invalid Email or Password",
          });

        const pasStatus = await compare(password, user?.password);
        if (!pasStatus)
          throw new AuthError("Wrong Password", {
            cause: "Wrong Password",
          });

        return { name: user.name, email: user.email, id: user.id };
      },
    }),
  ],
  logger: {
    error(error: Error) {
      // Suppress error logging or log to another service
      if (error?.name === "AuthError" || error.message.includes("AuthError"))
        return;
    },
    warn(code) {
      // Handle warnings
    },
    debug(code, metadata) {
      // Handle debug messages
    },
  },
  //this callback is called when the user signup with 3rd party providers
  callbacks: {
    signIn: async ({ user, account, credentials }) => {
      if (account?.provider === "google" && user.email) {
        try {
          const { email, name, image, id } = user;
          if (!email || !name)
            throw new AuthError("Google OAuth 2 Error", {
              cause: "Google OAuth 2 Error",
            });
          const isExist = await prisma.user.findFirst({
            where: { email: email },
          });
          if (!isExist) {
            const newUser = await prisma.user.create({
              data: {
                name: name,
                email: email,
                isVerified: true,
                googleID: id,
                image: image,
              },
            });
          }
          return true;
        } catch (error) {
          throw new AuthError("Failed to create user", {
            cause: "Failed to create user",
          });
        }
      }

      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
