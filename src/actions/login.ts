"use server";

import { signIn } from "@/app/auth";
import { CredentialsSignin } from "next-auth";

export default async function loginAction(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
    });
    return;
  } catch (error) {
    const err = error as CredentialsSignin;
    return err.cause;
  }
}
