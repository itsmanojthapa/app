import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "@/app/auth";
import SignupComp from "@/components/client/signupComp";

const Page = () => {
  return (
    <div className="w-full h-full">
      <Card className="w-[350px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CardHeader className="flex items-center gap-4">
          <CardTitle>Signup</CardTitle>
          <form
            className="w-full"
            action={async () => {
              "use server";
              const log = await signIn("google", {
                redirect: true,
                redirectTo: "/",
              });
            }}>
            <Button variant="outline" className="w-full" type="submit">
              Login with google
            </Button>
          </form>
          <span>or</span>
        </CardHeader>
        <CardContent>
          <SignupComp />
        </CardContent>
        <CardFooter className="flex flex-col justify-between ">
          <Link href="/login">You have an account? Login</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
