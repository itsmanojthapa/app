"use server";
import { connectToDB } from "@/core/db/prisma";

var { hash } = require("bcryptjs");
const saltRounds = 10;
// import { connectToDB } from "@/db/prisma";
interface Result {
  success: boolean;
  message?: string;
  redirectTo?: string;
  data?: { name: string; email: string };
}

export default async function signupAction(
  name: string,
  email: string,
  password: string
): Promise<Result> {
  try {
    if (!name || !email || !password)
      return { success: false, message: "Enter Valid Data" };

    const prisma = await connectToDB();
    if (prisma === undefined) {
      return { success: false, message: "Failed to connect to DB" };
    }

    const hashedPassword = await hash(password, saltRounds);
    const isExist = await prisma.user.findFirst({
      where: { email: email },
    });

    if (isExist) return { success: false, message: "User already exists" };

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
    const resUser = await prisma.user.findFirst({
      where: { email: email },
      select: { name: true, email: true, password: false, id: false },
    });
    if (!resUser) return { success: false, message: "Fail to crate user" };
    return { success: true, redirectTo: "/login" };
  } catch (error) {
    console.error("Signup Error:", (error as Error).message);
    return { success: false, message: (error as Error).message };
  }
}
