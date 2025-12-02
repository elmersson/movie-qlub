import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Database connection successful");

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("Simple query result:", result);

    await prisma.$disconnect();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("Error code:", error.code);
  }
}

testConnection();
