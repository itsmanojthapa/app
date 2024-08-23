import { auth, signIn, signOut } from "@/app/auth";
import Check from "@/components/Check";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  // const cook = cookies().get("authjs.session-token");
  // console.log(cook);

  // console.log(
  //   await decode({
  //     token: cook?.value,
  //     secret: process.env.AUTH_SECRET!,
  //     salt: cook?.name!,
  //   })
  // );

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-center align-middle font-mono text-sm flex flex-col">
          <div className="text-red-500 font-bold">{user?.email}</div>
          <div className="flex justify-around w-full">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}>
              <Button type="submit">Sign Out</Button>
            </form>
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}>
              <Button type="submit">Signin with Google</Button>
            </form>
          </div>
        </div>
        <Check />
      </main>
    </>
  );
}
