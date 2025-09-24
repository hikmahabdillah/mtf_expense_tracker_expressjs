// All user DB logic should use the Prisma client.
import { prisma } from "../../core/config/db.js";

export const findUserByEmail = async (email) =>
  await prisma.user.findUnique({ where: { email } });
