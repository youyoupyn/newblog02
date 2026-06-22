import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createAdapter() {
  const url = process.env.DATABASE_URL || "";
  // PostgreSQL 连接串 → 用 PG 适配器
  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
    return new PrismaPg({ connectionString: url });
  }
  // SQLite → 用 libSQL 适配器（本地开发）
  return new PrismaLibSql({ url });
}

const createPrisma = () => {
  return new PrismaClient({ adapter: createAdapter() });
};

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
