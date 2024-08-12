import { auth, signOut } from "@/app/auth";
import SignIn from "@/components/sign-in";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import Check from "@/components/Check";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  const cook = cookies().get("next-auth.session-token");
  // console.log(
  //   await decode({
  //     token: cook?.value,
  //     secret: process.env.AUTH_SECRET!,
  //     salt: cook?.name!,
  //   })
  // );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center align-middle font-mono text-sm lg:flex">
        <SignIn />
        {/* <form action={await signOut()}>
          <button type="submit">SignOut</button>
        </form> */}
      </div>
      <Check />
    </main>
  );
}
