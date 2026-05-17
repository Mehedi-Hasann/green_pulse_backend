import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client/extension";
// import { PrismaClient } from '@prisma/client';

const connectionString = "postgresql://neondb_owner:npg_IWB6aPXj5QsS@ep-polished-sunset-a8o5ndqa-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
