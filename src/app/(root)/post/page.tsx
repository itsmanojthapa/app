import InputPost from "@/components/form/inputPost";
import { auth } from "@/middleware";
import { redirect } from "next/navigation";

export default async function Page() {
  return (
    <>
      <div className="px-5 py-2 w-screen h-screen">
        <InputPost />
      </div>
    </>
  );
}
