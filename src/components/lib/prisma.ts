import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient({
//   log: ["query", "info", "warn", "error"],
// });

/**This line creates a variable globalForPrisma that references the global object (global). The purpose of this is to ensure that there’s a single 
 * instance of PrismaClient that persists across the lifecycle of the application, especially in a development environment 
 * where modules may be reloaded frequently.
 This line creates a variable globalForPrisma that references the global object (global). The purpose of this is to ensure that there’s a single 
 instance of PrismaClient that persists across the lifecycle of the application, especially in a development environment where modules may be reloaded frequently.
*/
const globalForPrisma = global as unknown as { prisma: PrismaClient };
//Create or Reuse PrismaClient Instance
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

async function connectToDB() {
  await prisma.$connect();
  console.log("Connected to DB");
}

// Call the connection function immediately
connectToDB();

// Export prisma for use in other files
export { prisma };
