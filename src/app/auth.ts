import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/core/db/prisma";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

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
          throw new AuthError("SUPRESS Invalid input", {
            cause: "Invalid input",
          });
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
          throw new AuthError("SUPRESS User don't exists", {
            cause: "User don't exists",
          });

        //signin with Google don't require password
        if (!user.password)
          throw new AuthError("SUPRESS Invalid Email or Password", {
            cause: "Invalid Email or Password",
          });

        const pasStatus = await compare(password, user?.password);
        if (!pasStatus)
          throw new AuthError("SUPRESS Wrong Password", {
            cause: "Wrong Password",
          });

        return { name: user.name, email: user.email, id: user.id };
      },
    }),
  ],
  //this callback is called when the user signup with 3rd party providers
  callbacks: {
    signIn: async ({ user, account, credentials }) => {
      if (account?.provider === "google" && user.email) {
        try {
          try {
            const prisma = await connectToDB();
            if (prisma === undefined) {
              throw new AuthError("Failed to connect to DB", {
                cause: "Failed to connect to DB",
              });
            }
          } catch (error) {
            console.log(error);
            return false;
          }

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
          if (error === "AuthError") {
          }
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
    authorized: async ({ request, auth }) => {
      if (
        !auth &&
        request.nextUrl.pathname !== "/login" &&
        request.nextUrl.pathname !== "/signup"
      ) {
        const newUrl = new URL("/login", request.nextUrl.origin);
        return NextResponse.redirect(newUrl);
      }
    },
  },
  logger: {
    error(error: Error) {
      if (error?.name === "AuthError") {
        //if there is SUPRESS in the Error Message then return it otherwise only log it
        if (error.message.includes("SUPRESS")) {
          return;
        }
        console.error(error);
      }
    },
    warn(code) {
      // Handle warnings
    },
    debug(code, metadata) {
      // Handle debug messages
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 2592000, // 30 days,
    updateAge: 86400, // 24 hours
  },
});
