import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LoginForm from "@/components/client/loginForm";
import { auth, signIn } from "@/app/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  if (session?.user) redirect("/");
  return (
    <div className="w-full h-full">
      <Card className="w-[350px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CardHeader className="flex items-center">
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col justify-between gap-4">
          <span>or</span>
          <form
            className="w-full"
            action={async () => {
              "use server";
              await signIn("google", { redirect: true, redirectTo: "/" });
            }}>
            <Button variant="outline" className="w-full" type="submit">
              Login with google
            </Button>
          </form>
          <Link href="/signup">Don&apos;t have an account? Signup</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
