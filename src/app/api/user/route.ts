import { headers } from "next/headers";
import printLogToFile from "@/utils/printLogToFile";
import { type NextRequest } from "next/server";
import { connectToDB } from "@/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");
    const prisma = await connectToDB();
    if (!prisma) throw new Error("Failed to connect to DB");

    if (!email) {
      const users = await prisma.user.findMany();
      return Response.json({ users: users }, { status: 201 });
    }
    // const headersList = headers();
    // const referer = headersList.get("ifnotfoundUndefinedSoUse!ForNull");
    // return new Response(`Hello, Next.js! \n`, {
    //   status: 200,
    //   headers: { referer: referer! },
    // });
    const user = await prisma.user.findFirst({ where: { email: email! } });

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}

// export async function POST(req: Request) {
//   try {
//     const text = await req.text();
//     const data = await JSON.parse(text);
//     const { email, password, name } = data;

//     if (
//       typeof name !== "string" ||
//       typeof email !== "string" ||
//       typeof password !== "string"
//     ) {
//       return Response.json({ error: "Type Error" }, { status: 403 });
//     }

//     let user: Prisma.UserCreateInput;
//     user = { email: email, password: password, name: name };

//     const exists = await prisma.user.findFirst({
//       where: { email: user.email },
//     });

//     if (exists) {
//       return Response.json({ error: "Email Already Exists" }, { status: 403 });
//     }

//     const createUser = await prisma.user.create({ data: user });

//     return Response.json({ createUser }, { status: 201 });
//   } catch (error) {
//     return Response.json({ error: error }, { status: 500 });
//   }
// }
