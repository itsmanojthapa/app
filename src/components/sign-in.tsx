import { signIn } from "@/app/auth";
import { Button } from "./ui/button";
import React from "react";

export default function SignIn() {
  return (
    <div className="bg-yellow-600 rounded-lg w-32 text-lg font-bold">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}>
        <Button type="submit">Signin with Google</Button>
      </form>
    </div>
  );
}
