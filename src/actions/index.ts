import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export async function play() {
  "use server";

  console.log("Clicked");

  const user = await prisma.user.create({
    data: {
      name: "manoj thapa",
      email: "manoj@mail.prisma",
    },
  });
  const resUser = await prisma.user.findFirst({
    where: { name: "manoj thapa" },
  });
  console.log("Typ We dit it: " + user);
  console.log("Thats it: " + resUser);
}
