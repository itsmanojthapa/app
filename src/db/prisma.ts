import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

let prisma: PrismaClient;
let isConnected = false;

declare global {
  // This is necessary to prevent TypeScript from complaining about the global property
  var prisma: PrismaClient;
}

export async function connectToDB(): Promise<PrismaClient | undefined> {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE not found ❌");
    return;
  }
  if (!prisma) {
    prisma = new PrismaClient();
    global.prisma = prisma;
  }

  if (!isConnected) {
    try {
      await prisma.$connect();
      // Verify connection by running a simple query
      try {
        await prisma.user.findFirst();
      } catch (error) {
        console.error("Failed to connect DB ❌:", error);
        return;
      }
      isConnected = true;
      console.log("Connected to DB 🗄️");
      return prisma;
    } catch (error) {
      console.error("Failed to connect DB ❌:", error);
      return;
    }
  } else {
    console.log("Already connected to DB 🗄️");
    return prisma;
  }
}

export { prisma };
